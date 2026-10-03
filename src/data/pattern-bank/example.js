/**
 * 举例说明 · 5 句
 * 功能：把抽象论点落到具体事例上。
 */
export default [
  {
    cat: 'example',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'A case in point is + 名词/从句',
    cn: '一个恰当的例子是……',
    usage:
      '在提出论点后紧接着举例佐证。比 "For example" 更书面，且能自然引出具体事例，是四六级作文中最常用的举例句型。',
    when: ['论点后补充具体例证', '需要替换 for example 时', '举例段落开头'],
    examples: [
      {
        en: 'A case in point is the widespread use of mobile payment, which has made shopping far more convenient.',
        cn: '一个恰当的例子是移动支付的广泛使用，它让购物方便了许多。',
        note: 'which 引导非限制性定语从句补充说明。',
      },
      {
        en: 'A case in point is Yuan Longping, whose hybrid rice has fed millions of people.',
        cn: '袁隆平就是一个恰当的例子，他的杂交水稻养活了无数人。',
        note: 'whose 引导定语从句表所属关系。',
      },
    ],
    variants: [
      'A good illustration of this is ...',
      'This is well illustrated by ...',
      'Take ... as an example.',
      'History abounds with examples of ...',
    ],
    pitfall:
      'in point 是固定搭配，不能写成 "a case in the point"；同一句中不要重复使用两个举例表达。',
    upgrade: {
      from: 'For example, mobile payment is very common.',
      to: 'A case in point is the widespread use of mobile payment, which has made shopping far more convenient.',
    },
  },

  {
    cat: 'example',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6'],
    structure: 'Take + 名词 + for example, ...',
    cn: '以……为例，……',
    usage:
      '最灵活的举例句型，可插入句首或句中。适合需要快速举出日常例子（手机、外卖、网课）的段落。',
    when: ['日常现象类举例', '需要具体化抽象论点', '篇幅紧张时快速举例'],
    examples: [
      {
        en: 'Take food delivery apps for example; they have freed countless office workers from cooking.',
        cn: '以外卖应用为例，它们让无数上班族从做饭中解放出来。',
        note: '两个独立句之间用分号，避免逗号连接句。',
      },
      {
        en: 'Take shared bikes for example; they offer a low-carbon way to travel short distances.',
        cn: '以共享单车为例，它们为短途出行提供了低碳方式。',
        note: '适合环保与生活方式类话题。',
      },
    ],
    variants: [
      'Consider ... , for instance.',
      'Let us take ... as an illustration.',
      '... serves as a telling example.',
    ],
    pitfall:
      '两个完整句子之间不能只用逗号连接（逗号粘连错误）；用分号、句号或 and 连接。',
    upgrade: {
      from: 'Food delivery apps are an example. They save time.',
      to: 'Take food delivery apps for example; they have freed countless office workers from cooking.',
    },
  },

  {
    cat: 'example',
    tier: 'advanced',
    form: 'clause',
    levels: ['cet6', 'kaoyan'],
    structure: 'This is best illustrated by + 名词, which + 从句',
    cn: '……最好地说明了这一点，它……',
    usage:
      '被动语态把"例子"放在句末作为信息焦点，同时用非限制性定语从句补充说明，一句完成"提出例子 + 解释意义"两件事。',
    when: ['需要例子自带解释时', '举例段的核心句', '替代简单的 For instance'],
    examples: [
      {
        en: 'This is best illustrated by the rise of online education, which has brought quality resources to remote areas.',
        cn: '在线教育的兴起最好地说明了这一点，它把优质资源带到了偏远地区。',
        note: 'which 指代前面整件事，非限制性定语从句前须加逗号。',
      },
      {
        en: 'This is best illustrated by Finland\u2019s education system, which emphasizes equity over competition.',
        cn: '芬兰的教育体系最好地说明了这一点，它强调公平而非竞争。',
        note: '可用于教育制度类话题。',
      },
    ],
    variants: [
      'This point is best demonstrated by ...',
      'Nothing illustrates this better than ...',
      'A telling example of this is ...',
    ],
    pitfall:
      '非限制性定语从句只能用 which，不能用 that；which 前必须有逗号。',
    upgrade: {
      from: 'Online education is a good example. It helps remote areas.',
      to: 'This is best illustrated by the rise of online education, which has brought quality resources to remote areas.',
    },
  },

  {
    cat: 'example',
    tier: 'advanced',
    form: 'participle',
    levels: ['cet6', 'kaoyan'],
    structure: 'Witnessing + 名词, one cannot help + 动名词',
    cn: '目睹……，人们不禁……',
    usage:
      '现在分词短语作状语交代情境，主句用 cannot help doing 表达不由自主的反应。画面感和情感张力兼备，适合现象评述类作文举例。',
    when: ['描写社会现象带来的冲击', '需要情感共鸣时', '举例段营造画面感'],
    examples: [
      {
        en: 'Witnessing the rapid disappearance of traditional crafts, one cannot help wondering what we are losing.',
        cn: '目睹传统手工艺迅速消失，人们不禁要问：我们正在失去什么？',
        note: 'cannot help doing 意为"不禁做某事"。',
      },
      {
        en: 'Witnessing how easily information spreads online, one cannot help reflecting on the value of truth.',
        cn: '目睹信息在网上传播之易，人们不禁反思真相的价值。',
        note: '适合信息时代、媒体素养类话题。',
      },
    ],
    variants: [
      'Seeing ..., one cannot help but ...',
      'Faced with ..., one is compelled to ...',
      'It is hard not to ... when witnessing ...',
    ],
    pitfall:
      'cannot help 后必须接动名词，不能接动词原形；分词短语的逻辑主语必须与主句主语一致（都是 one）。',
    upgrade: {
      from: 'Traditional crafts are disappearing. We should think about it.',
      to: 'Witnessing the rapid disappearance of traditional crafts, one cannot help wondering what we are losing.',
    },
  },

  {
    cat: 'example',
    tier: 'expert',
    form: 'absolute',
    levels: ['kaoyan'],
    structure: 'With + 名词 + 分词/形容词, + 主句',
    cn: '随着／由于……，……',
    usage:
      'with 复合结构作状语，一句话交代背景条件，主句陈述结果，逻辑关系清晰且结构紧凑。比 "Because ..." 更简练，是高分作文中高频出现的"很高级"结构。',
    when: ['交代背景条件后陈述结果', '压缩两个句子为一个', '需要句子节奏变化时'],
    examples: [
      {
        en: 'With artificial intelligence permeating every sector, the demand for digital literacy has never been greater.',
        cn: '随着人工智能渗透到各行各业，对数字素养的需求前所未有地高。',
        note: 'With + 名词 + 现在分词，表示主动进行。',
      },
      {
        en: 'With traditional values increasingly marginalized, many young people are turning back to their cultural roots.',
        cn: '随着传统价值观日益边缘化，许多年轻人正重新回归自己的文化根脉。',
        note: 'With + 名词 + 过去分词，表示被动。',
      },
    ],
    variants: [
      'With + 名词 + 现在分词/过去分词',
      'With + 名词 + 形容词/介词短语',
      'As ... , ... （普通状语从句，作为保底写法）',
    ],
    pitfall:
      'with 后名词与分词之间是主谓或动宾关系：主动用 -ing，被动用 -ed。写成 "With AI permeates every sector" 即错。',
    upgrade: {
      from: 'AI is in every industry, so digital literacy is needed more than ever.',
      to: 'With artificial intelligence permeating every sector, the demand for digital literacy has never been greater.',
    },
  },
]
