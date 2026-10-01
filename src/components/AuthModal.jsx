import { useState, useEffect, useRef } from 'react'
import { api } from '../api.js'
import Icon from './Icons.jsx'
import Modal from './Modal.jsx'

/**
 * 登录 / 注册弹窗。
 * - 登录成功后返回 { user, token }，由 App 持久化到 localStorage（30 天免登录）
 * - 未登录用户可直接关闭继续本地模式（数据只存浏览器）
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
    setTimeout(() => userRef.current?.focus(), 80)
  }, [open])

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
      setError(
        err.message === 'Failed to fetch' || /HTTP/.test(err.message || '')
          ? '服务暂时不可用，请稍后再试'
          : err.message || '操作失败'
      )
    } finally {
      setBusy(false)
    }
  }

  const switchMode = (next) => {
    setMode(next)
    setError('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="auth-title"
      className="auth-modal"
    >
      <div className="modal-header">
        <h2 id="auth-title">{mode === 'login' ? '欢迎回来' : '创建账号'}</h2>
        <button className="icon-btn" onClick={onClose} aria-label="关闭">
          <Icon name="close" size={17} />
        </button>
      </div>

      <div className="auth-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={mode === 'login'}
          className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`}
          onClick={() => switchMode('login')}
        >
          登录
        </button>
        <button
          role="tab"
          aria-selected={mode === 'register'}
          className={`auth-tab ${mode === 'register' ? 'is-active' : ''}`}
          onClick={() => switchMode('register')}
        >
          注册
        </button>
      </div>

      <form className="modal-body auth-form" onSubmit={submit}>
        <div className="auth-field">
          <label htmlFor="auth-username">用户名</label>
          <input
            id="auth-username"
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
          <label htmlFor="auth-password">密码</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? '至少 6 位' : '请输入密码'}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
        </div>

        {mode === 'register' && (
          <div className="auth-field auth-field-reveal">
            <label htmlFor="auth-email">邮箱（选填）</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="可用于日后找回密码"
              autoComplete="email"
            />
          </div>
        )}

        {error && (
          <p className="auth-error" role="alert">
            <Icon name="close" size={14} />
            {error}
          </p>
        )}

        <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={busy}>
          {busy ? (
            <>
              <span className="spinner" />
              请稍候…
            </>
          ) : (
            <>
              <Icon name={mode === 'login' ? 'login' : 'sparkle'} size={16} />
              {mode === 'login' ? '登录' : '注册并登录'}
            </>
          )}
        </button>

        <p className="auth-note muted">
          <Icon name="cloud" size={13} />
          登录后学习记录云端同步，换设备不丢数据；不登录也可以使用，数据仅保存在本浏览器。
        </p>
      </form>
    </Modal>
  )
}
