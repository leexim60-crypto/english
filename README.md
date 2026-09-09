# 英语学习网 🎓

基于 React + Vite 的英语学习网站。

## 功能

- **📚 单词卡片** — 30 个分级单词（基础/进阶/高阶），点击卡片 3D 翻转查看释义和例句，标记"认识/不认识"记录学习进度
- **📅 每日一句** — 按日期自动更换英文名言，附中文翻译
- **📝 单词测验** — 每天 10 道四选一选择题，自动计分、显示正确率和解析
- **⭐ 生词本** — 收藏不熟的单词（含释义与例句），数据保存在浏览器 localStorage

## 运行

```bash
npm install
npm run dev
```

然后打开浏览器访问 http://localhost:5173

## 项目结构

```
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # 入口
    ├── App.jsx             # 根组件（Tab 切换 + 生词本状态）
    ├── index.css           # 全局样式
    ├── data/
    │   └── words.js        # 单词库 & 每日一句数据
    └── components/
        ├── Navbar.jsx      # 顶部导航
        ├── DailySentence.jsx  # 首页（每日一句 + 学习统计）
        ├── Flashcards.jsx  # 单词卡片学习
        ├── Quiz.jsx        # 单词测验
        └── WordBook.jsx    # 生词本
```

## 扩展单词库

编辑 `src/data/words.js`，按以下格式添加即可：

```js
{ id: 31, word: 'example', phonetic: '/ɪɡˈzɑːmpl/', meaning: 'n. 例子', level: 1,
  example: 'This is an example.', exampleCn: '这是一个例子。' }
```
