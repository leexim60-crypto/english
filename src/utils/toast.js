/**
 * 全局轻提示（Toast）事件总线。
 * 任何模块（组件/工具函数）都可以直接调用 toast()，
 * 由 App 中挂载的 <Toast /> 组件监听并渲染。
 *
 * 用法：
 *   toast('已加入生词本 ⭐')            // 默认 info
 *   toast('复制失败', 'error')
 *   toast('复习完成 🎉', 'success', 3000)
 */

let listeners = []

/** 触发一条 toast，返回其 id（可手动关闭） */
export function toast(message, type = 'info', duration = 2400) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  for (const l of listeners) {
    try {
      l({ id, message, type, duration })
    } catch {
      /* ignore */
    }
  }
  return id
}

/** Toast 组件订阅用；返回取消订阅函数 */
export function onToast(cb) {
  listeners.push(cb)
  return () => {
    listeners = listeners.filter((l) => l !== cb)
  }
}

/** 手动关闭一条 toast（供点击关闭用） */
export function offToast(id) {
  for (const l of listeners) {
    try {
      l({ type: '__dismiss__', id })
    } catch {
      /* ignore */
    }
  }
}