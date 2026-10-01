import { useEffect, useRef, useState } from 'react'

/**
 * 滚动入场容器
 * ---------------------------------------------------------------
 * 元素进入视口后加上 .is-in，触发 CSS 过渡（位移 + 淡入 + 轻微缩放）。
 * 只观察一次（unobserve），避免来回滚动反复播放造成干扰。
 *
 * @param {number} delay  延迟（毫秒），用于同级元素错峰入场
 * @param {string} as     渲染标签，默认 div
 * @param {string} variant 'up' | 'fade' | 'scale' | 'left' | 'right'
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  variant = 'up',
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 环境不支持 / 用户要求减少动效：直接展示
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.unobserve(entry.target)
        }
      },
      // threshold 0 + 无负 rootMargin：元素刚触到视口下沿就开始入场，
      // 避免内容在视口外“保持隐藏”而被截图/长页面场景漏掉
      { threshold: 0 }
    )
    io.observe(el)

    // 兜底：极老的环境下 IO 回调可能不触发，2s 后强制展示，内容永远可读
    const safety = setTimeout(() => setShown((s) => s || el.getBoundingClientRect().top < window.innerHeight), 2000)

    return () => {
      clearTimeout(safety)
      io.disconnect()
    }
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`.trim()}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
