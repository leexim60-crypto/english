import { useState, useEffect } from 'react'

/**
 * 滚动到顶部可见时显示按钮，不可见时隐藏。
 * 避免在桌面端持续占用右下角空间。
 */
export default function useScrollToTop({ root = null, threshold = 180 } = {}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = root ?? window
    const onScroll = () => {
      const scrollTop = root ? el.scrollTop : window.scrollY
      setVisible(scrollTop > threshold)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [root, threshold])

  return visible
}
