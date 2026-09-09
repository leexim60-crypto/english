import { useState, useEffect, useRef } from 'react'
import { api } from '../api.js'

/**
 * 登录 / 注册弹窗。
 * - 登录成功后返回 { user, token }，由 App 持久化到 localStorage（30 天免登录）
 * - 未登录用户可点「先逛逛」继续本地模式（数据只存浏览器）
 */
export default function AuthModal({ open, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const userRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setError('')
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    setTimeout(() => userRef.current?.focus(), 50)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)
    try {
      const result =
        mode === 'login'
          ? await api.login(username, password)
          : await api.register(username, password, email)
      onLoginSuccess(result)
      setUsername('')
      setPassword('')
      setEmail('')
      onClose()
    } catch (err) {
      setError(err.message === 'Failed to fetch' || /HTTP/.test(err.message || '')
        ? '服务暂时不可用，请稍后再试'
        : err.message || '操作失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? '登录' : '注册'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{mode === 'login' ? '👋 欢迎回来' : '✨ 创建账号'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>

        <form className="modal-body auth-form" onSubmit={submit}>
          <div className="auth-field">
            <label>用户名</label>
            <input
              ref={userRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="2-16 位，中英文/数字/下划线"
              autoComplete="username"
              required
            />
          </div>

          <div className="auth-field">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? '至少 6 位' : '请输入密码'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="auth-field">
              <label>邮箱（选填，暂用于展示）</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="可用于日后找回密码"
                autoComplete="email"
              />
            </div>
          )}

          {error && <p className="auth-error">⚠️ {error}</p>}

          <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={busy}>
            {busy ? '请稍候…' : mode === 'login' ? '登录' : '注册并登录'}
          </button>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>
                还没有账号？
                <button type="button" onClick={() => { setMode('register'); setError('') }}>
                  去注册
                </button>
              </>
            ) : (
              <>
                已有账号？
                <button type="button" onClick={() => { setMode('login'); setError('') }}>
                  去登录
                </button>
              </>
            )}
          </p>

          <p className="auth-note muted">
            登录后学习记录云端同步，换设备不丢数据；不登录也可以使用，数据仅保存在本浏览器。
          </p>
        </form>
      </div>
    </div>
  )
}
