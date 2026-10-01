import { useEffect, useRef, useState } from 'react'

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * 数字滚动
 * ---------------------------------------------------------------
 * 首次进入视口时从 0 滚到目标值，使用等宽数字（tabular-nums）
 * 避免逐帧宽度抖动。支持前缀 / 后缀（如「 天」）。
 *
 * 重要：target 变化时必须重新滚动。
 * 词库是异步加载的（本地兜底 30 词 → 后端返回 4092 词），
 * 如果只在首次进入视口时动画一次，数字会永远停在 30，
 * 造成"单词总数不对"的错觉。
 */
export default function CountUp({ value = 0, duration = 1100, suffix = '', prefix = '' }) {
  const target = Number(value) || 0
  const [display, setDisplay] = useState(target)
  const ref = useRef(null)
  const rafRef = useRef(0)
  // 已进入过视口：后续 target 变化直接补间，不再等 IntersectionObserver
  const visibleRef = useRef(false)
  const fromRef = useRef(target)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const animate = (from, to) => {
      cancelAnimationFrame(rafRef.current)
      if (reduce) {
        setDisplay(to)
        fromRef.current = to
        return
      }
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        setDisplay(Math.round(from + easeOutExpo(p) * (to - from)))
        if (p < 1) rafRef.current = requestAnimationFrame(tick)
        else fromRef.current = to
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    // 已经展示过：target 变化时从当前值补间到新值
    if (visibleRef.current) {
      animate(fromRef.current, target)
      return () => cancelAnimationFrame(rafRef.current)
    }

    if (reduce || typeof IntersectionObserver === 'undefined') {
      visibleRef.current = true
      setDisplay(target)
      fromRef.current = target
      return
    }

    // 元素还在视口外：先把显示值同步为目标值（不能停在旧值上）。
    // 数据是异步到达的（本地 30 词 → 后端 4092 词），若此处不更新，
    // 首屏统计会一直显示旧数字，用户会以为“单词总数不对”。
    setDisplay(target)
    fromRef.current = target

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visibleRef.current = true
          // 首次真正进入视口才播放 0 → target 的滚动动画
          animate(0, target)
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return (
    <span ref={ref} className="num">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
