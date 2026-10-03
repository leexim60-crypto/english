/**
 * 高分写作句型库 · 索引
 * ---------------------------------------------------------------
 * 收录标准：只留"阅卷老师会加分"的句式，并且每个都必须讲清三件事——
 *   ① 什么时候用（usage / when）
 *   ② 怎么换着用（variants）
 *   ③ 容易错在哪（pitfall）
 * 另外附「平庸写法 → 高分写法」对照（upgrade），直接看出差距在哪。
 *
 * 三个筛选维度，各自独立，互不重叠：
 *   cat    写作功能   开篇 / 论证 / 让步 / 结尾 …（在文章的哪个位置用）
 *   tier   难度档次   core 稳妥提分 / advanced 高级 / expert 很高级
 *   form   句式类型   倒装 / 虚拟 / 强调 / 分词 / 独立主格 …（用的是什么结构）
 *
 * 数据按功能拆分为 12 个文件，放在 ./pattern-bank/ 下，便于单独维护。
 */

import opening from './pattern-bank/opening.js'
import view from './pattern-bank/view.js'
import argue from './pattern-bank/argue.js'
import example from './pattern-bank/example.js'
import contrast from './pattern-bank/contrast.js'
import cause from './pattern-bank/cause.js'
import concession from './pattern-bank/concession.js'
import suggest from './pattern-bank/suggest.js'
import conclusion from './pattern-bank/conclusion.js'
import data from './pattern-bank/data.js'
import letter from './pattern-bank/letter.js'
import rhetoric from './pattern-bank/rhetoric.js'

/** 写作功能分类 */
export const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'opening', label: '开篇引入' },
  { key: 'view', label: '观点态度' },
  { key: 'argue', label: '论证说理' },
  { key: 'example', label: '举例说明' },
  { key: 'contrast', label: '对比转折' },
  { key: 'cause', label: '因果影响' },
  { key: 'concession', label: '让步反驳' },
  { key: 'suggest', label: '建议措施' },
  { key: 'conclusion', label: '结尾总结' },
  { key: 'data', label: '数据图表' },
  { key: 'letter', label: '书信应用' },
  { key: 'rhetoric', label: '升华修辞' },
]

/** 适用考试 */
export const LEVELS = [
  { key: 'all', label: '全部' },
  { key: 'cet4', label: '四级' },
  { key: 'cet6', label: '六级' },
  { key: 'kaoyan', label: '考研' },
]

export const LEVEL_NAMES = { cet4: '四级', cet6: '六级', kaoyan: '考研' }

/**
 * 难度档次
 * core     稳妥提分 —— 结构简单、几乎不会写错，先保证不丢分
 * advanced 高级     —— 从句 / 分词 / 无灵主语，把语言档次拉开
 * expert   很高级   —— 倒装 / 虚拟 / 强调 / 独立主格，冲刺满分句
 */
export const TIERS = [
  { key: 'all', label: '全部', short: '全部' },
  { key: 'core', label: '稳妥提分', short: '稳妥', desc: '结构简单、不易出错，先把分拿稳' },
  { key: 'advanced', label: '高级', short: '高级', desc: '从句、分词、无灵主语，明显拉开档次' },
  { key: 'expert', label: '很高级', short: '很高级', desc: '倒装、虚拟、强调、独立主格，满分句' },
]

export const TIER_NAMES = { core: '稳妥提分', advanced: '高级', expert: '很高级' }

/** 句式类型（结构层面） */
export const FORMS = {
  basic: '基础句式',
  nominal: '无灵主语',
  clause: '名词性从句',
  inversion: '倒装',
  cleft: '强调句',
  subjunctive: '虚拟语气',
  participle: '分词状语',
  absolute: '独立主格',
  comparative: '比较结构',
  negation: '否定结构',
  rhetorical: '修辞',
}

export const FORM_ORDER = [
  'basic',
  'clause',
  'nominal',
  'comparative',
  'negation',
  'cleft',
  'participle',
  'absolute',
  'inversion',
  'subjunctive',
  'rhetorical',
]

/** 汇总并统一编号（各分文件不写 id，避免手工维护时冲突） */
const bank = [
  ...opening,
  ...view,
  ...argue,
  ...example,
  ...contrast,
  ...cause,
  ...concession,
  ...suggest,
  ...conclusion,
  ...data,
  ...letter,
  ...rhetoric,
]

export const patterns = bank.map((p, i) => ({ ...p, id: i + 1 }))

/** 统计：用于页面头部展示与文案（不写死数字） */
export const PATTERN_STATS = {
  total: patterns.length,
  expert: patterns.filter((p) => p.tier === 'expert').length,
  advanced: patterns.filter((p) => p.tier === 'advanced').length,
  core: patterns.filter((p) => p.tier === 'core').length,
  byCat: patterns.reduce((acc, p) => {
    acc[p.cat] = (acc[p.cat] || 0) + 1
    return acc
  }, {}),
}
