/**
 * 统一图标系统
 * ---------------------------------------------------------------
 * 全部为 24×24 描边图标，currentColor 取色，stroke-width 统一，
 * 保证导航/按钮/卡片里的图形语言一致（不混用 emoji，避免风格漂移）。
 */
const PATHS = {
  home: <path d="M3.5 10.4 12 3.8l8.5 6.6V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" />,
  cards: (
    <>
      <rect x="3" y="6.5" width="13" height="13" rx="2.4" />
      <path d="M7.5 3.6h10A2.4 2.4 0 0 1 19.9 6v10" />
      <path d="M6.6 12h6.8M6.6 15.4h4.4" />
    </>
  ),
  quiz: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.6" />
      <path d="M8.4 8.2h7.2M8.4 12h7.2M8.4 15.8h4.2" />
    </>
  ),
  chat: <path d="M20.5 12c0 4.1-3.8 7.4-8.5 7.4-1 0-2-.15-2.9-.42L4.5 20.6l1.2-3.5C4.4 15.8 3.5 14 3.5 12c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4z" />,
  star: <path d="M12 3.6l2.6 5.4 5.9.85-4.3 4.15 1.03 5.9L12 17.1l-5.23 2.8 1.03-5.9L3.5 9.85l5.9-.85z" />,
  help: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.75-.9 1.35v.5" />
      <path d="M12 16.6h.01" />
    </>
  ),
  login: (
    <>
      <path d="M14.5 3.5H6.4A1.9 1.9 0 0 0 4.5 5.4v13.2a1.9 1.9 0 0 0 1.9 1.9h8.1" />
      <path d="M14 12h6.5M17.8 8.6 21 12l-3.2 3.4" />
    </>
  ),
  logout: (
    <>
      <path d="M9.5 3.5h8.1a1.9 1.9 0 0 1 1.9 1.9v13.2a1.9 1.9 0 0 1-1.9 1.9H9.5" />
      <path d="M10 12H3.5M6.2 8.6 3 12l3.2 3.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
    </>
  ),
  moon: <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2z" />,
  speaker: (
    <>
      <path d="M11 5.2 6.6 8.9H3.4v6.2h3.2L11 18.8z" />
      <path d="M15.2 9.3a3.8 3.8 0 0 1 0 5.4M17.9 6.6a7.6 7.6 0 0 1 0 10.8" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.8" />
      <path d="m20.4 20.4-4.2-4.2" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.8v11.4M8 11.6l4 3.8 4-3.8" />
      <path d="M4.6 17.4v1.4a1.8 1.8 0 0 0 1.8 1.8h11.2a1.8 1.8 0 0 0 1.8-1.8v-1.4" />
    </>
  ),
  arrowRight: <path d="M4.5 12h15M14.2 6.8 19.5 12l-5.3 5.2" />,
  arrowLeft: <path d="M19.5 12h-15M9.8 6.8 4.5 12l5.3 5.2" />,
  arrowUp: <path d="M12 19.5v-15M6.8 9.8 12 4.5l5.2 5.3" />,
  check: <path d="m5 12.8 4.6 4.6L19 7.2" />,
  close: <path d="M6.2 6.2l11.6 11.6M17.8 6.2 6.2 17.8" />,
  flame: <path d="M12 3.2s5.4 3.6 5.4 8.6a5.4 5.4 0 0 1-10.8 0c0-1.6.7-2.9 1.6-4 .3 1.1 1 1.9 1.9 2.2-.2-2.6.7-5.3 1.9-6.8z" />,
  book: (
    <>
      <path d="M3.8 5.2c2.9-1.3 5.8-1.3 8.2 0 2.4-1.3 5.3-1.3 8.2 0v13.6c-2.9-1.3-5.8-1.3-8.2 0-2.4-1.3-5.3-1.3-8.2 0z" />
      <path d="M12 5.2v13.6" />
    </>
  ),
  sparkle: <path d="M12 3.2l1.9 5.1 5.1 1.9-5.1 1.9L12 17.2l-1.9-5.1L5 10.2l5.1-1.9z" />,
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.4 3.8v4.6h-4.6" />
    </>
  ),
  cloud: <path d="M7.4 18.6h9.9a4.1 4.1 0 0 0 .4-8.2 5.6 5.6 0 0 0-10.7-1.2 4.4 4.4 0 0 0 .4 9.4z" />,
  trend: (
    <>
      <path d="M3.6 16.6 9 11.2l3.4 3.4 7-7" />
      <path d="M15.4 7.6h4.2v4.2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.2 2" />
    </>
  ),
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.7, ...rest }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  )
}
