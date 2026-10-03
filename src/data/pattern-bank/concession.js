/**
 * 让步反驳 · 5 句
 * 功能：先承认对方合理之处，再转回自己立场。
 * 这是四六级与考研议论文最容易出彩、也最能体现思维层次的部分。
 */
export default [
  {
    cat: 'concession',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'Admittedly, ... Nevertheless, ...',
    cn: '诚然，……然而，……',
    usage:
      '"让步 + 转折"两步走，先给对方一点空间，再把自己的观点立起来。这种写法能让论证显得公允，是高分作文最典型的结构标记。',
    when: ['驳论段开头', '需要体现辩证思维', '评价有争议的做法'],
    examples: [
      {
        en: 'Admittedly, working part-time may take up some study time; nevertheless, it equips students with social skills that textbooks cannot teach.',
        cn: '诚然，兼职可能占用一些学习时间；然而，它能让学生获得课本教不了的社会技能。',
        note: '两个分句用分号连接，转折更紧凑。',
      },
      {
        en: 'Admittedly, stricter regulations may slow down some businesses; nevertheless, they are essential for long-term public safety.',
        cn: '诚然，更严格的监管可能拖慢一些企业；然而，它们对长期公共安全至关重要。',
        note: '适合社会治理类话题。',
      },
    ],
    variants: [
      'Granted, ... But ...',
      'While it is true that ... , ...',
      'There is some truth in the claim that ... , yet ...',
    ],
    pitfall:
      'Admittedly 后接的是"对方的合理之处"，不能直接接自己的观点；Nevertheless 后才是立场，两者顺序不能颠倒。',
    upgrade: {
      from: 'Part-time jobs take time but are useful.',
      to: 'Admittedly, working part-time may take up some study time; nevertheless, it equips students with social skills that textbooks cannot teach.',
    },
  },

  {
    cat: 'concession',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'Despite the fact that + 从句, + 主句',
    cn: '尽管……，……',
    usage:
      '比 "Although" 更正式，且"the fact that"为从句留出充分空间，适合放进信息量较大的让步内容。',
    when: ['让步内容较长时', '正式书面语', '需要强调"事实"语气'],
    examples: [
      {
        en: 'Despite the fact that digital tools are widely available, many students still lack the ability to evaluate information critically.',
        cn: '尽管数字工具已广泛普及，许多学生仍缺乏批判性评估信息的能力。',
        note: 'Despite 是介词，故后面必须跟 the fact that 引导的从句。',
      },
      {
        en: 'Despite the fact that the policy has been in place for years, its effects remain limited.',
        cn: '尽管该政策已实施多年，其效果仍然有限。',
        note: '可用于政策评述类话题。',
      },
    ],
    variants: [
      'Notwithstanding the fact that ... , ...',
      'Although ... , ...',
      'Even though ... , ...',
    ],
    pitfall:
      'despite 是介词，不能直接接从句（× Despite digital tools are available）；必须借助 the fact that。',
    upgrade: {
      from: 'Although digital tools are common, students cannot judge information.',
      to: 'Despite the fact that digital tools are widely available, many students still lack the ability to evaluate information critically.',
    },
  },

  {
    cat: 'concession',
    tier: 'advanced',
    form: 'inversion',
    levels: ['cet6', 'kaoyan'],
    structure: 'However + 形容词/副词 + 主语 + 系动词/助动词, + 主句',
    cn: '无论多么……，……',
    usage:
      'However 引导让步状语从句并倒装（表语或状语提前），把形容词/副词放在最前，让步意味浓，节奏也好。适合反驳"程度论"的片面观点。',
    when: ['承认程度差异但不改变结论', '反驳"多寡决定对错"的论调', '让步段的核心句'],
    examples: [
      {
        en: 'However advanced technology becomes, it can never replace genuine human empathy.',
        cn: '无论技术多么先进，它永远无法取代真正的人类共情。',
        note: 'However + 形容词 advanced 提前，主语 technology 紧随其后。',
      },
      {
        en: 'However persuasive the argument sounds, it rests on a questionable assumption.',
        cn: '无论这个论点听起来多么有说服力，它都建立在一个可疑的假设之上。',
        note: 'rest on 意为"建立在……之上"。',
      },
    ],
    variants: [
      'No matter how ... , ...',
      'Regardless of how ... , ...',
      'Admittedly ... , yet ...',
    ],
    pitfall:
      'however 引导让步从句时不能与 but 连用；however 作副词表"然而"时应单独使用并加逗号，两种用法不要混淆。',
    upgrade: {
      from: 'Technology is advanced but cannot replace empathy.',
      to: 'However advanced technology becomes, it can never replace genuine human empathy.',
    },
  },

  {
    cat: 'concession',
    tier: 'advanced',
    form: 'subjunctive',
    levels: ['cet6', 'kaoyan'],
    structure: 'Even if + 从句（虚拟）, + 主句 + would',
    cn: '即使……，也……',
    usage:
      '用虚拟语气做极端让步：即便把对方的条件全部满足，结论依旧不变。这种"退到底再反驳"的写法逻辑力量极强。',
    when: ['反驳对方的极端假设', '强化结论的必然性', '驳论段收束'],
    examples: [
      {
        en: 'Even if we were to double public spending on education, inequalities would not disappear overnight.',
        cn: '即使我们把教育公共支出翻倍，不平等也不会一夜之间消失。',
        note: 'were to do 表示对未来的假设，主句用 would + 动词原形。',
      },
      {
        en: 'Even if everyone owned a smartphone, the digital divide would still exist in skills rather than devices.',
        cn: '即使人人都有一部智能手机，数字鸿沟仍会存在于技能而非设备上。',
        note: '适合科技与社会类话题。',
      },
    ],
    variants: [
      'Even assuming that ... , ... would still ...',
      'Were we to ... , ... would still ...',
      'Granted that ... , it does not follow that ...',
    ],
    pitfall:
      'Even if 表"即使"（假设，可用虚拟），Even though 表"虽然"（事实，用陈述语气），二者不可互换。',
    upgrade: {
      from: 'Even if we spend more money, inequality stays.',
      to: 'Even if we were to double public spending on education, inequalities would not disappear overnight.',
    },
  },

  {
    cat: 'concession',
    tier: 'expert',
    form: 'negation',
    levels: ['kaoyan'],
    structure: 'It is not that + 从句, but that + 从句',
    cn: '并不是……，而是……',
    usage:
      '用两个 that 从句并列否定与肯定，纠正一个常见的误解后给出真正的原因。句式对称、逻辑锋利，是考研议论文中极亮眼的一笔。',
    when: ['纠正普遍误解', '给出真正的原因', '驳论段点明本质'],
    examples: [
      {
        en: 'It is not that young people are unwilling to work hard, but that the rewards of hard work have become increasingly uncertain.',
        cn: '并不是年轻人不愿努力，而是努力带来的回报变得越来越不确定。',
        note: '两个 that 从句结构对称，前后均须为完整句子。',
      },
      {
        en: 'It is not that tradition is outdated, but that we have forgotten how to interpret it.',
        cn: '并不是传统过时了，而是我们忘了如何去解读它。',
        note: '适合传统文化类话题。',
      },
    ],
    variants: [
      'It is less about A than about B.',
      'The problem is not so much A as B.',
      'What we face is not A but B.',
    ],
    pitfall:
      '两个 that 都是引导表语从句的连接词，不能省略；not that 与 but that 必须成对出现，结构对称。',
    upgrade: {
      from: 'Young people do not want to work hard. Actually the reward is uncertain.',
      to: 'It is not that young people are unwilling to work hard, but that the rewards of hard work have become increasingly uncertain.',
    },
  },
]
