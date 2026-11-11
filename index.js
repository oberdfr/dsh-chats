/**
 * Host half of the Chats plugin.
 *
 * Chats live in one registered Workspace titled "Chats". That Workspace is
 * what the hero picker and the composer resolve, so a chat can be typed into
 * immediately. Each chat has:
 *
 *   - a real data directory `<DSH_HOME>/chats-workspace/data/<chat-id>`,
 *   - a per-chat link directory `<DSH_HOME>/chat-links/<chat-id>` that is a
 *     junction (POSIX: symlink) to the Chats Workspace root.
 *
 * The Session is created with `cwd` = the link directory, then attached to the
 * Chats Workspace. Its immutable header cwd therefore canonicalizes to the
 * Chats Workspace, while `workingDirectory` points at the per-chat data
 * directory. Moving a chat repoints that link to a real Workspace, attaches the
 * Session there, and detaches it from Chats; the shipped Workspace browser then
 * moves the row on its own.
 */
import { cp, lstat, mkdir, readdir, readFile, rename, rm, rmdir, stat, symlink, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { homedir } from 'node:os'
import path from 'node:path'

const API_PATH = '/api/dsh-chats'
const LOG_PREFIX = '[dsh-chats]'

/** Host services this bundle needs. */
export const inject = ['agents', 'sessionController', 'sessions', 'tools', 'webServer', 'workingDirectory', 'workspaceRegistry']

function dshHome() {
  const home = process.env.DSH_HOME
  return home !== undefined && home.length > 0 ? home : path.join(homedir(), '.dsh')
}

/** Index plus the legacy per-chat data directories. */
function dataRoot() {
  return path.join(dshHome(), 'chats')
}

/** Registered Workspace that owns every chat Session. */
function workspaceRoot() {
  return path.join(dshHome(), 'chats-workspace')
}

/** Junction directories that carry each Session's immutable header cwd. */
function linkRoot() {
  return path.join(dshHome(), 'chat-links')
}

function indexFile() {
  return path.join(dataRoot(), 'index.json')
}

function linkType() {
  return process.platform === 'win32' ? 'junction' : 'dir'
}

function nowIso() {
  return new Date().toISOString()
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}

function samePath(left, right) {
  const a = path.resolve(left)
  const b = path.resolve(right)
  return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b
}

function isInside(child, parent) {
  const rel = path.relative(path.resolve(parent), path.resolve(child))
  if (rel === '') return false
  if (rel.startsWith('..') || path.isAbsolute(rel)) return false
  return true
}

function looksLikePath(value) {
  return /^[a-zA-Z]:[\\/]/.test(value) || value.startsWith('\\\\') || value.startsWith('/') || value.startsWith('~') || value.includes('/') || value.includes('\\')
}

function expandHome(value) {
  if (value === '~') return homedir()
  if (value.startsWith('~/') || value.startsWith('~\\')) return path.join(homedir(), value.slice(2))
  return value
}

function safeDirName(value) {
  const cleaned = value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/^[. ]+|[. ]+$/g, '')
    .slice(0, 64)
  return cleaned.length > 0 ? cleaned : `workspace-${Date.now()}`
}

function defaultWorkspaceParent() {
  return path.join(homedir(), 'Documents')
}

async function ensureDirectory(directory) {
  await mkdir(directory, { recursive: true })
  const info = await stat(directory)
  if (!info.isDirectory()) throw new Error(`"${directory}" is not a directory`)
  return directory
}

/** Remove a directory, junction, or symlink without following the link. */
async function removePath(target) {
  const info = await lstat(target).catch(() => undefined)
  if (info === undefined) return
  if (info.isSymbolicLink()) await rmdir(target).catch(() => undefined)
  else await rm(target, { recursive: true, force: true }).catch(() => undefined)
}

/** Recursively list every entry (including symlinks) relative to `root`. */
async function listFiles(root) {
  const files = []
  async function walk(directory, prefix) {
    let entries
    try {
      entries = await readdir(directory, { withFileTypes: true })
    } catch (error) {
      if (error?.code === 'ENOENT') return
      throw error
    }
    for (const entry of entries) {
      const rel = prefix === '' ? entry.name : `${prefix}${path.sep}${entry.name}`
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) await walk(absolute, rel)
      else if (entry.isFile() || entry.isSymbolicLink()) files.push(rel)
    }
  }
  await walk(root, '')
  return files
}

async function conflictsBetween(source, destination) {
  const files = await listFiles(source)
  const conflicts = []
  for (const relative of files) {
    try {
      await stat(path.join(destination, relative))
      conflicts.push(relative)
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
  }
  return { files, conflicts }
}

class ChatStore {
  constructor(ctx) {
    this.ctx = ctx
    this.directory = dataRoot()
    this.file = indexFile()
    this.chats = []
    this.chatsWorkspaceId = undefined
    this.chain = Promise.resolve()
    this.ready = this.load()
    this.migrated = Promise.resolve()
  }

  async load() {
    try {
      const raw = await readFile(this.file, 'utf8')
      const parsed = JSON.parse(raw)
      const chats = Array.isArray(parsed?.chats) ? parsed.chats : []
      this.chats = chats
        .filter((chat) => typeof chat?.id === 'string' && (typeof chat?.path === 'string' || typeof chat?.dataPath === 'string'))
        .map((chat) => ({
          ...chat,
          dataPath: typeof chat.dataPath === 'string' ? chat.dataPath : chat.path,
          linkPath: typeof chat.linkPath === 'string' ? chat.linkPath : null,
        }))
    } catch (error) {
      if (error?.code !== 'ENOENT') this.ctx.logger?.warn?.(`${LOG_PREFIX} could not read chat index: ${messageOf(error)}`)
      this.chats = []
    }
  }

  list() {
    return this.chats.map((chat) => ({ ...chat }))
  }

  findById(id) {
    return this.chats.find((chat) => chat.id === id)
  }

  findBySession(sessionId) {
    if (typeof sessionId !== 'string' || sessionId.length === 0) return undefined
    return this.chats.find((chat) => chat.sessionId === sessionId)
  }

  async update(mutator) {
    const run = this.chain.then(async () => {
      await this.ready
      const next = await mutator(this.chats)
      this.chats = next
      await this.save()
      return next
    })
    this.chain = run.then(() => undefined, () => undefined)
    return run
  }

  async save() {
    await mkdir(this.directory, { recursive: true })
    const temporary = `${this.file}.${process.pid}.${Date.now()}.tmp`
    await writeFile(temporary, JSON.stringify({ version: 2, chats: this.chats }, null, 2), 'utf8')
    await rename(temporary, this.file)
  }
}

function publicChat(chat) {
  return {
    id: chat.id,
    sessionId: chat.sessionId ?? null,
    title: chat.title,
    path: chat.linkPath ?? chat.dataPath ?? chat.path,
    dataPath: chat.dataPath ?? chat.path,
    linkPath: chat.linkPath ?? null,
    workspaceId: chat.workspaceId ?? null,
    createdAt: chat.createdAt,
    movedTo: chat.movedTo ?? null,
  }
}

/** Ensure the single registered "Chats" Workspace and keep it first. */
async function ensureChatsWorkspace(ctx, store, options = {}) {
  const order = options.order !== false
  const root = workspaceRoot()
  await mkdir(root, { recursive: true })
  const registry = ctx.workspaceRegistry
  let entity = await registry.resolveByPath(root).catch(() => undefined)
  let created = false
  if (entity === undefined) {
    entity = await registry.create(root, 'Chats')
    created = true
  }
  if (order) {
    const first = registry.list()[0]
    if (first !== undefined && first.id !== entity.id) await registry.insertBefore(entity.id, first.id)
  }
  store.chatsWorkspaceId = entity.id
  if (created) {
    for (const chat of store.list()) {
      if (typeof chat.sessionId === 'string' && chat.sessionId.length > 0 && (chat.movedTo === null || chat.movedTo === undefined)) {
        await entity.attachSession(chat.sessionId).catch((error) => {
          ctx.logger?.warn?.(`${LOG_PREFIX} could not attach restored chat ${chat.id}: ${messageOf(error)}`)
        })
      }
    }
  }
  return entity
}

async function findChatForSession(ctx, store, sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length === 0) return undefined
  const existing = store.findBySession(sessionId)
  if (existing !== undefined) return existing
  const entity = await ensureChatsWorkspace(ctx, store)
  if (!entity.sessionIds.includes(sessionId)) return undefined
  const agent = ctx.agents.get(sessionId)
  if (agent === undefined) return undefined
  const dataPath = ctx.workingDirectory.get(agent.session)
  const linkPath = agent.session.header.cwd
  if (typeof dataPath !== 'string' || typeof linkPath !== 'string') return undefined
  const recovered = {
    id: `chat-${randomUUID()}`,
    sessionId,
    title: 'New chat',
    dataPath,
    linkPath,
    workspaceId: entity.id,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    movedTo: null,
  }
  await store.update((chats) => [recovered, ...chats])
  return recovered
}

/**
 * Create one chat: data directory, header-cwd link, and (for this Client
 * generation) the Session itself. Older Client generations receive the paths
 * and create/bind their own Session through the `bind` action.
 */
async function createChat(ctx, store, body) {
  const entity = await ensureChatsWorkspace(ctx, store)
  const id = `chat-${randomUUID()}`
  const dataPath = path.join(workspaceRoot(), 'data', id)
  const linkPath = path.join(linkRoot(), id)
  await mkdir(dataPath, { recursive: true })
  await mkdir(linkRoot(), { recursive: true })
  await removePath(linkPath)
  await symlink(entity.path, linkPath, linkType())

  let sessionId = null
  if (body.hostSession === true) {
    try {
      const created = await ctx.sessionController.create({ cwd: linkPath })
      sessionId = created.sessionId
    } catch (error) {
      await removePath(dataPath)
      await removePath(linkPath)
      throw error
    }
    await entity.attachSession(sessionId).catch((error) => {
      ctx.logger?.warn?.(`${LOG_PREFIX} could not attach new chat Session: ${messageOf(error)}`)
    })
    const agent = ctx.agents.get(sessionId)
    if (agent !== undefined) {
      await ctx.workingDirectory.set(agent, dataPath).catch((error) => {
        ctx.logger?.warn?.(`${LOG_PREFIX} could not set chat working directory: ${messageOf(error)}`)
      })
    }
  }

  const now = nowIso()
  const chat = {
    id,
    sessionId,
    title: typeof body.title === 'string' && body.title.trim().length > 0 ? body.title.trim() : 'New chat',
    dataPath,
    linkPath,
    workspaceId: entity.id,
    createdAt: now,
    updatedAt: now,
    movedTo: null,
  }
  await store.update((chats) => [chat, ...chats])
  return chat
}

/** Convert pre-Chats-Workspace records into the link/data layout. */
async function migrateChats(ctx, store) {
  const entity = await ensureChatsWorkspace(ctx, store)
  for (const chat of store.list()) {
    if (chat.linkPath !== null && chat.linkPath !== undefined) continue
    if (chat.movedTo !== null && chat.movedTo !== undefined) continue
    if (typeof chat.sessionId !== 'string' || chat.sessionId.length === 0) continue
    const legacyPath = chat.path
    if (typeof legacyPath !== 'string' || legacyPath.length === 0) continue
    try {
      const dataPath = path.join(workspaceRoot(), 'data', chat.id)
      await mkdir(dataPath, { recursive: true })
      const info = await lstat(legacyPath).catch(() => undefined)
      if (info !== undefined && info.isDirectory() && !info.isSymbolicLink()) {
        const { files, conflicts } = await conflictsBetween(legacyPath, dataPath)
        if (conflicts.length > 0) {
          ctx.logger?.warn?.(`${LOG_PREFIX} cannot migrate chat ${chat.id}: the destination already has ${conflicts.length} file(s)`)
          continue
        }
        if (files.length > 0) {
          await cp(legacyPath, dataPath, { recursive: true, force: false, errorOnExist: false, preserveTimestamps: true })
        }
        await removePath(legacyPath)
      } else if (info !== undefined) {
        await removePath(legacyPath)
      }
      await mkdir(path.dirname(legacyPath), { recursive: true })
      await symlink(entity.path, legacyPath, linkType())
      await entity.attachSession(chat.sessionId).catch((error) => {
        ctx.logger?.warn?.(`${LOG_PREFIX} could not attach migrated chat ${chat.id}: ${messageOf(error)}`)
      })
      const agent = ctx.agents.get(chat.sessionId)
      if (agent !== undefined) {
        await ctx.workingDirectory.set(agent, dataPath).catch((error) => {
          ctx.logger?.warn?.(`${LOG_PREFIX} could not set migrated chat directory: ${messageOf(error)}`)
        })
      }
      await store.update((chats) => chats.map((candidate) => candidate.id === chat.id ? {
        ...candidate,
        dataPath,
        linkPath: legacyPath,
        workspaceId: entity.id,
        updatedAt: nowIso(),
      } : candidate))
    } catch (error) {
      ctx.logger?.warn?.(`${LOG_PREFIX} could not migrate chat ${chat.id}: ${messageOf(error)}`)
    }
  }
}

async function resolveWorkspace(ctx, store, request) {
  const registry = ctx.workspaceRegistry
  const rejectChats = (entity) => {
    if (entity.id === store.chatsWorkspaceId || samePath(entity.path, workspaceRoot())) {
      throw new Error('The Chats section is not a move target. Choose a real workspace.')
    }
    return entity
  }

  if (typeof request.workspaceId === 'string' && request.workspaceId.length > 0) {
    const entity = registry.get(request.workspaceId)
    if (entity === undefined) throw new Error(`Workspace "${request.workspaceId}" does not exist.`)
    rejectChats(entity)
    await ensureDirectory(entity.path)
    return { entity, createdDirectory: false }
  }

  const raw = typeof request.workspace === 'string' ? request.workspace.trim() : ''
  const explicit = typeof request.path === 'string' && request.path.trim().length > 0 ? expandHome(request.path.trim()) : undefined
  const pathCandidate = explicit ?? (raw.length > 0 && looksLikePath(raw) ? expandHome(raw) : undefined)

  if (pathCandidate !== undefined) {
    const absoluteInput = expandHome(pathCandidate)
    if (!path.isAbsolute(absoluteInput)) {
      throw new Error(`"${pathCandidate}" is not an absolute directory path. Pass an absolute path, or a workspace name without path separators.`)
    }
    const absolute = path.resolve(absoluteInput)
    if (samePath(absolute, workspaceRoot())) throw new Error('The Chats section is not a move target. Choose a real workspace.')
    const existing = await registry.resolveByPath(absolute).catch(() => undefined)
    await ensureDirectory(absolute)
    if (existing !== undefined) {
      rejectChats(existing)
      return { entity: existing, createdDirectory: false }
    }
    const title = typeof request.title === 'string' && request.title.trim().length > 0 ? request.title.trim() : path.basename(absolute)
    const entity = await registry.create(absolute, title)
    return { entity, createdDirectory: true }
  }

  if (raw.length === 0) throw new Error('A target workspace name, id, or directory path is required.')

  const matches = registry.list().filter((entity) => entity.title.toLowerCase() === raw.toLowerCase())
  if (matches.length === 1) {
    rejectChats(matches[0])
    await ensureDirectory(matches[0].path)
    return { entity: matches[0], createdDirectory: false }
  }
  if (matches.length > 1) throw new Error(`Several workspaces are titled "${raw}". Pass an absolute directory path instead.`)

  const title = typeof request.title === 'string' && request.title.trim().length > 0 ? request.title.trim() : raw
  const absolute = path.join(defaultWorkspaceParent(), safeDirName(title))
  const existing = await registry.resolveByPath(absolute).catch(() => undefined)
  await ensureDirectory(absolute)
  if (existing !== undefined) {
    rejectChats(existing)
    return { entity: existing, createdDirectory: false }
  }
  const entity = await registry.create(absolute, title)
  return { entity, createdDirectory: true }
}

/**
 * Move one chat's data into a real Workspace, repoint its header-cwd link,
 * and move its Workspace accounting from Chats to that Workspace.
 */
async function moveChat(ctx, store, request) {
  const chat = request.chatId !== undefined
    ? store.findById(request.chatId)
    : await findChatForSession(ctx, store, request.sessionId)
  if (chat === undefined) throw new Error('That chat does not exist.')
  if (typeof chat.sessionId !== 'string' || chat.sessionId.length === 0) throw new Error('That chat has no Session yet.')
  if (chat.movedTo !== null && chat.movedTo !== undefined) {
    throw new Error(`That chat is already in workspace "${chat.movedTo.title}".`)
  }

  const auth = await resolveWorkspace(ctx, store, request)
  const targetPath = await ensureDirectory(auth.entity.path)
  const dataPath = chat.dataPath
  const linkPath = chat.linkPath
  if (typeof dataPath !== 'string' || typeof linkPath !== 'string') throw new Error('That chat has no movable workspace directory.')
  if (samePath(dataPath, targetPath)) throw new Error('The chat is already in that directory.')

  const agent = ctx.agents.get(chat.sessionId)
  let cwdApplied = false
  if (agent !== undefined) {
    const applied = await ctx.workingDirectory.set(agent, targetPath)
    cwdApplied = typeof applied === 'string' && applied.length > 0
  }

  let files = 0
  try {
    const { files: listed, conflicts } = await conflictsBetween(dataPath, targetPath)
    if (conflicts.length > 0) {
      const preview = conflicts.slice(0, 5).join(', ')
      const suffix = conflicts.length > 5 ? ` and ${conflicts.length - 5} more` : ''
      throw new Error(`The workspace already contains ${conflicts.length} file(s) with the same name: ${preview}${suffix}. Move or rename them, then retry.`)
    }
    if (listed.length > 0) {
      await cp(dataPath, targetPath, { recursive: true, force: false, errorOnExist: false, preserveTimestamps: true })
    }
    files = listed.length
    await removePath(dataPath)
    await removePath(linkPath)
    await mkdir(path.dirname(linkPath), { recursive: true })
    await symlink(targetPath, linkPath, linkType())
  } catch (error) {
    if (agent !== undefined && cwdApplied) {
      await ctx.workingDirectory.set(agent, dataPath).catch(() => undefined)
    }
    throw error
  }

  const targetAttached = await auth.entity.attachSession(chat.sessionId).then(() => true, (error) => {
    ctx.logger?.warn?.(`${LOG_PREFIX} could not attach moved chat to target: ${messageOf(error)}`)
    return false
  })
  const chatsEntity = await ensureChatsWorkspace(ctx, store)
  await chatsEntity.detachSession(chat.sessionId).catch(() => undefined)

  const movedTo = {
    workspaceId: auth.entity.id,
    title: auth.entity.title,
    path: targetPath,
    at: nowIso(),
  }
  await store.update((chats) => chats.map((candidate) => candidate.id === chat.id ? {
    ...candidate,
    dataPath: targetPath,
    movedTo,
    updatedAt: nowIso(),
  } : candidate))

  return {
    chat: { ...publicChat(chat), movedTo },
    workspace: { id: auth.entity.id, title: auth.entity.title, path: targetPath },
    filesMoved: files,
    targetAttached,
    cwdApplied,
    createdDirectory: auth.createdDirectory,
  }
}

async function removeSessionLog(sessionId) {
  const root = path.join(dshHome(), 'sessions')
  const entries = await readdir(root, { withFileTypes: true }).catch(() => [])
  let removed = false
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const candidate = path.join(root, entry.name, sessionId)
    const info = await lstat(candidate).catch(() => undefined)
    if (info === undefined) continue
    await removePath(candidate)
    removed = true
  }
  return removed
}

async function deleteSession(ctx, store, sessionId) {
  const chat = await findChatForSession(ctx, store, sessionId).catch(() => undefined)
  const moved = chat !== undefined && chat.movedTo !== null && chat.movedTo !== undefined
  let archived = false
  if (typeof sessionId === 'string' && sessionId.length > 0) {
    archived = await ctx.workspaceRegistry.archiveSession(sessionId, { stopActivity: true }).then(() => true, (error) => {
      ctx.logger?.warn?.(`${LOG_PREFIX} could not archive deleted Session: ${messageOf(error)}`)
      return false
    })
  }
  let liveSessionRemoved = false
  const sessionStore = ctx.sessions?.store
  if (sessionStore instanceof Map) {
    const entry = sessionStore.get(sessionId)
    if (entry !== undefined) {
      sessionStore.delete(sessionId)
      try {
        ctx.sessions.emitDisposed?.(entry)
      } catch (error) {
        ctx.logger?.warn?.(`${LOG_PREFIX} could not dispose deleted Session: ${messageOf(error)}`)
      }
      liveSessionRemoved = true
    }
  }
  try {
    ctx.emit('api-session/removed', sessionId)
  } catch (error) {
    ctx.logger?.warn?.(`${LOG_PREFIX} could not publish deleted Session removal: ${messageOf(error)}`)
  }
  await ctx.workspaceRegistry.unarchiveSession(sessionId).catch(() => undefined)
  let dataDeleted = false
  if (chat !== undefined) {
    const pluginDataRoot = path.join(workspaceRoot(), 'data')
    if (!moved && typeof chat.dataPath === 'string' && isInside(chat.dataPath, pluginDataRoot)) {
      await removePath(chat.dataPath).catch((error) => {
        ctx.logger?.warn?.(`${LOG_PREFIX} could not remove chat data: ${messageOf(error)}`)
      })
      dataDeleted = true
    }
    if (typeof chat.linkPath === 'string' && isInside(chat.linkPath, linkRoot())) {
      await removePath(chat.linkPath).catch((error) => {
        ctx.logger?.warn?.(`${LOG_PREFIX} could not remove chat link: ${messageOf(error)}`)
      })
    }
    await store.update((chats) => chats.filter((candidate) => candidate.id !== chat.id))
  }
  const sessionLogRemoved = await removeSessionLog(sessionId)
  await removePath(path.join(dshHome(), 'storages', 'session_projcache', 'sessions', `${sessionId}.json`)).catch((error) => {
    ctx.logger?.warn?.(`${LOG_PREFIX} could not remove session projection cache: ${messageOf(error)}`)
  })
  return {
    sessionId,
    chatId: chat?.id ?? null,
    archived,
    liveSessionRemoved,
    dataDeleted,
    sessionLogRemoved,
  }
}

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function createApi(ctx, store) {
  async function handle(request) {
    try {
      await store.migrated
      await store.ready
      if (request.method === 'GET') {
        await ensureChatsWorkspace(ctx, store)
        return jsonResponse({
          ok: true,
          root: dataRoot(),
          workspaceRoot: workspaceRoot(),
          linkRoot: linkRoot(),
          chatsWorkspaceId: store.chatsWorkspaceId ?? null,
          chats: store.list().map(publicChat),
        })
      }
      if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed' }, 405)

      let body
      try {
        body = await request.json()
      } catch {
        return jsonResponse({ ok: false, error: 'The request body is not valid JSON.' }, 400)
      }
      const action = body?.action

      if (action === 'create') {
        const chat = await createChat(ctx, store, body)
        return jsonResponse({ ok: true, chat: publicChat(chat) })
      }

      if (action === 'bind') {
        const chat = store.findById(body.chatId)
        if (chat === undefined) return jsonResponse({ ok: false, error: 'That chat does not exist.' }, 404)
        if (typeof body.sessionId !== 'string' || body.sessionId.length === 0) return jsonResponse({ ok: false, error: 'A Session id is required.' }, 400)
        const other = store.list().find((candidate) => candidate.sessionId === body.sessionId && candidate.id !== chat.id)
        if (other !== undefined) return jsonResponse({ ok: false, error: 'That Session is already bound to another chat.' }, 409)
        const previous = chat.sessionId
        if (previous !== null && previous !== undefined && previous !== body.sessionId) {
          await ctx.workspaceRegistry.archiveSession(previous, { stopActivity: true }).catch(() => undefined)
        }
        const entity = await ensureChatsWorkspace(ctx, store)
        try {
          await entity.attachSession(body.sessionId)
        } catch (error) {
          return jsonResponse({ ok: false, error: `Could not attach the chat Session: ${messageOf(error)}` }, 400)
        }
        const agent = ctx.agents.get(body.sessionId)
        if (agent !== undefined && typeof chat.dataPath === 'string') {
          await ctx.workingDirectory.set(agent, chat.dataPath).catch((error) => {
            ctx.logger?.warn?.(`${LOG_PREFIX} could not set bound chat directory: ${messageOf(error)}`)
          })
        }
        await store.update((chats) => chats.map((candidate) => candidate.id === chat.id ? { ...candidate, sessionId: body.sessionId, updatedAt: nowIso() } : candidate))
        return jsonResponse({ ok: true, chat: publicChat(store.findById(chat.id)) })
      }

      if (action === 'discard') {
        const chat = store.findById(body.chatId)
        if (chat === undefined) return jsonResponse({ ok: true })
        if (chat.sessionId !== null && chat.sessionId !== undefined) {
          return jsonResponse({ ok: false, error: 'A chat with a Session cannot be discarded.' }, 409)
        }
        await store.update((chats) => chats.filter((candidate) => candidate.id !== chat.id))
        if (typeof chat.dataPath === 'string') await removePath(chat.dataPath)
        if (typeof chat.linkPath === 'string') await removePath(chat.linkPath)
        return jsonResponse({ ok: true })
      }

      if (action === 'delete') {
        const requested = Array.isArray(body.sessionIds)
          ? [...new Set(body.sessionIds.filter((value) => typeof value === 'string' && value.length > 0))]
          : typeof body.sessionId === 'string' && body.sessionId.length > 0
            ? [body.sessionId]
            : []
        if (requested.length === 0) return jsonResponse({ ok: false, error: 'At least one Session id is required.' }, 400)
        const deleted = []
        const errors = []
        for (const sessionId of requested) {
          try {
            deleted.push(await deleteSession(ctx, store, sessionId))
          } catch (error) {
            errors.push({ sessionId, error: messageOf(error) })
          }
        }
        return jsonResponse({ ok: true, deleted, errors })
      }

      if (action === 'pin' || action === 'unpin' || action === 'archive') {
        const requested = Array.isArray(body.sessionIds)
          ? [...new Set(body.sessionIds.filter((value) => typeof value === 'string' && value.length > 0))]
          : typeof body.sessionId === 'string' && body.sessionId.length > 0
            ? [body.sessionId]
            : []
        if (requested.length === 0) return jsonResponse({ ok: false, error: 'At least one Session id is required.' }, 400)
        const done = []
        const errors = []
        for (const sessionId of requested) {
          try {
            if (action === 'pin') await ctx.workspaceRegistry.pinSession(sessionId)
            else if (action === 'unpin') await ctx.workspaceRegistry.unpinSession(sessionId)
            else await ctx.workspaceRegistry.archiveSession(sessionId, { stopActivity: true })
            done.push(sessionId)
          } catch (error) {
            errors.push({ sessionId, error: messageOf(error) })
          }
        }
        return jsonResponse({ ok: true, done, errors })
      }

      if (action === 'move') {
        const chat = body.chatId !== undefined
          ? store.findById(body.chatId)
          : await findChatForSession(ctx, store, body.sessionId)
        if (chat === undefined) return jsonResponse({ ok: false, error: 'That chat does not exist.' }, 404)
        const result = await moveChat(ctx, store, {
          chatId: chat.id,
          workspaceId: body.workspaceId,
          workspace: body.workspace,
          path: body.path,
          title: body.title,
        })
        return jsonResponse({ ok: true, ...result })
      }

      return jsonResponse({ ok: false, error: `Unknown action "${String(action)}".` }, 400)
    } catch (error) {
      return jsonResponse({ ok: false, error: messageOf(error) }, 400)
    }
  }
  return handle
}

/** Adapt the Fetch-style API to the web server's Node HTTP route (POST-capable). */
function createHttpHandler(ctx, store) {
  const handle = createApi(ctx, store)
  return async (request, response) => {
    const method = request.method ?? 'GET'
    const chunks = []
    if (method === 'POST') {
      for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    const fetchRequest = new Request(`http://localhost${request.url ?? '/'}`, {
      method,
      headers: { 'content-type': request.headers['content-type'] ?? 'application/json' },
      body: method === 'POST' ? Buffer.concat(chunks) : undefined,
    })
    const fetchResponse = await handle(fetchRequest)
    const text = await fetchResponse.text()
    response.writeHead(fetchResponse.status, Object.fromEntries(fetchResponse.headers))
    response.end(text)
  }
}

const MOVE_TOOL_OUTPUT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    moved: { type: 'boolean' },
    chatId: { type: 'string' },
    sessionId: { type: 'string' },
    chatTitle: { type: 'string' },
    workspaceId: { type: 'string' },
    workspaceTitle: { type: 'string' },
    workspacePath: { type: 'string' },
    filesMoved: { type: 'integer' },
    targetAttached: { type: 'boolean' },
    cwdApplied: { type: 'boolean' },
    note: { type: 'string' },
  },
  required: ['moved'],
}

function renderMoveResult(_args, value) {
  if (value === null || typeof value !== 'object') return [{ type: 'text', text: 'Chat move finished.' }]
  const lines = [
    `Moved chat "${value.chatTitle ?? value.chatId}" to workspace "${value.workspaceTitle}" at ${value.workspacePath}.`,
    `${value.filesMoved ?? 0} file(s) were copied to the workspace.`,
    value.cwdApplied === true
      ? 'The chat now continues in the workspace.'
      : 'The new directory takes effect the next time the chat opens.',
  ]
  if (value.note !== undefined) lines.push(String(value.note))
  return [{ type: 'text', text: lines.join('\n') }]
}

const LIST_TOOL_OUTPUT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    chats: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          sessionId: { type: 'string' },
          title: { type: 'string' },
          movedTo: { type: 'string' },
          path: { type: 'string' },
        },
        required: ['id'],
      },
    },
  },
  required: ['chats'],
}

function renderChatList(_args, value) {
  const chats = Array.isArray(value?.chats) ? value.chats : []
  if (chats.length === 0) return [{ type: 'text', text: 'There are no chats.' }]
  return [{
    type: 'text',
    text: chats.map((chat) => {
      const location = chat.movedTo !== undefined ? `in workspace ${chat.movedTo}` : 'Chats section'
      return `- ${chat.title} (${chat.id}${chat.sessionId !== undefined ? `, session ${chat.sessionId}` : ''}) — ${location}`
    }).join('\n'),
  }]
}

export function apply(ctx) {
  const store = new ChatStore(ctx)
  store.migrated = store.ready
    .then(async () => {
      await ensureChatsWorkspace(ctx, store)
      await migrateChats(ctx, store)
    })
    .catch((error) => {
      ctx.logger?.warn?.(`${LOG_PREFIX} chat setup failed: ${messageOf(error)}`)
    })

  ctx.effect(() => ctx.on('agent/created', async ({ agent }) => {
    await store.migrated
    const chat = store.findBySession(agent.id)
    if (chat === undefined) return
    const target = chat.movedTo?.path ?? chat.dataPath
    if (typeof target !== 'string') return
    try {
      await ctx.workingDirectory.set(agent, target)
    } catch (error) {
      ctx.logger?.warn?.(`${LOG_PREFIX} could not restore the chat directory: ${messageOf(error)}`)
    }
  }), 'dsh-chats: restore chat directories')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: API_PATH,
    handler: createHttpHandler(ctx, store),
  }), 'dsh-chats: sidebar API')

  ctx.effect(() => ctx.tools.register({
    name: 'move_chat',
    description: 'Move one chat (and its temporary workspace contents) into a real workspace. Without `chat`, moves the current chat when this session is a chat. An existing workspace is matched by title, id, or directory path; otherwise a workspace is created. After it moves, the chat leaves the Chats section and appears under that workspace.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        workspace: {
          type: 'string',
          description: 'Existing workspace title or id, or an absolute directory path. When no workspace matches, a new workspace is created.',
        },
        path: {
          type: 'string',
          description: 'Absolute directory for the target workspace when creating one. Optional when `workspace` is already a directory path.',
        },
        title: {
          type: 'string',
          description: 'Display title for a newly created workspace. Defaults to the workspace name or directory basename.',
        },
        chat: {
          type: 'string',
          description: 'Chat title, chat id, or Session id. Defaults to the current chat.',
        },
      },
      required: ['workspace'],
    },
    output: {
      schema: MOVE_TOOL_OUTPUT,
      render: renderMoveResult,
    },
    async execute(args, exec) {
      const requested = typeof args.chat === 'string' && args.chat.trim().length > 0 ? args.chat.trim() : undefined
      const chat = requested !== undefined
        ? findChatByLabel(store, requested)
        : await findChatForSession(ctx, store, exec.agent?.id)
      if (chat === undefined) {
        throw new Error(requested !== undefined
          ? `No chat matches "${requested}".`
          : 'The current session is not a chat. Ask from a chat, or pass the `chat` parameter with a chat title or id.')
      }
      const result = await moveChat(ctx, store, {
        chatId: chat.id,
        workspace: args.workspace,
        path: args.path,
        title: args.title,
      })
      return {
        moved: true,
        chatId: result.chat.id,
        sessionId: result.chat.sessionId ?? undefined,
        chatTitle: result.chat.title,
        workspaceId: result.workspace.id,
        workspaceTitle: result.workspace.title,
        workspacePath: result.workspace.path,
        filesMoved: result.filesMoved,
        targetAttached: result.targetAttached,
        cwdApplied: result.cwdApplied,
        note: result.createdDirectory ? 'The workspace was created for this move.' : undefined,
      }
    },
  }), 'dsh-chats: move tool')

  ctx.effect(() => ctx.tools.register({
    name: 'list_chats',
    description: 'List the chats in this installation and whether each one is still in the Chats section or has been moved into a workspace.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {},
    },
    output: {
      schema: LIST_TOOL_OUTPUT,
      render: renderChatList,
    },
    async execute() {
      await store.migrated
      return {
        chats: store.list().map((chat) => ({
          id: chat.id,
          ...(chat.sessionId === null || chat.sessionId === undefined ? {} : { sessionId: chat.sessionId }),
          title: chat.title,
          ...(chat.movedTo === null || chat.movedTo === undefined ? {} : { movedTo: chat.movedTo.title }),
          path: chat.movedTo?.path ?? chat.dataPath ?? chat.path,
        })),
      }
    },
  }), 'dsh-chats: list tool')
}

function findChatByLabel(store, label) {
  const value = label.trim()
  const matches = store.list().filter((chat) => chat.id === value || chat.sessionId === value || chat.title.toLowerCase() === value.toLowerCase())
  if (matches.length === 1) return matches[0]
  if (matches.length > 1) throw new Error(`Several chats match "${value}". Use the chat id instead.`)
  return undefined
}

