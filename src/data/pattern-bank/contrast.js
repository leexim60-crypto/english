/**
 * 对比转折 · 5 句
 * 功能：呈现两面、形成张力、推进辩证。
 */
export default [
  {
    cat: 'contrast',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'While + 从句, + 主句',
    cn: '虽然／然而……，……',
    usage:
      '最稳妥的对比结构。while 放在句首表示"虽然"，放在句中表示"而"，两种用法都能自然呈现对立面，比 but 更适合书面语。',
    when: ['呈现事物的两面', '主体段辩证分析', '需要替换 but 时'],
    examples: [
      {
        en: 'While online learning offers flexibility, it also demands strong self-discipline.',
        cn: '虽然在线学习提供了灵活性，但它也要求很强的自律。',
        note: '句首 while 表让步，主句常用 also 呼应。',
      },
      {
        en: 'Some people regard competition as a driving force, while others see it as a source of anxiety.',
        cn: '有人把竞争视为动力，而另一些人则把它看作焦虑的来源。',
        note: '句中 while 表对比，前后结构应对称。',
      },
    ],
    variants: [
      'Although ... , ...',
      'Whereas ... , ...',
      '... , whereas ...',
    ],
    pitfall:
      'while 引导从句时不能与 but 连用（× While it is useful, but it costs a lot）；while 表对比时前后结构要平行。',
    upgrade: {
      from: 'Online learning is flexible. But it needs self-discipline.',
      to: 'While online learning offers flexibility, it also demands strong self-discipline.',
    },
  },

  {
    cat: 'contrast',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6'],
    structure: 'On the one hand, ... On the other hand, ...',
    cn: '一方面……，另一方面……',
    usage:
      '结构最清晰的双面论述框架，适合"利弊分析"类作文。注意 on the other hand 常暗含转折或对立，不要用来单纯并列两个同向观点。',
    when: ['利弊分析', '双面论述', '需要结构一目了然时'],
    examples: [
      {
        en: 'On the one hand, social media keeps us connected with friends far away; on the other hand, it can quietly consume hours of our day.',
        cn: '一方面，社交媒体让我们与远方的朋友保持联系；另一方面，它也可能悄悄消耗我们一天中的数小时。',
        note: '两个分句用分号连接，体现并列中的对立。',
      },
      {
        en: 'On the one hand, urbanization creates jobs; on the other hand, it puts enormous pressure on public services.',
        cn: '一方面，城镇化创造了就业；另一方面，它给公共服务带来了巨大压力。',
        note: '适合社会发展类话题。',
      },
    ],
    variants: [
      'For one thing, ... For another, ...',
      'On the positive side, ... On the negative side, ...',
      'The advantages are obvious; the drawbacks, however, are equally real.',
    ],
    pitfall:
      'on the other hand 需要与前文形成对立或权衡，若只是补充同类信息，应改用 in addition 或 moreover。',
    upgrade: {
      from: 'Social media has good and bad sides.',
      to: 'On the one hand, social media keeps us connected with friends far away; on the other hand, it can quietly consume hours of our day.',
    },
  },

  {
    cat: 'contrast',
    tier: 'advanced',
    form: 'comparative',
    levels: ['cet6', 'kaoyan'],
    structure: 'Compared with + 名词, + 主句',
    cn: '与……相比，……',
    usage:
      '用过去分词短语引出参照对象，把对比做得干净利落。适合数据类、代际差异、城乡差异等需要横向比较的论述。',
    when: ['横向比较两类事物', '图表作文对比数据', '代际／地区差异论述'],
    examples: [
      {
        en: 'Compared with traditional classrooms, online platforms allow learners to study at their own pace.',
        cn: '与传统课堂相比，在线平台让学习者可以按自己的节奏学习。',
        note: 'Compared with 的逻辑主语应与主句主语一致。',
      },
      {
        en: 'Compared with their parents\u2019 generation, today\u2019s graduates face a far more competitive job market.',
        cn: '与父辈相比，如今的毕业生面临竞争激烈得多的就业市场。',
        note: 'far more competitive 用 far 加强比较级。',
      },
    ],
    variants: [
      'In contrast to ... , ...',
      'Relative to ... , ...',
      'When set against ... , ...',
    ],
    pitfall:
      'Compared with 是过去分词短语，比较对象与主句主语必须同类可比（人比人、物比物），不能拿"在线平台"和"学生"比较。',
    upgrade: {
      from: 'Online platforms are different from classrooms. You can study freely.',
      to: 'Compared with traditional classrooms, online platforms allow learners to study at their own pace.',
    },
  },

  {
    cat: 'contrast',
    tier: 'advanced',
    form: 'inversion',
    levels: ['cet6', 'kaoyan'],
    structure: 'Not until + 时间/条件 + did + 主语 + 动词',
    cn: '直到……，……才……',
    usage:
      '否定词提前的部分倒装，强调"直到某个节点才发生转变"，时间张力强。适合描述认识转变、政策见效、习惯养成等过程。',
    when: ['描述认识或态度的转变', '强调某措施见效的时点', '叙事与议论结合处'],
    examples: [
      {
        en: 'Not until we lose our health do we realize how precious it is.',
        cn: '直到失去健康，我们才意识到它有多珍贵。',
        note: '主句用一般过去时，故倒装用 did + 动词原形。',
      },
      {
        en: 'Not until strict regulations were introduced did air quality begin to improve.',
        cn: '直到严格的法规出台，空气质量才开始改善。',
        note: '可用于环保政策类话题。',
      },
    ],
    variants: [
      'Only when ... did ...',
      'It was not until ... that ...',
      'Never did ... until ...',
    ],
    pitfall:
      'Not until 引导的从句用陈述语序，只有主句倒装；若改用 It was not until ... that ... 则主句不再倒装。',
    upgrade: {
      from: 'We only realize health is precious after we lose it.',
      to: 'Not until we lose our health do we realize how precious it is.',
    },
  },

  {
    cat: 'contrast',
    tier: 'expert',
    form: 'subjunctive',
    levels: ['cet6', 'kaoyan'],
    structure: 'Were it not for + 名词, + 主语 + would + 动词',
    cn: '如果没有……，……就不会……',
    usage:
      '省略 if 的虚拟条件句倒装，书面语色彩极强。用于假设反事实情形，反衬某事物不可或缺，是"很高级"句式中最能体现语法功底的一种。',
    when: ['假设不存在某事物的后果', '反衬某因素的关键作用', '冲刺满分句式'],
    examples: [
      {
        en: 'Were it not for the constant flow of information, modern society would grind to a halt.',
        cn: '如果没有持续的信息流动，现代社会将陷入停滞。',
        note: 'Were it not for 相当于 If it were not for，用于与现在事实相反。',
      },
      {
        en: 'Were it not for the dedication of countless teachers, many children would never escape poverty.',
        cn: '如果没有无数教师的奉献，许多孩子将永远无法摆脱贫困。',
        note: '可用于教育公平类话题。',
      },
    ],
    variants: [
      'If it were not for ... , ... would ...',
      'Had it not been for ... , ... would have ... （与过去事实相反）',
      'But for ... , ... would ...',
    ],
    pitfall:
      'Were it not for 用于现在，Had it not been for 用于过去，两者不可混用；主句须用 would/could/might + 动词原形。',
    upgrade: {
      from: 'Without information, modern society would stop.',
      to: 'Were it not for the constant flow of information, modern society would grind to a halt.',
    },
  },
]
