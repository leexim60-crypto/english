/**
 * 单词发音：双通道方案，兼容所有移动端浏览器。
 *
 * 通道 1（主）：有道词典发音 API，返回真人录音 mp3，<audio> 播放
 *              —— 兼容性接近 100%（华为鸿蒙、微信内置浏览器等都支持）
 * 通道 2（兜底）：浏览器原生 SpeechSynthesis
 *              —— 桌面端 Chrome/Edge/Safari 表现良好
 *
 * 策略：优先尝试 audio 播放；音频加载失败（断网/词不在词典里）时回退 TTS。
 * 原生 SpeechSynthesis 保留 iOS 手势解锁等移动端兼容处理。
 */

// ===== 通道 2：原生 SpeechSynthesis（兜底） =====
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
  window.addEventListener('touchend', unlockSpeech)
  window.addEventListener('click', unlockSpeech)
}

function speakTTS(text, rate = 0.9) {
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
    setTimeout(() => {
      try {
        if (window.speechSynthesis.speaking) window.speechSynthesis.resume()
      } catch {
        /* ignore */
      }
    }, 300)
  } catch {
    /* ignore */
  }
}

// ===== 通道 1：词典发音 mp3（主通道） =====
// 有道词典发音接口：https://dict.youdao.com/dictvoice?type=0&audio=word
// type=0 美音 / type=1 英音；真人录音，格式 mp3，免费无鉴权
let currentAudio = null

function speakAudio(text) {
  return new Promise((resolve, reject) => {
    try {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio = null
      }
      const url = `https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(text)}`
      const audio = new Audio(url)
      currentAudio = audio
      // 3 秒内加载失败（网络问题/词不存在）→ 走 TTS 兜底
      const timer = setTimeout(() => {
        audio.src = ''
        reject(new Error('timeout'))
      }, 3000)
      audio.oncanplay = () => clearTimeout(timer)
      audio.onended = () => resolve()
      audio.onerror = () => {
        clearTimeout(timer)
        reject(new Error('audio error'))
      }
      audio.play().catch(reject)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 朗读一个英文单词/短语。
 * 优先词典真人发音，失败时回退浏览器 TTS。
 */
export function speak(text, rate = 0.9) {
  if (!text) return
  speakAudio(text).catch(() => {
    // 音频通道失败（典型场景：词库生僻词、跨域限制、断网）→ TTS 兜底
    speakTTS(text, rate)
  })
}
