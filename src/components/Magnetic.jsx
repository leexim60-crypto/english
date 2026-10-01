import { useRef } from 'react'

/**
 * 磁性按钮容器
 * ---------------------------------------------------------------
 * 指针靠近时元素轻微朝指针方向位移（最多 5px），离开时回弹。
 * 这种「跟随感」是获奖站点常见的微交互，成本极低但很显质感。
 * 触屏 / reduced-motion 下不做任何位移。
 */
export default function Magnetic({ children, strength = 5, as: Tag = 'span', className = '', ...rest }) {
  const ref = useRef(null)

  const enabled = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const move = (e) => {
    const el = ref.current
    if (!el || !enabled()) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    el.style.setProperty('--mag-x', `${(dx * strength).toFixed(2)}px`)
    el.style.setProperty('--mag-y', `${(dy * strength).toFixed(2)}px`)
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mag-x', '0px')
    el.style.setProperty('--mag-y', '0px')
  }

  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`.trim()}
      onMouseMove={move}
      onMouseLeave={reset}
      {...rest}
    >
      {children}
    </Tag>
  )
}
