import { useState, useEffect } from 'react'
import { onToast } from '../utils/toast.js'

const ICONS = {
  success: '✅',
  error: '⚠️',
  info: '💡',
}

const MAX_SHOWN = 3

/**
 * 全局 Toast 容器：底部居中堆叠，自动消失，点击可关闭。
 * 由 App 挂载一次即可，配合 utils/toast.js 使用。
 */
export default function Toast() {
  const [items, setItems] = useState([])

  useEffect(
    () =>
      onToast(({ id, type, message, duration }) => {
        if (type === '__dismiss__') {
          setItems((prev) => prev.filter((i) => i.id !== id))
          return
        }
        setItems((prev) => [...prev.slice(-(MAX_SHOWN - 1)), { id, type, message }])
        if (duration > 0) {
          setTimeout(() => {
            setItems((prev) => prev.filter((i) => i.id !== id))
          }, duration)
        }
      }),
    []
  )

  if (items.length === 0) return null

  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => setItems((prev) => prev.filter((i) => i.id !== t.id))}
        >
          <span className="toast-icon">{ICONS[t.type] || '💡'}</span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  )
}