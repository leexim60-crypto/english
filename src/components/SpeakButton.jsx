import { useCallback, useEffect, useState } from 'react'
import Icon from './Icons.jsx'
import { speak, isSpeaking } from '../utils/speak.js'

/**
 * 发音按钮
 * ---------------------------------------------------------------
 * - 朗读期间显示呼吸波纹（正在播放状态）
 * - 阻止事件冒泡，避免在可点击卡片内部误触发翻面
 * - variant: 'solid'（浅底圆钮）| 'ghost'（深色背景上）| 'sm'（列表内小号）
 */
export default function SpeakButton({ text, variant = 'solid', title = '播放发音', className = '' }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => {
      if (!isSpeaking()) setActive(false)
    }, 400)
    return () => clearInterval(iv)
  }, [active])

  const onClick = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setActive(true)
      speak(text)
      // 兜底：即使浏览器不支持检测，2.5s 后复位
      setTimeout(() => setActive(false), 2500)
    },
    [text]
  )

  const size = variant === 'sm' ? 15 : 19

  return (
    <button
      type="button"
      className={`speak ${variant === 'sm' ? 'speak-sm' : ''} ${
        variant === 'ghost' ? 'speak-ghost' : ''
      } ${active ? 'is-speaking' : ''} ${className}`.trim()}
      onClick={onClick}
      onTouchEnd={(e) => e.stopPropagation()}
      title={title}
      aria-label={title}
    >
      <Icon name="speaker" size={size} />
      <span className="speak-wave" aria-hidden="true" />
    </button>
  )
}
