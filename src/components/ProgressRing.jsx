/**
 * SVG 进度环
 * ---------------------------------------------------------------
 * 用于卡片掌握度、测验得分。比 conic-gradient 更可控：
 * 可加圆角端点、渐变描边和轻微发光。
 */
export default function ProgressRing({
  value = 0,
  size = 132,
  stroke = 9,
  label,
  sub,
  gradientId = 'ringGrad',
  children,
}) {
  const pct = Math.min(Math.max(value, 0), 100)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="55%" stopColor="var(--primary-2)" />
            <stop offset="100%" stopColor="var(--accent-3, #38bdf8)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={stroke}
        />
        <circle
          className="ring-arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">
        {children ?? (
          <>
            <span className="ring-value num">{pct}</span>
            {label && <span className="ring-label">{label}</span>}
            {sub && <span className="ring-sub">{sub}</span>}
          </>
        )}
      </div>
    </div>
  )
}
