import { useCallback, useRef } from 'react'

/**
 * 鼠标跟随高光
 * ---------------------------------------------------------------
 * 把指针相对元素的位置写成 CSS 变量 --mx / --my（百分比），
 * 配合 CSS 里的 radial-gradient 实现"卡片反光"。
 * 只在支持 hover 的精细指针设备上绑定，触屏无额外开销。
 *
 * 用法：
 *   const spot = useSpotlight()
 *   <div {...spot}> ... </div>
 */
export default function useSpotlight() {
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
