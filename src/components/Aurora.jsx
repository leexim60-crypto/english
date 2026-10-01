import { useEffect, useRef } from 'react'

/**
 * 极光背景（Aurora）
 * ---------------------------------------------------------------
 * 一块固定全屏 canvas，用「加色混合的径向渐变光斑」缓慢漂移，
 * 形成随主题变化的流体光晕。相比大面积 blur 滤镜，这种画法
 * 只依赖径向渐变的 alpha 衰减，GPU 成本低、无重排。
 *
 * 细节：
 *  - 按设备像素比渲染，最多 2x，避免 4K 屏浪费
 *  - 页面不可见时暂停；prefers-reduced-motion 下只画一帧静态图
 *  - 光斑数量与主题联动（暗色更亮、亮色更淡）
 */

const PALETTE_LIGHT = [
  [79, 107, 242], // brand indigo
  [20, 184, 166], // teal
  [56, 189, 248], // sky
  [124, 92, 255], // violet
]

const PALETTE_DARK = [
  [92, 122, 255],
  [24, 200, 178],
  [64, 160, 255],
  [140, 110, 255],
]

function makeBlobs(colors, w, h) {
  return colors.map((c, i) => ({
    c,
    x: Math.random() * w,
    y: Math.random() * h,
    r: (0.28 + Math.random() * 0.26) * Math.max(w, h),
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    phase: (i / colors.length) * Math.PI * 2,
  }))
}

export default function Aurora() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let blobs = []
    let w = 0
    let h = 0
    let dpr = 1
    let last = 0

    const readTheme = () =>
      document.documentElement.dataset.theme === 'dark' ? PALETTE_DARK : PALETTE_LIGHT

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      blobs = makeBlobs(readTheme(), w, h)
    }

    const paint = (t) => {
      const dark = document.documentElement.dataset.theme === 'dark'
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      const strength = dark ? 0.5 : 0.3

      for (const b of blobs) {
        const drift = t * 0.00006
        const x = b.x + Math.sin(drift + b.phase) * w * 0.09
        const y = b.y + Math.cos(drift * 1.3 + b.phase) * h * 0.09
        const r = b.r * (1 + Math.sin(drift * 2 + b.phase) * 0.08)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        const [rr, gg, bb] = b.c
        g.addColorStop(0, `rgba(${rr},${gg},${bb},${strength})`)
        g.addColorStop(0.45, `rgba(${rr},${gg},${bb},${strength * 0.28})`)
        g.addColorStop(1, `rgba(${rr},${gg},${bb},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      // 约 30fps，肉眼足够顺滑，功耗减半
      if (now - last < 33) return
      last = now
      paint(now)
    }

    const start = () => {
      if (raf || reduce) return
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    resize()
    paint(0)
    start()

    const onVisibility = () => (document.hidden ? stop() : start())
    const onResize = () => {
      resize()
      paint(performance.now())
    }
    // 主题切换时重建调色板
    const themeObserver = new MutationObserver(() => {
      blobs = makeBlobs(readTheme(), w, h)
      paint(performance.now())
    })

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      stop()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={ref} className="fx-aurora" aria-hidden="true" />
}
