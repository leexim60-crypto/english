import { useEffect, useRef, useState } from 'react'

/**
 * 顶部滚动进度（0 → 1）。
 * 用 rAF 节流，避免 scroll 事件高频触发重排。
 */
export default function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const update = () => {
      rafRef.current = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0)
    }
    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}
