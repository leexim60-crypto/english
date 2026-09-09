/**
 * 单词发音：使用浏览器原生 SpeechSynthesis，零依赖零成本。
 */
export function speak(text, rate = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    const voices = window.speechSynthesis.getVoices()
    const v = voices.find((x) => x.lang && x.lang.toLowerCase().startsWith('en'))
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  } catch {
    /* 浏览器不支持时静默失败 */
  }
}
