/**
 * 因果影响 · 5 句
 * 功能：分析原因、推演后果。
 */
export default [
  {
    cat: 'cause',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'This can be attributed to + 名词',
    cn: '这可以归因于……',
    usage:
      '被动语态把"原因"放在句末作为信息焦点，比 "because of" 更书面，也比 "The reason is" 更简洁。适合原因分析段的第一句。',
    when: ['原因分析段开头', '解释某一现象成因', '需要客观语气时'],
    examples: [
      {
        en: 'This can be attributed to the unprecedented pace of technological change.',
        cn: '这可以归因于技术变革前所未有的速度。',
        note: 'attribute A to B 意为"把 A 归因于 B"。',
      },
      {
        en: 'The decline in reading can be attributed to the fragmentation of attention in the digital age.',
        cn: '阅读量的下降可归因于数字时代注意力的碎片化。',
        note: '适合阅读、注意力类话题。',
      },
    ],
    variants: [
      'This stems largely from ...',
      'This is chiefly a consequence of ...',
      'Several factors account for this phenomenon.',
    ],
    pitfall:
      'attribute 是及物动词，必须有宾语，因此用被动语态时不要写成 "This can attribute to"；主动式为 attribute A to B。',
    upgrade: {
      from: 'Because technology changes very fast, this happens.',
      to: 'This can be attributed to the unprecedented pace of technological change.',
    },
  },

  {
    cat: 'cause',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: '... contributes to + 名词',
    cn: '……有助于／导致了……',
    usage:
      '一句话建立因果关系，主语可以是人、事或现象，使用灵活。既可表正面贡献，也可表负面促成，具体靠宾语判断。',
    when: ['建立因果关系', '阐述某因素的作用', '论证段推进论点'],
    examples: [
      {
        en: 'Regular physical exercise contributes to both mental clarity and emotional stability.',
        cn: '规律的体育锻炼有助于保持头脑清晰与情绪稳定。',
        note: 'both ... and ... 连接两个并列成分。',
      },
      {
        en: 'Excessive screen time contributes to poor sleep quality among teenagers.',
        cn: '过长的屏幕使用时间导致青少年睡眠质量下降。',
        note: '此处为负面促成，宾语多为负面结果。',
      },
    ],
    variants: [
      '... plays a part in ...',
      '... is conducive to ... （仅用于正面）',
      '... gives rise to ... （多用于负面）',
    ],
    pitfall:
      'contribute to 中的 to 是介词，后接名词或动名词，不能接动词原形；表"有助于"时主语通常是事物而非人。',
    upgrade: {
      from: 'Exercise is good for your mood.',
      to: 'Regular physical exercise contributes to both mental clarity and emotional stability.',
    },
  },

  {
    cat: 'cause',
    tier: 'advanced',
    form: 'nominal',
    levels: ['cet6', 'kaoyan'],
    structure: 'A host of factors have combined to + 动词',
    cn: '多种因素共同导致了……',
    usage:
      '用"因素"作主语，表明原因是多重的，避免把复杂问题简单归为单一原因。这是阅卷老师欣赏的辩证思维，也是原因段的高分开头。',
    when: ['多因一果的论述', '避免归因过于简单', '原因分析段开头'],
    examples: [
      {
        en: 'A host of factors have combined to make young people increasingly reluctant to have children.',
        cn: '多种因素共同导致年轻人越来越不愿生育。',
        note: 'have combined to do 用完成时强调累积效应。',
      },
      {
        en: 'A host of factors have combined to push housing prices beyond the reach of ordinary families.',
        cn: '多种因素共同把房价推高到普通家庭难以承受的水平。',
        note: 'beyond the reach of 意为"超出……的能力范围"。',
      },
    ],
    variants: [
      'A combination of factors has led to ...',
      'Multiple forces are at work behind ...',
      'This phenomenon arises from an interplay of factors.',
    ],
    pitfall:
      'a host of 修饰可数名词复数，谓语用复数（have）；若用 a combination of 则谓语通常用单数（has）。',
    upgrade: {
      from: 'Many reasons make young people not want children.',
      to: 'A host of factors have combined to make young people increasingly reluctant to have children.',
    },
  },

  {
    cat: 'cause',
    tier: 'advanced',
    form: 'clause',
    levels: ['cet6', 'kaoyan'],
    structure: 'The reason why + 从句 + lies in the fact that + 从句',
    cn: '……的原因在于……',
    usage:
      '把原因句拆成"现象 + 解释"两层，逻辑清晰、语气正式。比 "because" 更适合书面语，且能容纳较长、较复杂的原因内容。',
    when: ['需要详细解释原因时', '原因段的核心句', '回应"为什么"类设问'],
    examples: [
      {
        en: 'The reason why lifelong learning has become indispensable lies in the fact that knowledge now ages faster than ever.',
        cn: '终身学习之所以不可或缺，原因在于如今知识过时的速度前所未有。',
        note: 'lies in the fact that 后接同位语从句。',
      },
      {
        en: 'The reason why many graduates struggle lies in the fact that they lack practical experience.',
        cn: '许多毕业生之所以求职艰难，原因在于他们缺乏实践经验。',
        note: '适合就业类话题。',
      },
    ],
    variants: [
      'The root cause of ... is that ...',
      'This is largely because ...',
      'What accounts for this is that ...',
    ],
    pitfall:
      'The reason why 后是完整从句，lies in the fact that 中的 that 不能省；切忌写成 "The reason is because"。',
    upgrade: {
      from: 'Lifelong learning is needed because knowledge changes fast.',
      to: 'The reason why lifelong learning has become indispensable lies in the fact that knowledge now ages faster than ever.',
    },
  },

  {
    cat: 'cause',
    tier: 'expert',
    form: 'participle',
    levels: ['kaoyan'],
    structure: 'Such is the magnitude of + 名词 + that + 从句',
    cn: '……的影响之大，以至于……',
    usage:
      'Such 置于句首引发完全倒装，把"影响之大"这一判断放在最前，气势十足。适合描述某现象的深远后果，是冲击高分的压轴句式。',
    when: ['强调后果之严重或影响之深远', '结尾段回扣影响', '需要一句"重锤"收束'],
    examples: [
      {
        en: 'Such is the magnitude of climate change that no country can address it alone.',
        cn: '气候变化的影响之大，以至于没有任何国家能独自应对。',
        note: 'Such 提前后 be 动词 is 提到主语之前。',
      },
      {
        en: 'Such is the influence of social media that it now shapes how a generation defines itself.',
        cn: '社交媒体的影响之大，以至于它正在塑造一代人定义自我的方式。',
        note: '适合媒介与社会类话题。',
      },
    ],
    variants: [
      'So great is the impact of X that ...',
      'Such is the scale of X that ...',
      'So profound is the influence of X that ...',
    ],
    pitfall:
      'Such 提前时须完全倒装（Such + be + 主语 + that 从句）；写成 "Such the magnitude is" 即错。',
    upgrade: {
      from: 'Climate change is so serious that no country can solve it alone.',
      to: 'Such is the magnitude of climate change that no country can address it alone.',
    },
  },
]
