import { useEffect, useRef } from 'react'

/**
 * 通用弹窗容器
 * ---------------------------------------------------------------
 * 统一处理：遮罩点击关闭 / Esc 关闭 / 背景锁滚动 / 焦点陷阱
 * （Tab 键循环停留在弹窗内部，不会跑到背后的页面元素上）。
 */
export default function Modal({ open, onClose, labelledBy, className = '', children }) {
  const boxRef = useRef(null)
  const lastFocused = useRef(null)

  useEffect(() => {
    if (!open) return

    lastFocused.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        boxRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || []
      ).filter((el) => el.offsetParent !== null)

    // 打开后把焦点移入弹窗
    const t = setTimeout(() => {
      const list = focusables()
      ;(list[0] || boxRef.current)?.focus()
    }, 40)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      // 关闭后焦点回到触发元素
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={boxRef}
        className={`modal-box ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
