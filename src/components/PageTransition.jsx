import { useEffect, useState } from 'react'

/**
 * 页面切换过渡容器。
 * 在 App 中以 key={tab} 使用，tab 变化时组件重新挂载，
 * 借助 CSS 动画（.page-enter）实现淡入上移的切换效果。
 * 首屏不播动画，避免进入站点时出现多余的"弹入"。
 */
export default function PageTransition({ children }) {
  const [first] = useState(() => !window.__pageEntered)
  useEffect(() => {
    window.__pageEntered = true
  }, [])
  return <div className={first ? 'page-static' : 'page-enter'}>{children}</div>
}
