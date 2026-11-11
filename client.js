window.__ModuleLoader__.load({
  id: '@local/dsh-chats',
  factory(require) {
    const React = require('react')
    let createPortal = null
    try {
      createPortal = require('react-dom').createPortal
    } catch {
      createPortal = null
    }
    let primitiveIcons = null
    try {
      primitiveIcons = require('@deepseek-ai/dsh-client-ui-primitives')
    } catch {
      primitiveIcons = null
    }
    const h = React.createElement

    const NS = 'dsh-chats'
    const API_PATH = '/api/dsh-chats'
    const CHATS_COLLAPSED_KEY = 'dsh-chats:chats-collapsed'
    const WORKSPACES_COLLAPSED_KEY = 'dsh-chats:workspaces-collapsed'

    const EN = {
      'chats': 'Chats',
      'newChat': 'New chat',
      'noChats': 'No chats yet',
      'noChatsHint': 'A chat gets its own temporary workspace.',
      'move': 'Move to workspace…',
      'moveTitle': 'Move “{name}” to',
      'chooseFolder': 'Choose folder…',
      'noWorkspaces': 'No real workspaces yet',
      'moved': 'Moved to {name}.',
      'movedMany': 'Moved {n} chats to {name}.',
      'moveFailed': 'Couldn’t move the chat: {message}',
      'createFailed': 'Couldn’t create the chat: {message}',
      'session.newChat': 'New chat',
      'session.untitled': 'Untitled',
      'chat.actions': 'Chat actions',
      'rename': 'Rename',
      'renameFailed': 'Couldn’t rename: {message}',
      'copied': 'Session ID copied.',
      'session.copyId': 'Copy session ID',
      'delete': 'Delete',
      'deleteConfirmOne': 'Delete the chat “{name}”?',
      'deleteConfirmMany': 'Delete {n} chats?',
      'deleteNow': 'Delete',
      'cancel': 'Cancel',
      'deletedOne': 'Chat deleted.',
      'deletedMany': '{n} chats deleted.',
      'deleteFailed': 'Couldn’t delete: {message}',
      'multiActions': 'Actions for {n} chats',
      'selectedCount': '{n} selected',
      'bulkMoveTitle': 'Move {n} chats to',
      'deselect': 'Deselect all',
      'pinSession': 'Pin session',
      'unpinSession': 'Unpin session',
      'archiveSession': 'Archive session',
      'pinnedMany': '{n} sessions pinned.',
      'unpinnedMany': '{n} sessions unpinned.',
      'archivedMany': '{n} sessions archived.',
      'bulkOpFailed': 'Couldn’t complete the action: {message}',
      'time.now': 'now',
      'time.minutes': '{n}m',
      'time.hours': '{n}h',
      'time.days': '{n}d',
      'collapseChats': 'Collapse Chats',
      'expandChats': 'Expand Chats',
      'collapseWorkspaces': 'Collapse Workspaces',
      'expandWorkspaces': 'Expand Workspaces',
    }

    const IT = {
      'chats': 'Chat',
      'newChat': 'Nuova chat',
      'noChats': 'Nessuna chat',
      'noChatsHint': 'Ogni chat ha il proprio spazio di lavoro temporaneo.',
      'move': 'Sposta in uno spazio…',
      'moveTitle': 'Sposta “{name}” in',
      'chooseFolder': 'Scegli cartella…',
      'noWorkspaces': 'Nessuno spazio di lavoro reale',
      'moved': 'Spostata in {name}.',
      'movedMany': '{n} chat spostate in {name}.',
      'moveFailed': 'Impossibile spostare la chat: {message}',
      'createFailed': 'Impossibile creare la chat: {message}',
      'session.newChat': 'Nuova chat',
      'session.untitled': 'Senza titolo',
      'chat.actions': 'Azioni chat',
      'rename': 'Rinomina',
      'renameFailed': 'Impossibile rinominare: {message}',
      'copied': 'ID sessione copiato.',
      'session.copyId': 'Copia ID sessione',
      'delete': 'Elimina',
      'deleteConfirmOne': 'Eliminare la chat “{name}”?',
      'deleteConfirmMany': 'Eliminare {n} chat?',
      'deleteNow': 'Elimina',
      'cancel': 'Annulla',
      'deletedOne': 'Chat eliminata.',
      'deletedMany': '{n} chat eliminate.',
      'deleteFailed': 'Impossibile eliminare: {message}',
      'multiActions': 'Azioni per {n} chat',
      'selectedCount': '{n} selezionate',
      'bulkMoveTitle': 'Sposta {n} chat in',
      'deselect': 'Deseleziona tutto',
      'pinSession': 'Fissa sessione',
      'unpinSession': 'Rimuovi dai fissati',
      'archiveSession': 'Archivia sessione',
      'pinnedMany': '{n} sessioni fissate.',
      'unpinnedMany': '{n} sessioni rimosse dai fissati.',
      'archivedMany': '{n} sessioni archiviate.',
      'bulkOpFailed': 'Impossibile completare l’operazione: {message}',
      'time.now': 'ora',
      'time.minutes': '{n}m',
      'time.hours': '{n}h',
      'time.days': '{n}g',
      'collapseChats': 'Comprimi Chat',
      'expandChats': 'Espandi Chat',
      'collapseWorkspaces': 'Comprimi spazi di lavoro',
      'expandWorkspaces': 'Espandi spazi di lavoro',
    }

    const ZH = {
      ...EN,
      'chats': '聊天',
      'newChat': '新建聊天',
      'noChats': '还没有聊天',
      'noChatsHint': '每个聊天都有独立的临时工作区。',
      'move': '移动到工作区…',
      'moveTitle': '将“{name}”移动到',
      'chooseFolder': '选择文件夹…',
      'noWorkspaces': '还没有真实工作区',
      'moved': '已移动到 {name}。',
      'movedMany': '已将 {n} 个聊天移动到 {name}。',
      'moveFailed': '无法移动聊天：{message}',
      'createFailed': '无法创建聊天：{message}',
      'session.newChat': '新建聊天',
      'session.untitled': '未命名',
      'chat.actions': '聊天操作',
      'rename': '重命名',
      'renameFailed': '无法重命名：{message}',
      'copied': '会话 ID 已复制。',
      'session.copyId': '复制会话 ID',
      'delete': '删除',
      'deleteConfirmOne': '删除聊天“{name}”？',
      'deleteConfirmMany': '删除 {n} 个聊天？',
      'deleteNow': '删除',
      'cancel': '取消',
      'deletedOne': '聊天已删除。',
      'deletedMany': '已删除 {n} 个聊天。',
      'deleteFailed': '无法删除：{message}',
      'multiActions': '{n} 个聊天的操作',
      'selectedCount': '已选择 {n} 个',
      'bulkMoveTitle': '将 {n} 个聊天移动到',
      'deselect': '取消全部选择',
      'pinSession': '固定会话',
      'unpinSession': '取消固定',
      'archiveSession': '归档会话',
      'pinnedMany': '已固定 {n} 个会话。',
      'unpinnedMany': '已取消固定 {n} 个会话。',
      'archivedMany': '已归档 {n} 个会话。',
      'bulkOpFailed': '无法完成操作：{message}',
      'time.now': '刚刚',
      'collapseChats': '折叠聊天',
      'expandChats': '展开聊天',
      'collapseWorkspaces': '折叠工作区',
      'expandWorkspaces': '展开工作区',
    }

    const CSS = `
.dch-footerButton{display:inline-flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;padding:0;border:none;border-radius:var(--dsw-radius-sm);background:none;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dch-footerButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dch-footerButton:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dch-footerButton:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.dch-chats-section-host{display:flex;flex-direction:column;flex:none;min-height:0;box-sizing:border-box;padding-right:var(--dsh-sidebar-inline-padding)}
.dch-chats-header{margin-top:2px;margin-right:-4px}
.dch-chats-spacer{flex:1;min-width:0}
.dch-chats-chevron{display:inline-flex;align-items:center;justify-content:center;flex:none;width:22px;height:24px;padding:0;border:none;border-radius:var(--dsw-radius-xs);background:none;color:var(--dsw-alias-label-caption);cursor:pointer}
.dch-chats-chevron:hover{color:var(--dsw-alias-label-primary)}
.dch-chats-chevron:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.dch-chats-rows{display:flex;flex-direction:column;min-height:0;overflow-y:auto;max-height:min(38vh,300px);padding-bottom:2px;scrollbar-gutter:stable}
.dch-chats-empty{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:4px 12px 10px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:17px}
.dch-chats-emptyButton{padding:0;border:none;background:none;color:var(--dsw-alias-link);font:inherit;font-size:12px;line-height:17px;cursor:pointer}
.dch-chatRow{display:flex;align-items:center;height:32px;padding:0 4px 0 9px;box-sizing:border-box;border-radius:var(--dsw-radius-md);border-inline:3px solid transparent;background-clip:padding-box;color:var(--dsw-alias-label-primary);cursor:pointer;-webkit-user-select:none;user-select:none}
.dch-chatRow:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dch-chatRow[aria-selected="true"]{background:var(--dsw-alias-interactive-bg-hover)}
.dch-chatLeading{display:inline-flex;align-items:center;justify-content:center;flex:none;width:16px;height:20px;color:var(--dsw-alias-label-tertiary)}
.dch-chatDot{display:block;width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-caption)}
.dch-chatDot[data-state="running"]{background:var(--dsw-alias-state-success-primary);animation:dch-chatPulse 1.4s ease-in-out infinite}
.dch-chatDot[data-state="warning"]{background:var(--dsw-alias-state-warn-primary)}
.dch-chatDot[data-state="done"]{background:var(--dsw-alias-state-success-primary)}
@keyframes dch-chatPulse{0%,100%{opacity:1}50%{opacity:.35}}
.dch-chatTitle{flex:1;min-width:0;margin:0 6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:20px}
.dch-chatRename{flex:1;min-width:0;margin:0 6px;height:22px;padding:0 4px;box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:20px;outline:none}
.dch-chatRename:focus{border-color:var(--dsw-alias-state-business-primary)}
.dch-chatTime{flex:none;font-size:10px;line-height:16px;color:var(--dsw-alias-label-tertiary)}
.dch-chatActions{display:none;align-items:center;gap:2px;flex:none}
.dch-chatRow:hover .dch-chatActions,.dch-chatRow:focus-within .dch-chatActions{display:inline-flex}
@media (hover:hover){.dch-chatRow:hover .dch-chatTime{display:none}}
@media (hover:none){.dch-chatActions{display:inline-flex}.dch-chatTime{display:none}}
.dch-chatActionButton{display:inline-flex;align-items:center;justify-content:center;flex:none;width:24px;height:24px;padding:0;border:none;border-radius:var(--dsw-radius-xs);background:none;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dch-chatActionButton:hover{color:var(--dsw-alias-label-primary)}
.dch-chatActionButton:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.dch-workspaces-toggle{display:inline-flex;align-items:center;justify-content:center;flex:none;width:20px;height:24px;padding:0;border:none;border-radius:var(--dsw-radius-xs);background:none;color:var(--dsw-alias-label-caption);cursor:pointer}
.dch-workspaces-toggle:hover{color:var(--dsw-alias-label-primary)}
.dch-workspaces-toggle:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.dch-workspaces-toggle svg{transition:transform .32s cubic-bezier(.22,1,.36,1)}
.dch-workspaces-toggle[data-collapsed="false"] svg{transform:rotate(90deg)}
.dch-workspaces-toggle[data-collapsed="true"] svg{transform:rotate(0)}
.GAkraW_root.dch-workspaces-collapsed .GAkraW_listArea{display:none!important}
.dch-collapse{display:grid;grid-template-rows:1fr;min-height:0;transition:grid-template-rows .34s cubic-bezier(.22,1,.36,1)}
.dch-collapse[data-collapsed="true"]{grid-template-rows:0fr}
.dch-collapseClip{min-height:0;overflow:hidden;opacity:1;visibility:visible;transform:translateY(0);transition:opacity .28s ease,transform .34s cubic-bezier(.22,1,.36,1),visibility .34s linear}
.dch-collapse[data-collapsed="true"] .dch-collapseClip{opacity:0;visibility:hidden;transform:translateY(-6px)}
.dch-collapse .dch-chatRow{transition:opacity .32s cubic-bezier(.22,1,.36,1),transform .32s cubic-bezier(.22,1,.36,1);transition-delay:var(--dch-row-in,0ms)}
.dch-collapse[data-collapsed="true"] .dch-chatRow{opacity:0;transform:translateY(-8px);transition-delay:var(--dch-row-out,0ms)}
.dch-menuBackdrop{position:fixed;inset:0;z-index:10000}
.dch-menu{position:fixed;z-index:10001;min-width:210px;max-width:min(290px,calc(100vw - 24px));max-height:min(360px,calc(100vh - 40px));overflow-y:auto;box-sizing:border-box;padding:4px;border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-elevation-panel)}
.dch-menuTitle{padding:6px 10px 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
.dch-menuItem{display:flex;align-items:center;gap:8px;width:100%;height:32px;padding:0 10px;box-sizing:border-box;border:none;border-radius:var(--dsw-radius-sm);background:none;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer}
.dch-menuItem:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dch-menuItem:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dch-menuItemIcon{display:inline-flex;align-items:center;justify-content:center;flex:none;width:16px;height:16px;color:var(--dsw-alias-label-tertiary)}
.dch-menuItemLabel{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dch-menuNote{padding:4px 10px 8px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:17px}
.dch-menuSep{height:1px;margin:4px 6px;background:var(--dsw-alias-border-l1)}
.dch-toastStack{position:fixed;right:16px;bottom:16px;z-index:11000;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.dch-toast{max-width:340px;padding:8px 12px;border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-elevation-panel);color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;pointer-events:auto;overflow-wrap:anywhere}
.dch-toast[data-kind="error"]{color:var(--dsw-alias-state-error-primary)}
.dch-toastLayer{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:12000;display:flex;justify-content:center;width:min(640px,calc(100vw - 32px));pointer-events:none}
.dch-toast{display:flex;align-items:center;gap:12px;box-sizing:border-box;width:fit-content;max-width:100%;padding:10px 12px 10px 14px;border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-menu-surface-fill);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter);backdrop-filter:var(--dsw-menu-backdrop-filter);box-shadow:var(--dsw-elevation-panel);color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;pointer-events:auto}
.dch-toast[data-kind="error"]{color:var(--dsw-alias-label-primary)}
.dch-toastIcon{display:inline-flex;align-items:center;justify-content:center;flex:none;color:var(--dsw-alias-state-warn-primary)}
.dch-toast[data-kind="info"] .dch-toastIcon{color:var(--dsw-alias-state-success-primary)}
.dch-toastText{min-width:0;flex:1;overflow-wrap:anywhere}
.dch-toastActions{display:flex;align-items:center;gap:10px;flex:none;margin-left:6px}
.dch-toastAction{display:inline-flex;align-items:center;gap:6px;border:none;background:none;padding:4px 6px;border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;font-weight:500;cursor:pointer}
.dch-toastAction:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dch-toastAction[data-action="cancel"]{color:var(--dsw-alias-link)}
.dch-toastAction[data-action="delete"]{color:var(--dsw-alias-state-error-primary)}
[data-row-key^="session:"].dch-chat-multi-selected,
.dch-chatRow[data-multi-selected="true"]{background:var(--dsw-alias-interactive-bg-hover)!important;box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary);border-radius:var(--dsw-radius-md)}
.dch-toastConfirm{display:flex;flex-direction:column;gap:8px}
.dch-confirmActions{display:flex;align-items:center;justify-content:flex-end;gap:6px}
.dch-confirmButton{height:24px;padding:0 8px;border:none;border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:20px;cursor:pointer}
.dch-confirmButton[data-danger="true"]{color:var(--dsw-alias-state-error-primary)}
.dch-chatQuickActions{display:inline-flex;align-items:center;gap:2px}
.dch-chatActions{gap:6px}
.dch-chatActions .wnFoaW_iconButton{margin:0}
body.dsh-chats-mode button.WOwLGG_workspace,
body.dsh-chats-mode .an3WzG_heroWorkspaceRow > button:first-of-type,
body.dsh-chats-mode .an3WzG_heroWorkspaceRow > :first-child{display:none!important}
.dch-chats-header .GAkraW_iconButton{color:var(--dsw-alias-label-secondary)}
.wtg9ga_regionArea:has(.dch-chats-section-host){overflow-y:auto!important;overflow-x:hidden!important}
.wtg9ga_regionArea:has(.dch-chats-section-host) .GAkraW_root{flex:0 0 auto!important;height:auto!important;min-height:0!important}
.wtg9ga_regionArea:has(.dch-chats-section-host) .GAkraW_listArea,
.wtg9ga_regionArea:has(.dch-chats-section-host) .GAkraW_treeBody,
.wtg9ga_regionArea:has(.dch-chats-section-host) .GAkraW_list,
.wtg9ga_regionArea:has(.dch-chats-section-host) .GAkraW_flatList,
.wtg9ga_regionArea:has(.dch-chats-section-host) .GAkraW_searchTree{flex:0 0 auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
.wtg9ga_regionArea:has(.dch-chats-section-host) .dch-chats-rows{max-height:none!important;overflow-y:visible!important}
.GAkraW_root.dch-workspaces-animating .GAkraW_listArea{overflow:hidden!important;will-change:height,opacity,transform}
@media (prefers-reduced-motion:reduce){.dch-chatDot{animation:none}.dch-workspaces-toggle svg,.dch-chats-chevron svg{transition:none}.dch-collapse,.dch-collapseClip,.dch-collapse .dch-chatRow{transition:none!important}}
`

    function cls(...values) {
      return values.filter(Boolean).join(' ')
    }

    function messageOf(error) {
      return error instanceof Error ? error.message : String(error)
    }

    function readStored(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key)
        return raw === null ? fallback : JSON.parse(raw)
      } catch {
        return fallback
      }
    }

    function writeStored(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // A blocked storage area only loses the panel preference.
      }
    }

    function normalizePath(value) {
      return String(value ?? '').replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
    }

    function samePathText(left, right) {
      const a = normalizePath(left)
      const b = normalizePath(right)
      return a.length > 0 && a === b
    }

    async function chatApi(body) {
      const init = body === undefined
        ? { method: 'GET', cache: 'no-store' }
        : { method: 'POST', cache: 'no-store', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }
      const response = await fetch(API_PATH, init)
      let data = null
      try {
        data = await response.json()
      } catch {
        data = null
      }
      if (!response.ok || data === null || data.ok !== true) {
        throw new Error(data?.error ?? `Chat service failed (${response.status})`)
      }
      return data
    }

    function createChatStore() {
      let snapshot = { chats: [], chatsWorkspaceId: undefined, workspaceRoot: '', linkRoot: '' }
      const listeners = new Set()
      return {
        getSnapshot: () => snapshot,
        subscribe(fn) {
          listeners.add(fn)
          return () => listeners.delete(fn)
        },
        set(patch) {
          const next = { ...snapshot, ...patch }
          if (next.chats === snapshot.chats
            && next.chatsWorkspaceId === snapshot.chatsWorkspaceId
            && next.workspaceRoot === snapshot.workspaceRoot
            && next.linkRoot === snapshot.linkRoot) return
          snapshot = next
          for (const fn of listeners) fn()
        },
        mergeChat(chat) {
          const chats = [chat, ...snapshot.chats.filter((candidate) => candidate.id !== chat.id)]
          this.set({ chats })
        },
      }
    }

    function createToastStore() {
      let items = []
      let sequence = 0
      const listeners = new Set()
      const publish = () => {
        for (const fn of listeners) fn()
      }
      return {
        getSnapshot: () => items,
        subscribe(fn) {
          listeners.add(fn)
          return () => listeners.delete(fn)
        },
        push(kind, text) {
          const id = ++sequence
          items = [{ id, kind, text }]
          publish()
          window.setTimeout(() => {
            items = items.filter((item) => item.id !== id)
            publish()
          }, 6000)
        },
        pushConfirm(text, onConfirm) {
          const id = ++sequence
          items = [{ id, kind: 'confirm', text, onConfirm }]
          publish()
          return id
        },
        dismiss(id) {
          items = items.filter((item) => item.id !== id)
          publish()
        },
      }
    }

    function createSelectionStore() {
      let selected = new Set()
      const listeners = new Set()
      const publish = () => {
        for (const fn of listeners) fn()
      }
      return {
        getSnapshot: () => selected,
        subscribe(fn) {
          listeners.add(fn)
          return () => listeners.delete(fn)
        },
        toggle(id) {
          const next = new Set(selected)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          selected = next
          publish()
        },
        clear() {
          if (selected.size === 0) return
          selected = new Set()
          publish()
        },
        has(id) {
          return selected.has(id)
        },
        values() {
          return [...selected]
        },
      }
    }

    const chatStore = createChatStore()
    const toastStore = createToastStore()
    const selectionStore = createSelectionStore()
    const bridges = new WeakMap()
    let ctrlHeld = false

    function useChatStore() {
      return React.useSyncExternalStore(chatStore.subscribe, chatStore.getSnapshot, chatStore.getSnapshot)
    }

    function useToastStore() {
      return React.useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot)
    }

    function useSelection() {
      return React.useSyncExternalStore(selectionStore.subscribe, selectionStore.getSnapshot, selectionStore.getSnapshot)
    }

    function useCtrlTracker() {
      React.useEffect(() => {
        const down = (event) => {
          if (event.key === 'Control' || event.key === 'Meta') ctrlHeld = true
        }
        const up = (event) => {
          if (event.key === 'Control' || event.key === 'Meta') ctrlHeld = false
        }
        const reset = () => {
          ctrlHeld = false
        }
        window.addEventListener('keydown', down, true)
        window.addEventListener('keyup', up, true)
        window.addEventListener('blur', reset)
        return () => {
          window.removeEventListener('keydown', down, true)
          window.removeEventListener('keyup', up, true)
          window.removeEventListener('blur', reset)
        }
      }, [])
    }

    function syncSelectionHighlights(selected) {
      if (typeof document === 'undefined') return
      for (const row of document.querySelectorAll('[data-row-key^="session:"]')) {
        const key = row.getAttribute('data-row-key')
        if (key === null || key.startsWith('session:') === false) continue
        row.classList.toggle('dch-chat-multi-selected', selected.has(key.slice('session:'.length)))
      }
    }

    function useNow() {
      const [now, setNow] = React.useState(() => Date.now())
      React.useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 60000)
        return () => window.clearInterval(timer)
      }, [])
      return now
    }

    function relativeTime(updatedAt, now, t) {
      if (typeof updatedAt !== 'number' || !Number.isFinite(updatedAt)) return ''
      const diff = Math.max(0, now - updatedAt)
      const minutes = Math.floor(diff / 60000)
      if (minutes < 1) return t('time.now')
      if (minutes < 60) return t('time.minutes', { n: minutes })
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return t('time.hours', { n: hours })
      const days = Math.floor(hours / 24)
      if (days < 7) return t('time.days', { n: days })
      return new Date(updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }

    function statusStateOf(status) {
      if (status === undefined || status === null) return 'idle'
      if (status.pendingInteraction !== undefined && status.pendingInteraction !== null) return 'warning'
      if (status.running === true) return 'running'
      if (status.completionUnread === true) return 'done'
      return 'idle'
    }

    function displayChatTitle(summary, t) {
      const title = typeof summary?.title === 'string' ? summary.title.trim() : ''
      if (title.length > 0) return title
      return summary?.blank === true ? t('session.newChat') : t('session.untitled')
    }

    function Svg({ size = 16, fill = 'none', className, style, children }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill,
        stroke: fill === 'none' ? 'currentColor' : 'none',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
        style,
        'aria-hidden': true,
        focusable: 'false',
      }, children)
    }

    function ChevronIcon({ open, size = 14 }) {
      return h(Svg, {
        size,
        style: { transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .32s cubic-bezier(.22,1,.36,1)' },
      }, h('path', { d: 'M6 3.5 10.5 8 6 12.5' }))
    }

    function ChatPlusIcon({ size = 16 }) {
      return h(Svg, { size }, h('path', { d: 'M2.5 3.5h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6.5L4 12.5v-2H2.5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z' }), h('path', { d: 'M12.5 10.5v4M10.5 12.5h4' }))
    }

    function NewChatIcon({ size = 16 }) {
      if (primitiveIcons !== null && primitiveIcons.IconNewChatOutlineRegular !== undefined) {
        return h(primitiveIcons.IconNewChatOutlineRegular, { size })
      }
      return h(ChatPlusIcon, { size })
    }

    function MoveIcon({ size = 15 }) {
      return h(Svg, { size }, h('path', { d: 'M2 4.5a1 1 0 0 1 1-1h3l1.5 2H13a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7Z' }), h('path', { d: 'M6 8h4.5M8.8 6.2 10.6 8l-1.8 1.8' }))
    }

    function FolderIcon({ size = 15 }) {
      return h(Svg, { size }, h('path', { d: 'M2 4.5a1 1 0 0 1 1-1h3l1.5 2H13a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7Z' }))
    }

    function FolderPlusIcon({ size = 15 }) {
      return h(Svg, { size }, h('path', { d: 'M2 4.5a1 1 0 0 1 1-1h3l1.5 2H13a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7Z' }), h('path', { d: 'M8 7.5v3M6.5 9h3' }))
    }

    function EllipsisIcon({ size = 16 }) {
      return h(Svg, { size, fill: 'currentColor' }, h('circle', { cx: 3.2, cy: 8, r: 1.2 }), h('circle', { cx: 8, cy: 8, r: 1.2 }), h('circle', { cx: 12.8, cy: 8, r: 1.2 }))
    }

    function PencilIcon({ size = 15 }) {
      return h(Svg, { size }, h('path', { d: 'm3 13 .7-3 6.1-6.1a1.4 1.4 0 0 1 2 0l.3.3a1.4 1.4 0 0 1 0 2L6 12.3 3 13Z' }), h('path', { d: 'm9.2 4.6 2.2 2.2' }))
    }

    function CopyIcon({ size = 15 }) {
      return h(Svg, { size }, h('rect', { x: 5.5, y: 5.5, width: 7, height: 7, rx: 1.2 }), h('path', { d: 'M10.5 5.5v-1a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1' }))
    }

    function DeleteIcon({ size = 15 }) {
      return h(Svg, { size }, h('path', { d: 'M3 5h10M6.5 5V3.8h3V5M4.5 5l.6 8h5.8l.6-8M6.8 7.5v3M9.2 7.5v3' }))
    }

    function ensureBridge(uiWorkspace) {
      const existing = bridges.get(uiWorkspace)
      if (existing !== undefined) return existing
      const bridge = {
        chatsId: undefined,
        currentWorkspaceId: undefined,
        firstRealWorkspaceId: undefined,
        createChat: undefined,
        uiWorkspace,
        sessions: undefined,
        contextMenus: undefined,
        translate: undefined,
      }
      bridges.set(uiWorkspace, bridge)
      const originalStart = uiWorkspace.startSession.bind(uiWorkspace)
      const originalConnect = uiWorkspace.connectWorkspace.bind(uiWorkspace)
      const originalOpen = uiWorkspace.openWorkspace.bind(uiWorkspace)

      const startWrapper = (workspaceId, options) => {
        const target = workspaceId ?? bridge.currentWorkspaceId
        if (target !== undefined && target === bridge.chatsId) {
          bridge.createChat?.()
          return
        }
        if (workspaceId !== undefined) {
          originalStart(workspaceId, options)
          return
        }
        const fallback = bridge.currentWorkspaceId ?? bridge.firstRealWorkspaceId
        originalStart(fallback, options)
      }

      const connectWrapper = (workspaceId, options) => {
        if (workspaceId !== undefined && workspaceId === bridge.chatsId) {
          return bridge.createChat ? bridge.createChat() : originalConnect(workspaceId, options)
        }
        return originalConnect(workspaceId, options)
      }

      const openWrapper = (workspaceId, beforeOpen, options) => {
        if (workspaceId !== undefined && workspaceId === bridge.chatsId) {
          return bridge.createChat
            ? Promise.resolve(bridge.createChat()).then(() => undefined)
            : originalOpen(workspaceId, beforeOpen, options)
        }
        return originalOpen(workspaceId, beforeOpen, options)
      }

      try {
        uiWorkspace.startSession = startWrapper
        uiWorkspace.connectWorkspace = connectWrapper
        uiWorkspace.openWorkspace = openWrapper
      } catch {
        // A frozen service keeps its original methods; the action button still works.
      }
      return bridge
    }

    function injectStyles() {
      if (typeof document === 'undefined') return () => undefined
      for (const existing of document.querySelectorAll('style[data-dsh-chats-styles]')) existing.remove()
      const tag = document.createElement('style')
      tag.dataset.dshChatsStyles = '1'
      tag.textContent = CSS
      document.head.appendChild(tag)
      return () => tag.remove()
    }

    function applyChatsGroupStyle(id) {
      if (typeof document === 'undefined') return
      let tag = document.querySelector('style[data-dsh-chats-group]')
      if (tag === null) {
        tag = document.createElement('style')
        tag.dataset.dshChatsGroup = '1'
        document.head.appendChild(tag)
      }
      const safe = id === undefined || id === null ? '' : String(id).replace(/["\\]/g, '')
      const text = safe.length === 0
        ? ''
        : `[data-row-key="workspace:${safe}"]{display:none!important}.GAkraW_groupSection:has([data-row-key="workspace:${safe}"]){display:none!important}`
      if (tag.textContent !== text) tag.textContent = text
    }

    function workspacesCollapsed() {
      return readStored(WORKSPACES_COLLAPSED_KEY, false) === true
    }

    const WORKSPACES_MOTION = Object.freeze({ duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' })

    function prefersReducedMotion() {
      try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      } catch {
        return false
      }
    }

    function workspacesListItem(browser) {
      return browser.querySelector('[class*="listArea"]') ?? browser.querySelector('[class*="treeBody"]')
    }

    // The motion animates the CSS `height` property, which is a content-box value
    // unless the element is sized with border-box, so read layout in that unit.
    function workspacesMotionHeight(list) {
      if (list === null || list === undefined || list.isConnected !== true) return 0
      const measured = list.getBoundingClientRect().height
      let style = null
      try {
        style = window.getComputedStyle(list)
      } catch {
        return measured
      }
      if (style === null || style.boxSizing !== 'content-box') return measured
      const part = (name) => {
        const value = Number.parseFloat(style[name])
        return Number.isFinite(value) ? value : 0
      }
      return Math.max(0, measured - part('paddingTop') - part('paddingBottom') - part('borderTopWidth') - part('borderBottomWidth'))
    }

    // Only rows that are not nested inside another row: a nested row inherits the
    // visual movement of its parent, and staggering both would double it.
    function workspacesTopLevelRows(list) {
      if (list === null || list === undefined) return []
      const rows = []
      for (const node of list.querySelectorAll('[data-row-key]')) {
        let parent = node.parentElement
        let nested = false
        while (parent !== null && parent !== list) {
          if (parent.hasAttribute?.('data-row-key') === true) {
            nested = true
            break
          }
          parent = parent.parentElement
        }
        if (!nested) rows.push(node)
      }
      return rows
    }

    function stopWorkspacesMotion(browser, motion) {
      const current = motion ?? browser.__dchMotion
      browser.__dchMotion = null
      if (current !== null && current !== undefined) {
        try {
          current.animation.cancel()
        } catch {
          // Cancelling only drops the animation fill.
        }
        for (const row of current.rows ?? []) {
          try {
            row.cancel()
          } catch {
            // Same: a stale row animation is harmless.
          }
        }
        const list = current.list
        if (list !== null && list !== undefined) {
          for (const name of ['height', 'opacity', 'transform', 'overflow', 'pointer-events']) list.style.removeProperty(name)
        }
      }
      browser.classList.remove('dch-workspaces-animating')
    }

    function startWorkspacesMotion(browser, list, options) {
      const collapsed = options.collapsed === true
      browser.classList.add('dch-workspaces-animating')
      list.style.overflow = 'hidden'
      if (collapsed) list.style.pointerEvents = 'none'
      const animation = list.animate([
        { height: `${options.from}px`, opacity: collapsed ? 1 : 0, transform: collapsed ? 'translateY(0px)' : 'translateY(-6px)' },
        { height: `${options.to}px`, opacity: collapsed ? 0 : 1, transform: collapsed ? 'translateY(-6px)' : 'translateY(0px)' },
      ], { duration: WORKSPACES_MOTION.duration, easing: WORKSPACES_MOTION.easing, fill: 'forwards' })
      const motion = { animation, list, collapsed, rows: [] }
      workspacesTopLevelRows(list).forEach((node, index) => {
        try {
          motion.rows.push(node.animate([
            { opacity: collapsed ? 1 : 0 },
            { opacity: collapsed ? 0 : 1 },
          ], {
            duration: collapsed ? 180 : 260,
            delay: Math.min(index, 12) * (collapsed ? 12 : 16),
            easing: collapsed ? 'ease-in' : WORKSPACES_MOTION.easing,
            fill: 'both',
          }))
        } catch {
          // A row that refuses to animate only stays static.
        }
      })
      browser.__dchMotion = motion
      animation.onfinish = () => {
        if (browser.__dchMotion !== motion) return
        if (collapsed) browser.classList.add('dch-workspaces-collapsed')
        stopWorkspacesMotion(browser, motion)
        if (!collapsed) browser.classList.remove('dch-workspaces-collapsed')
      }
    }

    function animateWorkspacesCollapse(browser, collapsed) {
      const list = workspacesListItem(browser)
      const running = browser.__dchMotion
      const partial = running !== null && running !== undefined && running.list === list ? workspacesMotionHeight(list) : null
      if (running !== null && running !== undefined) {
        stopWorkspacesMotion(browser, running)
        browser.classList.toggle('dch-workspaces-collapsed', running.collapsed === true)
      }
      if (list === null || typeof list.animate !== 'function' || prefersReducedMotion()) {
        browser.classList.toggle('dch-workspaces-collapsed', collapsed)
        return
      }
      if (collapsed) {
        startWorkspacesMotion(browser, list, { collapsed: true, from: partial ?? workspacesMotionHeight(list), to: 0 })
      } else {
        browser.classList.remove('dch-workspaces-collapsed')
        startWorkspacesMotion(browser, list, { collapsed: false, from: partial ?? 0, to: workspacesMotionHeight(list) })
      }
    }

    function applyWorkspacesCollapseUi(browser, button, t) {
      const collapsed = workspacesCollapsed()
      button.dataset.collapsed = collapsed ? 'true' : 'false'
      button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
      const translate = typeof t === 'function' ? t : (key) => key
      button.title = collapsed ? translate('expandWorkspaces') : translate('collapseWorkspaces')
      button.setAttribute('aria-label', button.title)
    }

    function applyWorkspacesCollapse(browser, button, t) {
      const motion = browser.__dchMotion
      if (motion !== null && motion !== undefined && (motion.list === null || motion.list === undefined || motion.list.isConnected !== true)) {
        stopWorkspacesMotion(browser, motion)
      }
      // While the list is mid motion the running animation owns the class.
      if (browser.__dchMotion === null || browser.__dchMotion === undefined) {
        browser.classList.toggle('dch-workspaces-collapsed', workspacesCollapsed())
      }
      applyWorkspacesCollapseUi(browser, button, t)
    }

    function resetWorkspacesRoot(root) {
      stopWorkspacesMotion(root, root.__dchMotion)
      root.classList.remove('dch-workspaces-collapsed')
    }

    // The shipped row animator resets itself when a workspace group drops its
    // watermarks - which happens exactly when that group collapses - so those rows
    // unmount with no exit motion while the matching expand is animated. These
    // helpers only fill that gap: when the shipped animator already produced exit
    // clones for a list, its own motion is left untouched.
    const ROW_MOTION_EXITS = '_exits_'
    let rowMotionRegion = null
    let rowMotionObserver = null
    let rowMotionRects = new Map()
    let rowMotionFrame = 0

    function rowAnimatedList(node) {
      let current = node.parentElement
      while (current !== null && current !== document.body) {
        const sibling = current.nextElementSibling
        if (sibling !== null && typeof sibling.className === 'string' && sibling.className.includes(ROW_MOTION_EXITS)) return current
        current = current.parentElement
      }
      return null
    }

    function captureRowMotionRects() {
      const region = rowMotionRegion
      rowMotionRects = new Map()
      if (region === null || region.isConnected !== true) return
      for (const node of region.querySelectorAll('[data-row-key]')) {
        const key = node.getAttribute('data-row-key')
        if (key === null || key.length === 0) continue
        const rect = node.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        rowMotionRects.set(key, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, list: rowAnimatedList(node) })
      }
    }

    function refreshRowMotionSoon() {
      if (rowMotionFrame !== 0) return
      rowMotionFrame = window.requestAnimationFrame(() => {
        rowMotionFrame = 0
        captureRowMotionRects()
      })
    }

    function appendRowExitClone(node, entry) {
      const overlay = entry.list.nextElementSibling
      if (overlay === null || overlay.nodeType !== 1 || overlay.isConnected !== true) return
      const overlayRect = overlay.getBoundingClientRect()
      const clone = node.cloneNode(true)
      clone.removeAttribute('data-row-key')
      clone.setAttribute('aria-hidden', 'true')
      clone.setAttribute('inert', '')
      clone.classList.add('dch-rowExit')
      try {
        const indent = window.getComputedStyle(node).getPropertyValue('--dsh-workspace-indent')
        if (indent !== '') clone.style.setProperty('--dsh-workspace-indent', indent)
      } catch {
        // Without the indent a nested clone only shifts inside its own box.
      }
      Object.assign(clone.style, {
        position: 'absolute',
        left: `${entry.left - overlayRect.left}px`,
        top: `${entry.top - overlayRect.top}px`,
        width: `${entry.width}px`,
        height: `${entry.height}px`,
        margin: '0',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      })
      overlay.append(clone)
      const animation = clone.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease-out', fill: 'forwards' })
      animation.onfinish = () => {
        animation.onfinish = null
        clone.remove()
      }
    }

    function slideRowsBack(list) {
      for (const node of list.querySelectorAll('[data-row-key]')) {
        const key = node.getAttribute('data-row-key')
        const entry = key === null ? undefined : rowMotionRects.get(key)
        if (entry === undefined || entry.list !== list) continue
        const rect = node.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        const dx = entry.left - rect.left
        const dy = entry.top - rect.top
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue
        try {
          node.animate([
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: 'translate(0px, 0px)' },
          ], { duration: 200, easing: 'cubic-bezier(.22,1,.36,1)' })
        } catch {
          // A row that refuses to animate simply keeps its new position.
        }
      }
    }

    function animateRemovedRows(removed) {
      if (removed.length === 0 || removed.length > 24 || prefersReducedMotion()) return
      const groups = new Map()
      for (const node of removed) {
        const key = node.getAttribute('data-row-key')
        const entry = key === null ? undefined : rowMotionRects.get(key)
        if (entry === undefined || entry.list === null || entry.list.isConnected !== true) continue
        const bucket = groups.get(entry.list)
        if (bucket === undefined) groups.set(entry.list, [{ node, entry }])
        else bucket.push({ node, entry })
      }
      for (const [list, bucket] of groups) {
        const overlay = list.nextElementSibling
        if (overlay === null || overlay.nodeType !== 1) continue
        if (overlay.childElementCount > 0) continue
        for (const item of bucket) appendRowExitClone(item.node, item.entry)
        slideRowsBack(list)
      }
    }

    function collectRemovedRows(records) {
      const removed = []
      for (const record of records) {
        for (const node of record.removedNodes) {
          if (node.nodeType !== 1) continue
          if (node.hasAttribute?.('data-row-key') === true) removed.push(node)
          else for (const child of node.querySelectorAll('[data-row-key]')) removed.push(child)
        }
      }
      return removed
    }

    function uninstallRowMotion() {
      if (rowMotionFrame !== 0) {
        window.cancelAnimationFrame(rowMotionFrame)
        rowMotionFrame = 0
      }
      rowMotionObserver?.disconnect()
      rowMotionObserver = null
      document.removeEventListener('pointerdown', captureRowMotionRects, true)
      document.removeEventListener('keydown', captureRowMotionRects, true)
      document.removeEventListener('scroll', refreshRowMotionSoon, true)
      window.removeEventListener('resize', refreshRowMotionSoon)
      for (const clone of document.querySelectorAll('.dch-rowExit')) clone.remove()
      rowMotionRegion = null
      rowMotionRects = new Map()
    }

    function installRowMotion(region) {
      if (region === null || region === undefined || region.isConnected !== true) return
      if (rowMotionObserver !== null && rowMotionRegion === region) return
      uninstallRowMotion()
      rowMotionRegion = region
      captureRowMotionRects()
      rowMotionObserver = new MutationObserver((records) => {
        animateRemovedRows(collectRemovedRows(records))
        refreshRowMotionSoon()
      })
      rowMotionObserver.observe(region, { childList: true, subtree: true })
      document.addEventListener('pointerdown', captureRowMotionRects, true)
      document.addEventListener('keydown', captureRowMotionRects, true)
      document.addEventListener('scroll', refreshRowMotionSoon, true)
      window.addEventListener('resize', refreshRowMotionSoon)
    }

    function ensureWorkspacesToggle(browser, t) {
      const header = browser.querySelector('[class*="sectionHeader"]')
      if (header === null) return
      let button = header.querySelector('button.dch-workspaces-toggle')
      if (button === null) {
        button = document.createElement('button')
        button.type = 'button'
        button.className = 'dch-workspaces-toggle'
        button.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"></path></svg>'
        button.addEventListener('click', (event) => {
          event.preventDefault()
          event.stopPropagation()
          const collapsed = !workspacesCollapsed()
          writeStored(WORKSPACES_COLLAPSED_KEY, collapsed)
          applyWorkspacesCollapseUi(browser, button, button.__dchTranslate)
          animateWorkspacesCollapse(browser, collapsed)
        })
        const label = header.querySelector('[class*="sectionLabel"]')
        if (label !== null) header.insertBefore(button, label)
        else header.insertBefore(button, header.firstChild)
      }
      button.__dchTranslate = t
      applyWorkspacesCollapse(browser, button, t)
    }

    function headerIconGlyphs(svg) {
      return svg.querySelectorAll('path, circle, rect, line, polyline, polygon')
    }

    function syncChatAddColor(browser) {
      const header = browser.querySelector('[class*="sectionHeader"]')
      if (header === null) return
      const iconButtons = Array.from(header.querySelectorAll('button[class*="iconButton"], button[class*="searchButton"]'))
      if (iconButtons.length === 0) return
      const reference = iconButtons[iconButtons.length - 1]
      const referenceSvg = reference.querySelector('svg')
      if (referenceSvg === null) return
      let color = ''
      for (const node of headerIconGlyphs(referenceSvg)) {
        const style = window.getComputedStyle(node)
        if (style.stroke !== 'none' && style.stroke !== 'currentcolor') {
          color = style.stroke
          break
        }
      }
      if (color === '') {
        for (const node of headerIconGlyphs(referenceSvg)) {
          const style = window.getComputedStyle(node)
          if (style.fill !== 'none' && style.fill !== 'currentcolor') {
            color = style.fill
            break
          }
        }
      }
      if (color === '') color = window.getComputedStyle(referenceSvg).color
      if (color === '') return
      const add = document.querySelector('button.dch-chats-add')
      if (add === null) return
      add.style.color = color
      const icon = add.querySelector('svg')
      if (icon === null) return
      icon.style.color = color
      for (const node of headerIconGlyphs(icon)) {
        const style = window.getComputedStyle(node)
        if (style.fill !== 'none' && style.fill !== 'currentcolor') node.style.fill = color
        if (style.stroke !== 'none' && style.stroke !== 'currentcolor') node.style.stroke = color
      }
    }

    function createChatRuntime(uiWorkspace, bridge) {
      return (async () => {
        try {
          const data = await chatApi({ action: 'create', hostSession: true })
          const chat = data.chat
          if (chat === undefined || chat === null || typeof chat.sessionId !== 'string' || chat.sessionId.length === 0) {
            throw new Error('The chat Session was not created.')
          }
          chatStore.mergeChat(chat)
          uiWorkspace.openSession(chat.sessionId)
          return chat.sessionId
        } catch (error) {
          const translate = typeof bridge.translate === 'function' ? bridge.translate : (key) => key
          toastStore.push('error', translate('createFailed', { message: messageOf(error) }))
          return undefined
        }
      })()
    }

    function ContextMenu({ point, items, onClose, onSelect }) {
      if (primitiveIcons === null || primitiveIcons.Menu === undefined) return null
      return h(primitiveIcons.Menu, {
        open: point !== null && point !== undefined,
        anchor: null,
        contextual: true,
        portal: true,
        autoFocus: true,
        getAnchorRect: () => new DOMRect(point?.x ?? 0, point?.y ?? 0, 0, 0),
        items,
        onClose,
        onSelect,
      })
    }

    function RenameInput({ value, onCommit, onCancel }) {
      const ref = React.useRef(null)
      const done = React.useRef(false)
      React.useEffect(() => {
        ref.current?.focus()
        ref.current?.select()
      }, [])
      const commit = (next) => {
        if (done.current) return
        done.current = true
        onCommit(next)
      }
      const cancel = () => {
        if (done.current) return
        done.current = true
        onCancel()
      }
      return h('input', {
        ref,
        className: 'dch-chatRename',
        defaultValue: value,
        spellCheck: false,
        onClick: (event) => event.stopPropagation(),
        onDoubleClick: (event) => event.stopPropagation(),
        onKeyDown: (event) => {
          event.stopPropagation()
          if (event.key === 'Enter') {
            event.preventDefault()
            commit(event.currentTarget.value)
          } else if (event.key === 'Escape') {
            event.preventDefault()
            cancel()
          }
        },
        onBlur: (event) => commit(event.currentTarget.value),
      })
    }

    function MoveWorkspaceMenu({ point, title, workspaces, busy, t, onClose, onPick, onChooseFolder }) {
      const items = []
      if (title !== undefined && title !== null && title.length > 0) items.push({ type: 'label', id: 'title', text: title })
      if (workspaces.length === 0) {
        items.push({ type: 'label', id: 'empty', text: t('noWorkspaces') })
      } else {
        for (const workspace of workspaces) {
          items.push({
            id: workspace.workspaceId,
            label: workspace.title,
            icon: h(primitiveIcons?.IconFolderOpenRegular ?? FolderIcon, { size: 16 }),
          })
        }
      }
      items.push({ type: 'separator', id: 'separator' })
      items.push({
        id: 'choose',
        label: t('chooseFolder'),
        icon: h(primitiveIcons?.IconPlusOutlineRegular ?? FolderPlusIcon, { size: 16 }),
        disabled: busy === true,
      })
      return h(ContextMenu, {
        point,
        items,
        onClose,
        onSelect: (id) => {
          if (id === 'choose') onChooseFolder()
          else if (id !== 'empty' && id !== 'title') onPick(id)
        },
      })
    }

    function ChatRow({ row, t, now, renaming, multiSelected, bridge, useWorkspaces, style, onRenameCommit, onRenameCancel, onOpen, onToggleSelect, onMenu, onContextMenu }) {
      const status = statusStateOf(row.status)
      return h('div', {
        className: 'dch-chatRow',
        style,
        role: 'treeitem',
        'data-row-key': `session:${row.id}`,
        'data-multi-selected': multiSelected === true ? 'true' : 'false',
        'aria-selected': row.selected === true || multiSelected === true,
        tabIndex: renaming ? -1 : 0,
        onClick: (event) => {
          if (renaming) return
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onToggleSelect(row.id)
            return
          }
          onOpen(row.id)
        },
        onKeyDown: (event) => {
          if (renaming || event.target !== event.currentTarget) return
          if (event.key !== 'Enter' && event.key !== ' ') return
          if (event.altKey || event.shiftKey) return
          event.preventDefault()
          if (event.ctrlKey || event.metaKey) onToggleSelect(row.id)
          else onOpen(row.id)
        },
        onContextMenu: (event) => {
          if (renaming) return
          event.preventDefault()
          event.stopPropagation()
          onContextMenu(event, row)
        },
      }, [
        h('span', { className: 'dch-chatLeading', key: 'leading' },
          status === 'idle' ? null : h('span', { className: 'dch-chatDot', 'data-state': status })),
        renaming
          ? h(RenameInput, {
            key: 'rename',
            value: row.summary?.title ?? '',
            onCommit: onRenameCommit,
            onCancel: onRenameCancel,
          })
          : h('span', { className: 'dch-chatTitle', key: 'title', title: row.title }, row.title),
        h('span', { className: 'dch-chatTime', key: 'time' }, relativeTime(row.updatedAt, now, t)),
        h('span', { className: 'dch-chatActions', key: 'actions' }, [
          h('button', {
            key: 'menu',
            type: 'button',
            className: 'wnFoaW_iconButton',
            title: t('chat.actions'),
            'aria-label': t('chat.actions'),
            onClick: (event) => {
              event.stopPropagation()
              onMenu(event, row)
            },
          }, h(primitiveIcons?.IconEllipsisOutlineRegular ?? EllipsisIcon, { size: 16 })),
          h(MoveChatRowAction, {
            key: 'move',
            sessionId: row.id,
            displayTitle: row.summary?.title ?? '',
            useWorkspaces,
            bridge,
            t,
          }),
        ]),
      ])
    }

    function ChatsSection({ rows, realWorkspaces, chatsId, bridge, t, onNewChat, useWorkspaces, selection, onToggleSelect, onOpenBulk, onRequestDelete }) {
      const [collapsed, setCollapsed] = React.useState(() => readStored(CHATS_COLLAPSED_KEY, false) === true)
      const [actionState, setActionState] = React.useState(null)
      const [moveState, setMoveState] = React.useState(null)
      const [renaming, setRenaming] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [creating, setCreating] = React.useState(false)
      const now = useNow()

      const toggle = () => {
        const next = !collapsed
        setCollapsed(next)
        writeStored(CHATS_COLLAPSED_KEY, next)
      }

      const openActions = (event, row) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const point = { x: rect.left, y: rect.bottom }
        if (selection.size > 1 && selection.has(row.id)) {
          onOpenBulk(point)
          return
        }
        setActionState({ row, point })
      }

      const openContext = (event, row) => {
        const point = { x: event.clientX, y: event.clientY }
        if (selection.size > 1 && selection.has(row.id)) {
          onOpenBulk(point)
          return
        }
        setActionState({ row, point })
      }

      const startRename = (row) => {
        setActionState(null)
        setMoveState(null)
        setRenaming({ id: row.id, value: row.summary?.title ?? '' })
      }

      const commitRename = async (value) => {
        const current = renaming
        setRenaming(null)
        if (current === null) return
        const title = String(value ?? '').trim()
        if (title.length === 0) return
        try {
          const result = await bridge.sessions?.using?.(current.id, { source: 'workspaceOperation' }, (reference) => reference.binding.session.rename(title))
          if (result !== undefined && result !== null && result.ok === false) {
            throw new Error(result.error?.message ?? 'Rename failed')
          }
        } catch (error) {
          toastStore.push('error', t('renameFailed', { message: messageOf(error) }))
        }
      }

      const copyId = async (row) => {
        try {
          await navigator.clipboard.writeText(row.id)
          toastStore.push('info', t('copied'))
        } catch (error) {
          toastStore.push('error', messageOf(error))
        }
      }

      const newChat = async () => {
        if (creating) return
        if (collapsed) {
          // A new chat only makes sense where its row can be seen.
          setCollapsed(false)
          writeStored(CHATS_COLLAPSED_KEY, false)
        }
        setCreating(true)
        try {
          await onNewChat()
        } finally {
          setCreating(false)
        }
      }

      const move = async (row, target) => {
        setBusy(true)
        try {
          const data = await chatApi({ action: 'move', sessionId: row.id, ...target })
          setMoveState(null)
          toastStore.push('info', t('moved', { name: data.workspace?.title ?? '' }))
        } catch (error) {
          toastStore.push('error', t('moveFailed', { message: messageOf(error) }))
        } finally {
          setBusy(false)
        }
      }

      const chooseFolder = async () => {
        try {
          const directory = await bridge.uiWorkspace?.pickDirectory?.()
          if (typeof directory === 'string' && directory.length > 0 && moveState !== null) {
            await move(moveState.row, { path: directory })
          }
        } catch (error) {
          toastStore.push('error', t('moveFailed', { message: messageOf(error) }))
        }
      }

      const actionItems = [
        { id: 'rename', label: t('rename'), icon: h(primitiveIcons?.IconEditOutlineRegular ?? PencilIcon, { size: 16 }) },
        { id: 'move', label: t('move'), icon: h(primitiveIcons?.IconFolderOpenRegular ?? FolderIcon, { size: 16 }) },
        { type: 'separator', id: 'separator' },
        { id: 'delete', label: t('delete'), icon: h(primitiveIcons?.IconTrashOutlineRegular ?? DeleteIcon, { size: 16 }), danger: true },
        { id: 'copy', label: t('session.copyId'), icon: h(CopyIcon, { size: 15 }) },
      ]

      const actionSelect = (id) => {
        const current = actionState
        if (current === null) return
        setActionState(null)
        if (id === 'rename') startRename(current.row)
        else if (id === 'move') setMoveState({ row: current.row, point: current.point, title: t('moveTitle', { name: current.row.title }) })
        else if (id === 'delete') onRequestDelete([current.row.id], ctrlHeld)
        else if (id === 'copy') copyId(current.row)
      }

      return h(React.Fragment, null, [
        h('div', { className: 'GAkraW_sectionHeader dch-chats-header', key: 'header' }, [
          h('button', {
            key: 'chevron',
            type: 'button',
            className: 'dch-chats-chevron',
            'aria-expanded': collapsed ? 'false' : 'true',
            title: collapsed ? t('expandChats') : t('collapseChats'),
            onClick: toggle,
          }, h(ChevronIcon, { open: !collapsed, size: 14 })),
          h('span', { className: 'GAkraW_sectionLabel', key: 'label' }, t('chats')),
          h('span', { className: 'dch-chats-spacer', key: 'spacer' }),
          h('button', {
            key: 'add',
            type: 'button',
            className: 'GAkraW_iconButton dch-chats-add',
            title: t('newChat'),
            'aria-label': t('newChat'),
            disabled: creating,
            onClick: newChat,
          }, h(NewChatIcon, { size: 16 })),
        ]),
        h('div', {
          className: 'dch-collapse dch-chats-collapse',
          key: 'collapse',
          'data-collapsed': collapsed ? 'true' : 'false',
          'aria-hidden': collapsed ? 'true' : 'false',
        }, h('div', { className: 'dch-collapseClip', key: 'clip' }, [h(primitiveIcons?.AnimatedRows ?? 'div', primitiveIcons?.AnimatedRows === undefined
          ? { className: 'dch-chats-rows', key: 'rows' }
          : { className: 'dch-chats-rows', key: 'rows', role: 'tree', label: t('chats'), rowKeys: rows.length === 0 ? ['empty'] : rows.map((row) => `session:${row.id}`), ready: true, resetKey: chatsId ?? 'chats' }, rows.length === 0
          ? h('div', { className: 'dch-chats-empty', key: 'empty' }, [
            h('div', { key: 'title' }, t('noChats')),
            h('div', { key: 'hint' }, t('noChatsHint')),
            h('button', { key: 'action', type: 'button', className: 'dch-chats-emptyButton', disabled: creating, onClick: newChat }, t('newChat')),
          ])
          : rows.map((row, index) => h(ChatRow, {
            key: row.id,
            row,
            t,
            now,
            style: {
              '--dch-row-in': `${Math.min(index, 8) * 18}ms`,
              '--dch-row-out': `${Math.min(rows.length - 1 - index, 8) * 10}ms`,
            },
            renaming: renaming !== null && renaming.id === row.id,
            multiSelected: selection.has(row.id),
            bridge,
            useWorkspaces,
            onRenameCommit: commitRename,
            onRenameCancel: () => setRenaming(null),
            onOpen: (id) => {
              selectionStore.clear()
              bridge.uiWorkspace.openSession(id)
            },
            onToggleSelect: (id) => onToggleSelect(id),
            onMenu: openActions,
            onContextMenu: openContext,
          })))])),
        h(ContextMenu, {
          key: 'actions',
          point: actionState?.point ?? null,
          items: actionItems,
          onClose: () => setActionState(null),
          onSelect: actionSelect,
        }),
        h(MoveWorkspaceMenu, {
          key: 'move',
          point: moveState?.point ?? null,
          title: moveState?.title ?? '',
          workspaces: realWorkspaces,
          busy,
          t,
          onClose: () => setMoveState(null),
          onPick: (workspaceId) => { if (moveState !== null) move(moveState.row, { workspaceId }) },
          onChooseFolder: chooseFolder,
        }),
      ])
    }


    function ChatsHost(props) {
      const { wide, useWorkspaces, useSessions, useSessionStatus, usePanelInfo, bridge, createChat, t, renderSlot } = props
      const workspaceState = useWorkspaces((state) => state)
      const sessionState = useSessions((state) => state)
      const statuses = useSessionStatus((state) => state)
      const activePanelId = usePanelInfo((info) => info.activePanelId)
      const chats = useChatStore()
      const selection = useSelection()
      const [host, setHost] = React.useState(null)
      const [bulkPoint, setBulkPoint] = React.useState(null)
      const [bulkMovePoint, setBulkMovePoint] = React.useState(null)
      const hostRef = React.useRef(null)
      const tRef = React.useRef(t)
      const deletingBlanksRef = React.useRef(new Set())
      tRef.current = t
      useCtrlTracker()

      const workspaces = workspaceState.items ?? []
      const chatsId = chats.chatsWorkspaceId
        ?? bridge.chatsId
        ?? workspaces.find((workspace) => workspace.title === 'Chats' || samePathText(workspace.path, chats.workspaceRoot))?.workspaceId
      const chatsWorkspace = chatsId === undefined ? undefined : workspaces.find((workspace) => workspace.workspaceId === chatsId)
      const realWorkspaces = workspaces.filter((workspace) => workspace.workspaceId !== chatsId)
      const archived = new Set(workspaceState.archivedSessionIds ?? [])
      const selectedId = activePanelId === null || activePanelId === undefined
        ? Object.values(sessionState.byId ?? {}).find((row) => (row?.retainedBy?.mainView ?? 0) > 0)?.id
        : undefined
      const selectedWorkspace = selectedId === undefined ? undefined : workspaces.find((workspace) => workspace.sessionIds.includes(selectedId))
      const rows = (chatsWorkspace?.sessionIds ?? [])
        .map((id) => {
          const summary = sessionState.byId?.[id]
          if (summary === undefined || summary.origin === 'subagent' || archived.has(id)) return null
          return {
            id,
            summary,
            title: displayChatTitle(summary, t),
            updatedAt: summary.updatedAt ?? 0,
            status: statuses?.get?.(id),
            selected: id === selectedId,
          }
        })
        .filter(Boolean)
        .sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0))

      const selectedIds = [...selection]
      const selectedRecords = selectedIds.map((id) => chats.chats.find((chat) => chat.sessionId === id))
      const canMoveAll = selectedIds.length > 0 && selectedRecords.every((chat) => chat !== undefined && (chat.movedTo === null || chat.movedTo === undefined))
      const pinnedSessionIds = new Set(workspaceState.pinnedSessionIds ?? [])
      const allPinned = selectedIds.length > 0 && selectedIds.every((id) => pinnedSessionIds.has(id))

      const titleFor = (id) => rows.find((row) => row.id === id)?.title ?? displayChatTitle(sessionState.byId?.[id], t)

      const deleteChats = async (ids) => {
        if (ids.length === 0) return
        try {
          const data = await chatApi({ action: 'delete', sessionIds: ids })
          const deleted = Array.isArray(data.deleted) ? data.deleted : []
          const errors = Array.isArray(data.errors) ? data.errors : []
          if (deleted.length > 0) {
            toastStore.push('info', deleted.length === 1 ? t('deletedOne') : t('deletedMany', { n: deleted.length }))
          }
          for (const error of errors) {
            toastStore.push('error', t('deleteFailed', { message: error.error ?? 'Error' }))
          }
          selectionStore.clear()
          const removed = new Set(deleted.map((entry) => entry.sessionId).filter(Boolean))
          if (removed.size > 0) {
            const snapshot = chatStore.getSnapshot()
            chatStore.set({ chats: snapshot.chats.filter((chat) => !removed.has(chat.sessionId)) })
          }
        } catch (error) {
          toastStore.push('error', t('deleteFailed', { message: messageOf(error) }))
        }
      }

      const requestDelete = (ids, immediate) => {
        if (ids.length === 0) return
        if (immediate === true || ctrlHeld) {
          void deleteChats(ids)
          return
        }
        const text = ids.length === 1
          ? t('deleteConfirmOne', { name: titleFor(ids[0]) })
          : t('deleteConfirmMany', { n: ids.length })
        toastStore.pushConfirm(text, () => {
          void deleteChats(ids)
        })
      }

      const moveMany = async (ids, target) => {
        if (ids.length === 0) return
        const errors = []
        let moved = 0
        for (const id of ids) {
          try {
            await chatApi({ action: 'move', sessionId: id, ...target })
            moved += 1
          } catch (error) {
            errors.push(error)
          }
        }
        const name = realWorkspaces.find((workspace) => workspace.workspaceId === target.workspaceId)?.title ?? ''
        if (moved > 0) {
          toastStore.push('info', moved === 1 ? t('moved', { name }) : t('movedMany', { n: moved, name }))
        }
        for (const error of errors) {
          toastStore.push('error', t('moveFailed', { message: messageOf(error) }))
        }
        selectionStore.clear()
      }

      const runBulk = async (op) => {
        const ids = selectionStore.values()
        if (ids.length === 0) return
        try {
          const data = await chatApi({ action: op, sessionIds: ids })
          const done = Array.isArray(data.done) ? data.done : []
          const errors = Array.isArray(data.errors) ? data.errors : []
          for (const error of errors) {
            toastStore.push('error', t('bulkOpFailed', { message: error.error ?? 'Error' }))
          }
          if (done.length > 0) {
            if (op === 'pin') toastStore.push('info', t('pinnedMany', { n: done.length }))
            else if (op === 'unpin') toastStore.push('info', t('unpinnedMany', { n: done.length }))
            else if (op === 'archive') toastStore.push('info', t('archivedMany', { n: done.length }))
          }
          if (op === 'archive') selectionStore.clear()
        } catch (error) {
          toastStore.push('error', t('bulkOpFailed', { message: messageOf(error) }))
        }
      }

      const bulkSelect = (id) => {
        const point = bulkPoint
        setBulkPoint(null)
        if (id === 'pin' || id === 'unpin' || id === 'archive') {
          void runBulk(id)
          return
        }
        if (id === 'delete') {
          requestDelete(selectionStore.values(), ctrlHeld)
          return
        }
        if (id === 'move') {
          setBulkMovePoint(point)
        }
      }

      React.useEffect(() => {
        bridge.translate = t
        bridge.chatsId = chatsId
        bridge.currentWorkspaceId = selectedWorkspace?.workspaceId
        bridge.firstRealWorkspaceId = realWorkspaces[0]?.workspaceId
        applyChatsGroupStyle(chatsId)
        return () => {
          if (bridge.translate === t) bridge.translate = undefined
        }
      }, [bridge, t, chatsId, selectedWorkspace, realWorkspaces])

      React.useEffect(() => {
        const inChat = chatsId !== undefined && selectedWorkspace?.workspaceId === chatsId
        document.body.classList.toggle('dsh-chats-mode', inChat)
        return () => {
          document.body.classList.remove('dsh-chats-mode')
        }
      }, [chatsId, selectedWorkspace?.workspaceId])

      React.useEffect(() => {
        for (const chat of chats.chats) {
          const id = chat.sessionId
          if (typeof id !== 'string' || id === selectedId) continue
          if (deletingBlanksRef.current.has(id)) continue
          const summary = sessionState.byId?.[id]
          if (summary?.blank !== true) continue
          deletingBlanksRef.current.add(id)
          void chatApi({ action: 'delete', sessionIds: [id] }).catch(() => undefined).finally(() => {
            deletingBlanksRef.current.delete(id)
          })
        }
      }, [chats.chats, sessionState, selectedId])

      React.useEffect(() => {
        let alive = true
        const tick = async () => {
          if (document.hidden) return
          try {
            const data = await chatApi()
            if (!alive) return
            chatStore.set({
              chats: Array.isArray(data.chats) ? data.chats : [],
              chatsWorkspaceId: data.chatsWorkspaceId ?? undefined,
              workspaceRoot: data.workspaceRoot ?? '',
              linkRoot: data.linkRoot ?? '',
            })
          } catch {
            // The host half may still be activating; the next tick retries.
          }
        }
        tick()
        const timer = window.setInterval(tick, 3000)
        return () => {
          alive = false
          window.clearInterval(timer)
        }
      }, [])

      React.useEffect(() => {
        syncSelectionHighlights(selection)
        if (selection.size === 0) {
          setBulkPoint(null)
          setBulkMovePoint(null)
        }
      }, [selection])

      React.useEffect(() => {
        const onClickCapture = (event) => {
          const target = event.target
          if (!(target instanceof Element)) return
          if (target.closest('.dch-chats-section-host') !== null) return
          if (target.closest('.dch-toastStack') !== null) return
          if (target.closest('[role="menu"], .dch-menu, .dch-menuBackdrop') !== null) return
          if (target.closest('[class*="wtg9ga_regionArea"]') === null) return
          const row = target.closest('[data-row-key^="session:"]')
          if (row === null) {
            if (!(event.ctrlKey || event.metaKey)) selectionStore.clear()
            return
          }
          const key = row.getAttribute('data-row-key') ?? ''
          const sessionId = key.slice('session:'.length)
          if (event.ctrlKey || event.metaKey) {
            if (target.closest('button') !== null) return
            event.preventDefault()
            event.stopPropagation()
            selectionStore.toggle(sessionId)
            return
          }
          if (selectionStore.has(sessionId)) {
            const trigger = target.closest('button[data-context-menu-trigger]')
            if (trigger !== null) {
              event.preventDefault()
              event.stopPropagation()
              const rect = trigger.getBoundingClientRect()
              setBulkPoint({ x: rect.left, y: rect.bottom })
              return
            }
          }
          selectionStore.clear()
        }
        const onContextMenuCapture = (event) => {
          const target = event.target
          if (!(target instanceof Element)) return
          if (target.closest('.dch-chats-section-host') !== null) return
          if (target.closest('.dch-toastStack') !== null) return
          if (target.closest('[role="menu"], .dch-menu, .dch-menuBackdrop') !== null) return
          if (target.closest('[class*="wtg9ga_regionArea"]') === null) return
          const row = target.closest('[data-row-key^="session:"]')
          if (row === null) return
          const key = row.getAttribute('data-row-key') ?? ''
          const sessionId = key.slice('session:'.length)
          if (selectionStore.has(sessionId)) {
            event.preventDefault()
            event.stopPropagation()
            setBulkPoint({ x: event.clientX, y: event.clientY })
          }
        }
        document.addEventListener('click', onClickCapture, true)
        document.addEventListener('contextmenu', onContextMenuCapture, true)
        return () => {
          document.removeEventListener('click', onClickCapture, true)
          document.removeEventListener('contextmenu', onContextMenuCapture, true)
        }
      }, [])

      React.useEffect(() => {
        if (wide !== true) {
          uninstallRowMotion()
          hostRef.current?.remove()
          hostRef.current = null
          setHost(null)
          for (const button of document.querySelectorAll('button.dch-workspaces-toggle')) button.remove()
          for (const root of document.querySelectorAll('[class*="GAkraW_root"]')) resetWorkspacesRoot(root)
          return undefined
        }
        let disposed = false
        let retry = null
        const sync = () => {
          if (disposed) return false
          try {
            const region = document.querySelector('[class*="wtg9ga_regionArea"]')
            const browser = region?.querySelector('[class*="GAkraW_root"]')
            if (region === null || region === undefined || browser === null || browser === undefined) return false
            installRowMotion(region)
            let node = hostRef.current
            if (node === null || !node.isConnected) {
              node = document.createElement('div')
              node.className = 'dch-chats-section-host'
              hostRef.current = node
              setHost(node)
            }
            const parent = browser.parentElement
            if (parent !== null && (node.parentElement !== parent || node.nextElementSibling !== browser)) {
              parent.insertBefore(node, browser)
            }
            ensureWorkspacesToggle(browser, tRef.current)
            syncChatAddColor(browser)
            syncSelectionHighlights(selectionStore.getSnapshot())
            return true
          } catch {
            return false
          }
        }
        const attempt = () => {
          if (!sync() && !disposed) retry = window.setTimeout(attempt, 350)
        }
        attempt()
        const interval = window.setInterval(sync, 1500)
        return () => {
          disposed = true
          if (retry !== null) window.clearTimeout(retry)
          window.clearInterval(interval)
          uninstallRowMotion()
          hostRef.current?.remove()
          hostRef.current = null
          for (const button of document.querySelectorAll('button.dch-workspaces-toggle')) button.remove()
          for (const root of document.querySelectorAll('[class*="GAkraW_root"]')) resetWorkspacesRoot(root)
        }
      }, [wide])

      const bulkItems = [
        { type: 'label', id: 'label', text: t('multiActions', { n: selectedIds.length }) },
        {
          id: allPinned ? 'unpin' : 'pin',
          label: t(allPinned ? 'unpinSession' : 'pinSession'),
          icon: h(allPinned ? (primitiveIcons?.IconPinFillRegular ?? FolderIcon) : (primitiveIcons?.IconPinOutlineRegular ?? FolderIcon), { size: 16 }),
        },
        ...(canMoveAll
          ? [{ id: 'move', label: t('move'), icon: h(primitiveIcons?.IconFolderOpenRegular ?? FolderIcon, { size: 16 }) }]
          : []),
        { type: 'separator', id: 'separator' },
        { id: 'archive', label: t('archiveSession'), icon: h(primitiveIcons?.IconArchiveOutlineRegular ?? FolderIcon, { size: 16 }) },
        { id: 'delete', label: t('delete'), icon: h(primitiveIcons?.IconTrashOutlineRegular ?? DeleteIcon, { size: 16 }), danger: true },
      ]

      return h(React.Fragment, null, [
        host !== null && wide === true
          ? createPortal(h(ChatsSection, {
            rows,
            realWorkspaces,
            chatsId,
            bridge,
            t,
            onNewChat: createChat,
            useWorkspaces,
            selection,
            onToggleSelect: (id) => selectionStore.toggle(id),
            onOpenBulk: (point) => setBulkPoint(point),
            onRequestDelete: requestDelete,
          }), host)
          : null,
        h(ContextMenu, {
          key: 'bulk',
          point: bulkPoint,
          items: bulkItems,
          onClose: () => setBulkPoint(null),
          onSelect: bulkSelect,
        }),
        h(MoveWorkspaceMenu, {
          key: 'bulkMove',
          point: bulkMovePoint,
          title: bulkMovePoint === null ? '' : t('bulkMoveTitle', { n: selectedIds.length }),
          workspaces: realWorkspaces,
          busy: false,
          t,
          onClose: () => setBulkMovePoint(null),
          onPick: (workspaceId) => {
            const ids = selectionStore.values()
            setBulkMovePoint(null)
            void moveMany(ids, { workspaceId })
          },
          onChooseFolder: async () => {
            try {
              const directory = await bridge.uiWorkspace?.pickDirectory?.()
              if (typeof directory === 'string' && directory.length > 0) {
                const ids = selectionStore.values()
                setBulkMovePoint(null)
                await moveMany(ids, { path: directory })
              }
            } catch (error) {
              toastStore.push('error', t('moveFailed', { message: messageOf(error) }))
            }
          },
        }),
      ])
    }

    function MoveChatRowAction(props) {
      const { sessionId, displayTitle, useWorkspaces, bridge, t } = props
      const workspaces = useWorkspaces((state) => state.items)
      const chats = useChatStore()
      const [point, setPoint] = React.useState(null)
      const [busy, setBusy] = React.useState(false)

      const chatsId = chats.chatsWorkspaceId
        ?? bridge.chatsId
        ?? workspaces.find((workspace) => workspace.title === 'Chats' || samePathText(workspace.path, chats.workspaceRoot))?.workspaceId
      const workspace = workspaces.find((candidate) => candidate.sessionIds.includes(sessionId))
      const isChat = chatsId !== undefined && chatsId !== null && workspace?.workspaceId === chatsId

      if (!isChat) return null

      const move = async (target) => {
        setBusy(true)
        try {
          const data = await chatApi({ action: 'move', sessionId, ...target })
          setPoint(null)
          toastStore.push('info', t('moved', { name: data.workspace?.title ?? '' }))
        } catch (error) {
          toastStore.push('error', t('moveFailed', { message: messageOf(error) }))
        } finally {
          setBusy(false)
        }
      }

      const chooseFolder = async () => {
        try {
          const directory = await bridge.uiWorkspace?.pickDirectory?.()
          if (typeof directory === 'string' && directory.length > 0) await move({ path: directory })
        } catch (error) {
          toastStore.push('error', t('moveFailed', { message: messageOf(error) }))
        }
      }

      return h(React.Fragment, null, [
        h('button', {
          key: 'move',
          type: 'button',
          className: 'wnFoaW_iconButton',
          title: t('move'),
          'aria-label': t('move'),
          onClick: (event) => {
            event.stopPropagation()
            const rect = event.currentTarget.getBoundingClientRect()
            setPoint({ x: rect.left, y: rect.bottom })
          },
        }, h(primitiveIcons?.IconFolderOpenRegular ?? MoveIcon, { size: 16 })),
        h(MoveWorkspaceMenu, {
          key: 'menu',
          point,
          title: point === null ? '' : t('moveTitle', { name: displayTitle || t('move') }),
          workspaces: workspaces.filter((candidate) => candidate.workspaceId !== chatsId),
          busy,
          t,
          onClose: () => setPoint(null),
          onPick: (workspaceId) => {
            setPoint(null)
            move({ workspaceId })
          },
          onChooseFolder: chooseFolder,
        }),
      ])
    }

    function Toaster(props) {
      const items = useToastStore()
      const t = typeof props.t === 'function' ? props.t : (key) => key
      const item = items.length === 0 ? undefined : items[items.length - 1]
      if (item === undefined) return null
      const isConfirm = item.kind === 'confirm'
      const isError = item.kind === 'error'
      const warning = primitiveIcons?.IconWarningOutlineRegular
      const trash = primitiveIcons?.IconTrashOutlineRegular
      const success = primitiveIcons?.IconCheckCircleOutlineRegular
      const icon = isConfirm || isError ? warning : success
      return h('div', { className: 'dch-toastLayer' }, h('div', {
        className: 'dch-toast',
        role: isError || isConfirm ? 'alert' : 'status',
        'data-kind': item.kind,
      }, [
        icon !== undefined
          ? h('span', { className: 'dch-toastIcon', key: 'icon' }, h(icon, { size: 16 }))
          : null,
        h('span', { className: 'dch-toastText', key: 'text' }, item.text),
        isConfirm
          ? h('span', { className: 'dch-toastActions', key: 'actions' }, [
            h('button', {
              key: 'cancel',
              type: 'button',
              className: 'dch-toastAction',
              'data-action': 'cancel',
              onClick: () => toastStore.dismiss(item.id),
            }, t('cancel')),
            h('button', {
              key: 'delete',
              type: 'button',
              className: 'dch-toastAction',
              'data-action': 'delete',
              onClick: () => {
                toastStore.dismiss(item.id)
                item.onConfirm?.()
              },
            }, [
              trash !== undefined ? h(trash, { key: 'icon', size: 14 }) : null,
              h('span', { key: 'label' }, t('deleteNow')),
            ]),
          ])
          : null,
      ]))
    }


    function apply(ctx) {
      ctx.inject(['locale', 'slots', 'uiWorkspace', 'sessions', 'contextMenus'], (scope) => {
        scope.effect(() => scope.locale.register(NS, {
          en: EN,
          it: IT,
          zh: ZH,
          es: EN,
          fr: EN,
          de: EN,
          ja: EN,
          pt: EN,
          ru: EN,
        }), 'dsh-chats: dictionaries')
        scope.effect(() => injectStyles(), 'dsh-chats: styles')

        const bridge = ensureBridge(scope.uiWorkspace)
        bridge.uiWorkspace = scope.uiWorkspace
        bridge.sessions = scope.sessions
        bridge.createChat = () => createChatRuntime(scope.uiWorkspace, bridge)

        const t = scope.locale.bind(NS)
        const askDelete = (sessionId, displayTitle) => {
          const run = async () => {
            try {
              const data = await chatApi({ action: 'delete', sessionIds: [sessionId] })
              const deleted = Array.isArray(data.deleted) ? data.deleted : []
              const errors = Array.isArray(data.errors) ? data.errors : []
              if (deleted.length > 0) toastStore.push('info', t('deletedOne'))
              for (const error of errors) toastStore.push('error', t('deleteFailed', { message: error.error ?? 'Error' }))
              const snapshot = chatStore.getSnapshot()
              chatStore.set({ chats: snapshot.chats.filter((chat) => chat.sessionId !== sessionId) })
              if (selectionStore.has(sessionId)) selectionStore.toggle(sessionId)
            } catch (error) {
              toastStore.push('error', t('deleteFailed', { message: messageOf(error) }))
            }
          }
          if (ctrlHeld) {
            void run()
            return
          }
          toastStore.pushConfirm(t('deleteConfirmOne', { name: displayTitle || t('delete') }), () => {
            void run()
          })
        }

        scope.effect(() => scope.contextMenus.register({
          id: 'session.delete-chat',
          target: 'session',
          order: 900,
          resolve: (target) => {
            if (target === null || target === undefined || typeof target.sessionId !== 'string' || target.sessionId.length === 0) return []
            return [{
              id: 'delete-chat',
              label: t('delete'),
              icon: { key: 'workspace.delete' },
              danger: true,
              run: () => askDelete(target.sessionId, target.displayTitle),
            }]
          },
        }), 'dsh-chats: delete session menu')

        scope.effect(() => scope.slots.inject('sidebar.footer.action', () => scope.slots.register({
          name: 'sidebar.footer.action',
          id: 'dsh-chats.host',
          order: 50,
          locale: NS,
          inject: () => ({ bridge, createChat: bridge.createChat }),
        }, ChatsHost)), 'dsh-chats: chats host')

        scope.effect(() => scope.slots.inject('sidebar.workspaces.session.row.action', () => scope.slots.register({
          name: 'sidebar.workspaces.session.row.action',
          id: 'dsh-chats.move',
          order: 50,
          locale: NS,
          inject: () => ({ bridge }),
        }, MoveChatRowAction)), 'dsh-chats: move action')

        scope.effect(() => scope.slots.inject('shell.overlay', () => scope.slots.register({
          name: 'shell.overlay',
          id: 'dsh-chats.toast',
          order: 50,
          locale: NS,
        }, Toaster)), 'dsh-chats: toasts')
      })
    }

    return { apply }
  },
})
