/**
 * 单词发音：使用浏览器原生 SpeechSynthesis，零依赖零成本。
 *
 * 移动端（尤其 iOS Safari）兼容处理：
 *  1. iOS 要求语音引擎在用户手势中被"解锁"过一次，之后的 speak 才会出声
 *     → 页面加载后监听首次 touchend/click，静默朗读一句空文本完成解锁
 *  2. getVoices() 在移动端是异步加载的，首次调用可能返回空数组
 *     → 用 onvoiceschanged 缓存 voices 列表
 *  3. iOS 偶发引擎卡在 paused 状态 → 朗读后短延时 resume 一次兜底
 */

let voices = []
let unlocked = false

function loadVoices() {
  try {
    voices = window.speechSynthesis.getVoices() || []
  } catch {
    voices = []
  }
}

function unlockSpeech() {
  if (unlocked) return
  unlocked = true
  try {
    // 音量为 0 的空朗读：唯一目的是在用户手势内激活 iOS 的语音引擎
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore */
  }
  window.removeEventListener('touchend', unlockSpeech)
  window.removeEventListener('click', unlockSpeech)
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
  // 任意首次手势（触摸/点击）都尝试解锁语音引擎
  window.addEventListener('touchend', unlockSpeech)
  window.addEventListener('click', unlockSpeech)
}

export function speak(text, rate = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return
  try {
    unlockSpeech()
    window.speechSynthesis.cancel()

    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    u.volume = 1
    const v = voices.find((x) => x.lang && x.lang.toLowerCase().startsWith('en'))
    if (v) u.voice = v
    window.speechSynthesis.speak(u)

    // iOS 兜底：引擎可能卡在 paused，300ms 后仍处于 speaking 就 resume 一下
    setTimeout(() => {
      try {
        if (window.speechSynthesis.speaking) window.speechSynthesis.resume()
      } catch {
        /* ignore */
      }
    }, 300)
  } catch {
    /* 浏览器不支持时静默失败 */
  }
}
