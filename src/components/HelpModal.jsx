import { useEffect, useRef } from 'react'

/**
 * 使用手册弹窗（中等尺寸模态框）。
 * 点击遮罩 / 右上角 ✕ / 按 Esc 均可关闭。
 */
export default function HelpModal({ open, onClose }) {
  const closeRef = useRef(null)

  // Esc 关闭；打开时把焦点放到关闭按钮上，方便键盘操作
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    // 打开时禁止背景滚动
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-label="使用手册"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>📖 使用手册</h2>
          <button
            ref={closeRef}
            className="modal-close"
            onClick={onClose}
            aria-label="关闭"
            title="关闭（Esc）"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <section>
            <h3>📚 单词卡片</h3>
            <ul>
              <li>点击卡片（或按<b>空格键</b>）翻面查看释义和例句。</li>
              <li><b>😀 认识</b>：记入已掌握，复习间隔自动翻倍。</li>
              <li>
                <b>😕 不认识</b>：自动加入生词本，<b>卡片立即翻面展示汉译释义</b>，
                看完再点「下一个」继续。
              </li>
              <li>卡片正面点 <b>☆</b> 收藏同样会立即翻面展示释义；点 <b>🔊</b> 播放发音。</li>
              <li>支持两本词书：<b>精选词库</b>（按 基础/进阶/高阶 分级）和 <b>六级词库</b>（后端随机出卡流）。</li>
            </ul>
          </section>

          <section>
            <h3>⌨️ 键盘快捷键</h3>
            <div className="kbd-table">
              <div><kbd>空格</kbd><span>卡片翻面</span></div>
              <div><kbd>←</kbd> <kbd>→</kbd><span>上一个 / 下一个单词</span></div>
              <div><kbd>↑</kbd><span>标记「认识」</span></div>
              <div><kbd>↓</kbd><span>标记「不认识」</span></div>
              <div><kbd>1</kbd> – <kbd>4</kbd><span>测验中选择答案</span></div>
              <div><kbd>Enter</kbd><span>测验中进入下一题</span></div>
              <div><kbd>Esc</kbd><span>关闭本弹窗</span></div>
            </div>
          </section>

          <section>
            <h3>📝 单词测验</h3>
            <ul>
              <li>看英文选中文释义，共 10 题；精选词库每天题目固定，六级词库每次随机。</li>
              <li>答错或点 <b>☆</b> 收藏的单词会自动进入生词本，并<b>立即展示汉译释义</b>和例句。</li>
              <li>提交成绩后可看到今日所有用户的挑战人次、最高分和平均分。</li>
            </ul>
          </section>

          <section>
            <h3>⭐ 生词本 & 🔁 间隔复习</h3>
            <ul>
              <li>所有「不认识」的单词都会自动收集到生词本，也可手动点 ☆ 收藏。</li>
              <li>
                生词本采用<b>间隔重复（SRS）</b>调度：复习时点「认识」间隔翻倍
                （1 → 2 → 4 → … 天），点「不认识」重置为待复习。
              </li>
              <li>生词本顶部显示「今日待复习」数量，点击「开始复习」进入翻卡复习流。</li>
              <li>支持<b>搜索</b>、按词书（精选/六级）<b>筛选</b>，以及一键 <b>📤 导出</b>为 txt 文件。</li>
            </ul>
          </section>

          <section>
            <h3>🔐 账号登录</h3>
            <ul>
              <li>点导航栏「🔐 登录」可注册/登录，用户名 2-16 位，密码至少 6 位。</li>
              <li>登录后生词本、学习记录、复习进度、打卡等数据<b>云端同步</b>，换设备不丢。</li>
              <li>登录一次后 <b>30 天免登录</b>；退出登录不会删除云端数据，下次登录自动找回。</li>
              <li>不登录也可正常使用全部功能，数据仅保存在本浏览器。</li>
            </ul>
          </section>

          <section>
            <h3>🏠 首页 & 其他</h3>
            <ul>
              <li>首页展示词汇量、已学习/待学习、<b>连续打卡天数</b>和待复习提醒。</li>
              <li>导航栏 <b>🌙 暗色</b> 按钮可切换暗色模式，偏好会被记住。</li>
              <li>
                导航栏 <b>● 在线 / ○ 离线</b> 徽章表示后端状态：离线时自动使用本地精选词库，
                六级词库和在线统计需要后端在线（server 目录 <code>npm start</code>）。
              </li>
              <li>单词、短语、每日一句均可点 <b>🔊</b> 朗读（真人词典发音为主，不支持时自动切合成语音）。</li>
            </ul>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            开始学习 →
          </button>
        </div>
      </div>
    </div>
  )
}
