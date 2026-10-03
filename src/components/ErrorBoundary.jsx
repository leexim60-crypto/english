import { Component } from 'react'

/**
 * 错误边界
 * ---------------------------------------------------------------
 * 为什么需要：React 在渲染期抛错时会卸载整棵组件树，页面直接变全白，
 * 用户看不到任何提示、也没法自己恢复。之前「高分句型 / 翻译练习 白屏」
 * 就是这么发生的——某个组件读到类型不符的本地数据后抛了 TypeError。
 *
 * 这里把崩溃范围限制在出错的那个页面内：显示可读的提示 + 两个恢复入口
 * （重试渲染 / 清空本地学习数据），导航栏和其它页面照常可用。
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // 保留在控制台，便于排查；生产环境可在此接入上报
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  /** 只重试渲染：适用于偶发/脏数据已被读取层修正的情况 */
  handleRetry = () => this.setState({ error: null })

  /**
   * 清空本地学习数据后重试。
   * 明确告知用户会丢什么，并保留登录态（auth）——否则等于顺带把人踢下线。
   */
  handleReset = () => {
    try {
      const keys = [
        'favorites',
        'learnedWords',
        'learnedPhrases',
        'wordReviewMeta',
        'studyLog',
        'masteredPatterns',
        'translationDrafts',
        'translationDone',
        'wordsCache',
      ]
      for (const k of keys) localStorage.removeItem(k)
      // 账号隔离空间（u<id>: 前缀）一并清理
      const prefixes = new Set()
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const m = /^(u\d+:)/.exec(key || '')
        if (m) prefixes.add(m[1])
      }
      for (const p of prefixes) {
        for (const k of keys) localStorage.removeItem(p + k)
      }
    } catch {
      /* 忽略：清不掉也照样重试渲染 */
    }
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="crash">
        <span className="crash-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3.6 21.4 20H2.6z" />
            <path d="M12 10v4.4M12 17.6h.01" />
          </svg>
        </span>
        <h2 className="crash-title">这个页面加载出错了</h2>
        <p className="crash-desc">
          通常是本地缓存的学习数据格式异常导致的（例如旧版本数据或云端合并结果不一致）。
          可以先点「重试」，仍然不行再清空本地学习数据。
        </p>
        <pre className="crash-detail">{String(error?.message || error)}</pre>
        <div className="crash-actions">
          <button className="btn btn-primary btn-sm" onClick={this.handleRetry}>
            重试
          </button>
          <button className="btn btn-sm" onClick={this.handleReset}>
            清空本地学习数据并重试
          </button>
        </div>
        <p className="crash-note">
          清空只影响本机收藏 / 进度 / 草稿等学习数据，<b>不会退出登录</b>；云端数据会在下次同步时重新拉取。
        </p>
      </div>
    )
  }
}
