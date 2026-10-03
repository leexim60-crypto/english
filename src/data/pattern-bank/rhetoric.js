/**
 * 升华修辞 · 5 句
 * 功能：用修辞手法给文章提气——排比、比喻、反问、对偶、引用。
 * 这部分句子不负责"讲道理"，负责让阅卷老师记住你。建议全文只用一处，用多了会显浮夸。
 */
export default [
  {
    cat: 'rhetoric',
    tier: 'advanced',
    form: 'rhetorical',
    levels: ['cet6', 'kaoyan'],
    structure: 'It is not merely A; it is B. It is not merely C; it is D.',
    cn: '它不仅是 A，更是 B；不仅是 C，更是 D。',
    usage:
      '排比结构，用两个平行句式层层加码，把"意义"不断向上推。放在结尾段升华主题效果最好，因为排比天然带有总结与抒情的双重功能。',
    when: ['结尾段升华主题', '强调某事物的多重价值', '需要节奏感与气势时'],
    examples: [
      {
        en: 'Reading is not merely a way to pass examinations; it is a way to live more fully. It is not merely a skill to be mastered; it is a habit that shapes who we become.',
        cn: '阅读不仅是通过考试的手段，更是更充分地生活的方式；不仅是一项要掌握的技能，更是塑造我们成为何人的习惯。',
        note: '两个平行句式构成排比，not merely ... but / it is ... 结构对称。',
      },
      {
        en: 'Education is not merely the transmission of facts; it is the cultivation of judgment. It is not merely preparation for a career; it is preparation for a life.',
        cn: '教育不仅是知识的传递，更是判断力的培养；不仅是为职业做准备，更是为人生做准备。',
        note: '末句用 career / life 押近韵，读起来更响。',
      },
    ],
    variants: [
      'It is not only ... but also ... ; it is not only ... but also ...',
      'X is less about A and more about B; less about C and more about D.',
      'X does not simply ... ; it ...',
    ],
    pitfall:
      '排比要求结构严格对称：前后分句的词性和句式必须一致，否则"排比"会变成"病句堆砌"，反而扣分。',
    upgrade: {
      from: 'Reading is important. It helps us learn and live better.',
      to: 'Reading is not merely a way to pass examinations; it is a way to live more fully.',
    },
  },

  {
    cat: 'rhetoric',
    tier: 'advanced',
    form: 'rhetorical',
    levels: ['cet6', 'kaoyan'],
    structure: 'X is to Y what A is to B',
    cn: 'X 之于 Y，正如 A 之于 B。',
    usage:
      '比喻句式，用熟悉的类比解释陌生关系，一句话把抽象道理说得形象。适合阐释概念、说明某事物的基础性作用。',
    when: ['阐释抽象概念', '强调某事物的基础作用', '需要形象化表达时'],
    examples: [
      {
        en: 'Critical thinking is to information what a filter is to water: without it, what we take in may do more harm than good.',
        cn: '批判性思维之于信息，正如滤网之于水：没有它，我们摄入的东西可能弊大于利。',
        note: '冒号后补充说明类比的含义，句子层次更清楚。',
      },
      {
        en: 'Curiosity is to learning what a compass is to a voyage: it does not shorten the journey, but it keeps us from losing our way.',
        cn: '好奇心之于学习，正如罗盘之于航行：它不缩短旅程，却让我们不至迷失方向。',
        note: '适合教育与成长类话题。',
      },
    ],
    variants: [
      'X is like Y in that ...',
      'Just as ... , so ...',
      'X serves as Y for ...',
    ],
    pitfall:
      'X is to Y what A is to B 是固定对应结构，四个成分的位置不能乱；若改用 Just as ... so ...，则两句都须为完整句子。',
    upgrade: {
      from: 'Critical thinking is very important for dealing with information.',
      to: 'Critical thinking is to information what a filter is to water: without it, what we take in may do more harm than good.',
    },
  },

  {
    cat: 'rhetoric',
    tier: 'advanced',
    form: 'rhetorical',
    levels: ['cet6', 'kaoyan'],
    structure: 'Is it not time that we asked ourselves + 疑问内容 ?',
    cn: '难道不该问问我们自己……吗？',
    usage:
      '反问句，用疑问形式表达强烈肯定，比陈述句更有冲击力。适合在结尾段或转折处制造停顿，让阅卷老师眼前一亮。',
    when: ['结尾段引发思考', '转折处制造停顿', '需要加强语气时'],
    examples: [
      {
        en: 'Is it not time that we asked ourselves what kind of world we are leaving to our children?',
        cn: '难道不该问问我们自己，我们要给子孙留下一个怎样的世界吗？',
        note: 'it is time that 从句用过去式 asked，属虚拟语气。',
      },
      {
        en: 'Is it not time that we stopped measuring success solely by material wealth?',
        cn: '难道不该停止只用物质财富衡量成功了吗？',
        note: 'solely 加强"仅仅"，使反问更有针对性。',
      },
    ],
    variants: [
      'Should we not pause and ask ... ?',
      'What could be more important than ... ?',
      'How can we claim to ... when ... ?',
    ],
    pitfall:
      '反问句末尾必须用问号，且整句逻辑上应指向一个明确立场；不要写成既不像问句也不像陈述句的"半截句"。',
    upgrade: {
      from: 'We should think about the world we leave to children.',
      to: 'Is it not time that we asked ourselves what kind of world we are leaving to our children?',
    },
  },

  {
    cat: 'rhetoric',
    tier: 'expert',
    form: 'rhetorical',
    levels: ['kaoyan'],
    structure: 'The more + 从句, the more + 从句',
    cn: '越……，就越……',
    usage:
      '比较级叠加结构，把两个趋势绑定成一条规律，逻辑感极强。适合揭示某种"正相关"关系，或在结尾点出核心主张。',
    when: ['揭示正相关规律', '结尾点出核心主张', '需要一句"金句"时'],
    examples: [
      {
        en: 'The more we rely on algorithms to make choices for us, the less capable we become of making them ourselves.',
        cn: '我们越依赖算法替我们做选择，我们自己做选择的能力就越弱。',
        note: 'the + 比较级置于句首，两个分句均用陈述语序。',
      },
      {
        en: 'The more we understand where others come from, the less inclined we are to judge them.',
        cn: '我们越理解他人的来处，就越不愿轻易评判他们。',
        note: 'be inclined to do 意为"倾向于做"。',
      },
    ],
    variants: [
      'The more ... , the better ...',
      'The harder we try, the more likely we are to ...',
      'As X increases, Y decreases accordingly.',
    ],
    pitfall:
      'the 是副词而非冠词，不能省略；两个分句都须用陈述语序，不要因为句子像"条件句"就倒装。',
    upgrade: {
      from: 'If we use algorithms too much, we cannot choose.',
      to: 'The more we rely on algorithms to make choices for us, the less capable we become of making them ourselves.',
    },
  },

  {
    cat: 'rhetoric',
    tier: 'expert',
    form: 'rhetorical',
    levels: ['cet6', 'kaoyan'],
    structure: 'As an old saying goes, "..." — a truth that + 从句',
    cn: '正如一句老话所说："……"——一个……的真理。',
    usage:
      '引用谚语后立刻用同位语从句点明它与论点的关系，避免"引了却不用"的空转。引语与阐释各占一半，是阅卷老师最认可的名言用法。',
    when: ['引用谚语或名言', '首段引入或结尾升华', '需要权威感支撑观点'],
    examples: [
      {
        en: 'As an old saying goes, "Rome was not built in a day" — a truth that reminds us why patience matters more than speed.',
        cn: '正如老话所说："罗马不是一天建成的"——这条真理提醒我们，为什么耐心比速度更重要。',
        note: '破折号后接同位语，直接说明引语与论点的关联。',
      },
      {
        en: 'As an old saying goes, "A journey of a thousand miles begins with a single step" — a truth that captures the essence of lifelong learning.',
        cn: '正如老话所说："千里之行，始于足下"——这句话道出了终身学习的本质。',
        note: 'capture the essence of 意为"抓住……的本质"。',
      },
    ],
    variants: [
      'As the saying goes, ... , which reminds us that ...',
      'There is wisdom in the proverb that ...',
      'A well-known proverb tells us that ... , a lesson that ...',
    ],
    pitfall:
      '引语后必须有解释，否则会被判"套用名言凑字数"；引号内的内容要原样引用，不要自行改写谚语。',
    upgrade: {
      from: 'Rome was not built in a day. So we need patience.',
      to: 'As an old saying goes, "Rome was not built in a day" — a truth that reminds us why patience matters more than speed.',
    },
  },
]
