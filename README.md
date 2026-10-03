# 英语学习网 🎓

基于 React + Vite 的英语学习网站，覆盖「背单词」与「写作提分」两条主线。

## 功能

### 背单词
- **📚 单词卡片** — 分级词库（基础/进阶/高阶）+ 六级词库，3D 翻转查看释义与例句，标记「认识 / 不认识」
- **📝 单词测验** — 每日 10 道四选一选择题，自动计分、显示正确率与解析
- **⭐ 生词本** — 收藏不熟的单词，按间隔重复算法自动排复习（`utils/review.js`）

### 写作提升
- **💬 短语学习** — 按主题积累地道表达
- **✨ 高分句型** — **65 个**四六级 / 考研作文句式，见下文
- **📖 翻译练习** — 历年真题 + 热点预测，附难点拆解与降级表达

### 其他
- **📅 每日一句** — **40 条**名言，可「换一句」逐条浏览，优先收录含高级句式（倒装 / 虚拟 / 强调 / 分词）的句子
- 明暗双主题、账号云端同步、朗读发音、键盘操作

## 高分句型库

`src/data/patterns.js` 是索引，实际内容按写作功能拆到 `src/data/pattern-bank/` 下的 12 个文件，
每个句型除骨架与释义外，还包含 **使用场景 / 例句 / 同义替换 / 易错点**，以及
**「平庸写法 → 高分写法」对照**。

筛选用三个互相独立的维度，可以叠加：

| 维度 | 取值 |
|------|------|
| 难度档次 | `core` 稳妥提分（21）· `advanced` 高级（30）· `expert` 很高级（14） |
| 句式类型 | 倒装 / 虚拟语气 / 强调句 / 分词状语 / 独立主格 / 无灵主语 / 比较结构 / 否定结构 / 名词性从句 / 修辞 / 基础句式 |
| 写作功能 | 开篇引入 / 观点态度 / 论证说理 / 举例说明 / 对比转折 / 因果影响 / 让步反驳 / 建议措施 / 结尾总结 / 数据图表 / 书信应用 / 升华修辞 |

覆盖「很高级」档的 14 个结构（倒装、虚拟、强调、独立主格等）是提分主力，例如：

```text
So prevalent has + 名词 + become that + 从句         （完全倒装）
Were it not for + 名词, + 主语 + would + 动词       （虚拟条件倒装）
It is + 被强调部分 + that + 句子其余部分            （强调句）
Other things being equal, + 主句                    （独立主格）
Coupled with + 名词, + 主句                         （分词状语）
```

## 设计系统

见 `src/index.css` 顶部的注释。核心是 **Paper & Ink（纸与墨）**：

- 暖白纸感底色 + 极淡噪点，不用纯白，也不铺彩色光晕
- 墨蓝主色 + 铜棕强调色（冷暖对位），语义色只用于状态
- 圆角收紧到 4–14px，胶囊只留给标签
- 只保留两层极淡中性阴影，去掉彩色 glow 与大面模糊
- `Newsreader` 衬线做展示标题与英文例句，正文用无衬线
- 分区优先用 1px 细线，而不是靠卡片阴影堆叠

所有正文配色都按 WCAG AA 校验过（浅色 / 深色 × 全部 7 个页面，0 处不达标）。

## 运行

```bash
npm install
npm run dev        # http://localhost:5173

npm run server:install   # 后端（可选）
npm run server:seed
npm run server
```

后端不可用时前端会自动降级到本地静态词库，功能不受影响。

## 项目结构

```
├── index.html
├── package.json
├── vite.config.js
├── vercel.json               # /api/* 转发到 Render 后端
└── src/
    ├── main.jsx
    ├── App.jsx               # 根组件（Tab 切换 + 云端同步 + 生词本状态）
    ├── index.css             # 全局样式与设计系统
    ├── api.js
    ├── data/
    │   ├── patterns.js       # 句型库索引（分类 / 档次 / 句式类型 / 统计）
    │   ├── pattern-bank/     # 句型正文，按写作功能拆 12 个文件
    │   ├── sentences.js      # 每日一句语料库
    │   ├── translations.js   # 翻译题库
    │   └── words.js          # 本地兜底词库
    ├── hooks/                # useWords / useTheme / useScrollProgress …
    ├── utils/                # storage / review（间隔重复）/ speak / toast
    └── components/
        ├── Navbar.jsx
        ├── DailySentence.jsx     # 首页
        ├── Flashcards.jsx        # 单词卡片
        ├── Quiz.jsx              # 单词测验
        ├── WordBook.jsx          # 生词本
        ├── Phrases.jsx           # 短语学习
        ├── SentencePatterns.jsx  # 高分句型
        └── Translation.jsx       # 翻译练习
```

## 扩展内容

**加句型**：在 `src/data/pattern-bank/` 对应分类文件里追加一条（不要写 `id`，索引会自动编号）：

```js
{
  cat: 'argue',            // 写作功能，见 CATEGORIES
  tier: 'expert',          // core | advanced | expert
  form: 'inversion',       // 句式类型，见 FORMS
  levels: ['cet6', 'kaoyan'],
  structure: 'Only by + 动名词 + can we + 动词原形',
  cn: '只有通过……，我们才能……',
  usage: '这个句型什么时候用……',
  when: ['场景一', '场景二'],
  examples: [{ en: '...', cn: '...', note: '...' }],
  variants: ['Only through ... can we ...'],
  pitfall: 'Only 修饰状语置于句首才倒装……',
  upgrade: { from: '平庸写法', to: '高分写法' },
}
```

**加每日一句**：编辑 `src/data/sentences.js`，并同步 `server/words-data.js` 的
`sentencesData`（保持两端一致）。

**加单词**：编辑 `src/data/words.js`：

```js
{ id: 31, word: 'example', phonetic: '/ɪɡˈzɑːmpl/', meaning: 'n. 例子', level: 1,
  example: 'This is an example.', exampleCn: '这是一个例子。' }
```
