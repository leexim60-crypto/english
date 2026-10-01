import { useEffect, useRef, useState } from 'react'

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * 数字滚动
 * ---------------------------------------------------------------
 * 首次进入视口时从 0 滚到目标值，使用等宽数字（tabular-nums）
 * 避免逐帧宽度抖动。支持前缀 / 后缀（如「 天」）。
 */
export default function CountUp({ value = 0, duration = 1100, suffix = '', prefix = '' }) {
  const target = Number(value) || 0
  const [display, setDisplay] = useState(target)
  const ref = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce || typeof IntersectionObserver === 'undefined') {
      setDisplay(target)
      return
    }

    let raf = 0
    const run = () => {
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        setDisplay(Math.round(easeOutExpo(p) * target))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !doneRef.current) {
          doneRef.current = true
          setDisplay(0)
          run()
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
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
