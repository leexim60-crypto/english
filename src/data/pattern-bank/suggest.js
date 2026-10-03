/**
 * 建议措施 · 6 句
 * 功能：提出对策、发出呼吁、给出可执行路径。
 */
export default [
  {
    cat: 'suggest',
    tier: 'core',
    form: 'subjunctive',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'It is high time that we + 过去式',
    cn: '该是我们……的时候了。',
    usage:
      '用虚拟语气（从句谓语用过去式）表达"早该做了"，带有紧迫感与呼吁意味，适合建议段的收束句。',
    when: ['建议段收束', '呼吁采取行动', '强调时不我待'],
    examples: [
      {
        en: 'It is high time that we took concrete measures to curb food waste.',
        cn: '该是我们采取具体措施遏制食物浪费的时候了。',
        note: 'that 从句谓语用过去式 took，是虚拟语气的要求。',
      },
      {
        en: 'It is high time that we redefined success in terms broader than income.',
        cn: '该是我们用比收入更宽泛的标准重新定义成功的时候了。',
        note: 'in terms broader than 意为"用比……更宽泛的标准"。',
      },
    ],
    variants: [
      'It is about time that we ...',
      'It is high time for us to ... （后接不定式，更简单）',
      'The time has come for us to ...',
    ],
    pitfall:
      '该句型的 that 从句必须用过去式（took），不是 should take；若想避免出错，可改用 It is high time for us to do。',
    upgrade: {
      from: 'We should stop wasting food now.',
      to: 'It is high time that we took concrete measures to curb food waste.',
    },
  },

  {
    cat: 'suggest',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'Greater efforts should be made to + 动词',
    cn: '应当付出更大努力去……',
    usage:
      '被动语态把"努力"作为主语，语气客观、责任分散，不指向具体某个人，非常适合建议段的第一句。',
    when: ['建议段开头', '提出宏观对策', '避免指名道姓的指责'],
    examples: [
      {
        en: 'Greater efforts should be made to narrow the gap between urban and rural education.',
        cn: '应当付出更大努力来缩小城乡教育差距。',
        note: 'to 引导目的状语，后接动词原形。',
      },
      {
        en: 'Greater efforts should be made to protect personal data in the digital era.',
        cn: '应当付出更大努力在数字时代保护个人数据。',
        note: '适合科技伦理类话题。',
      },
    ],
    variants: [
      'More resources should be devoted to ...',
      'Priority should be given to ...',
      'It is imperative that we ...',
    ],
    pitfall:
      'make efforts to do 中 to 后接动词原形；被动语态下不要漏掉 be（× Greater efforts should made）。',
    upgrade: {
      from: 'We should work harder to help rural schools.',
      to: 'Greater efforts should be made to narrow the gap between urban and rural education.',
    },
  },

  {
    cat: 'suggest',
    tier: 'advanced',
    form: 'inversion',
    levels: ['cet6', 'kaoyan'],
    structure: 'Only by + 动名词 + can we + 动词原形',
    cn: '只有通过……，我们才能……',
    usage:
      'Only + 状语置于句首引发部分倒装，把"唯一途径"摆在最前面，结论掷地有声。是建议段与结尾段都极好用的一句。',
    when: ['强调唯一可行途径', '建议段收束', '结尾段发出呼吁'],
    examples: [
      {
        en: 'Only by combining individual awareness with institutional support can we build a truly sustainable society.',
        cn: '只有把个人意识与制度支持结合起来，我们才能建成真正可持续的社会。',
        note: 'Only by 短语提前，主句倒装为 can we。',
      },
      {
        en: 'Only by allowing room for failure can young people grow into resilient adults.',
        cn: '只有允许失败的空间，年轻人才能成长为有韧性的人。',
        note: 'allow room for 意为"给……留出空间"。',
      },
    ],
    variants: [
      'Only when ... can we ...',
      'Only through ... can we ...',
      'It is only by ... that we can ...',
    ],
    pitfall:
      'Only 修饰状语置于句首才倒装（Only by/Only when）；若 Only 修饰主语则句子不倒装（Only a few people know）。',
    upgrade: {
      from: 'If we work together we can be sustainable.',
      to: 'Only by combining individual awareness with institutional support can we build a truly sustainable society.',
    },
  },

  {
    cat: 'suggest',
    tier: 'advanced',
    form: 'clause',
    levels: ['cet6', 'kaoyan'],
    structure: 'It is advisable that + 主语 + (should) + 动词原形',
    cn: '建议……',
    usage:
      '形容词 advisable 后的主语从句用虚拟语气（should 可省），语气比 "We should" 更委婉也更正式，适合向读者或机构提出建议。',
    when: ['提出具体建议', '给读者或机构建言', '应用文中的建议段'],
    examples: [
      {
        en: 'It is advisable that universities should integrate practical training into the curriculum.',
        cn: '建议大学把实践训练纳入课程体系。',
        note: 'should 可省略，省略后 integrate 仍用原形。',
      },
      {
        en: 'It is advisable that parents should set limits on screen time rather than ban it outright.',
        cn: '建议家长对屏幕时间加以限制，而不是一概禁止。',
        note: 'rather than 连接两个对称成分。',
      },
    ],
    variants: [
      'It is recommended that ... (should) ...',
      'It would be wise for ... to ...',
      'It is essential that ... (should) ...',
    ],
    pitfall:
      'advisable / essential / imperative 等形容词后的主语从句须用虚拟语气（should + 原形，should 可省），不能用一般现在时。',
    upgrade: {
      from: 'Universities should add practice courses.',
      to: 'It is advisable that universities should integrate practical training into the curriculum.',
    },
  },

  {
    cat: 'suggest',
    tier: 'advanced',
    form: 'subjunctive',
    levels: ['cet6', 'kaoyan'],
    structure: 'It is imperative that + 主语 + (should) + 动词原形',
    cn: '迫切需要……',
    usage:
      'imperative 比 important 更紧迫，同样引导虚拟语气从句。适合在结尾段提出当务之急，语气强而不失客观。',
    when: ['提出当务之急', '结尾段强化呼吁', '重大议题的对策句'],
    examples: [
      {
        en: 'It is imperative that governments and citizens should join hands to tackle plastic pollution.',
        cn: '迫切需要政府与公民携手应对塑料污染。',
        note: 'join hands to do 意为"携手做某事"。',
      },
      {
        en: 'It is imperative that we should treat artificial intelligence as a tool rather than a substitute for judgment.',
        cn: '我们迫切需要把人工智能当作工具，而非判断力的替代品。',
        note: 'rather than 后接与前项对称的成分。',
      },
    ],
    variants: [
      'It is crucial that ... (should) ...',
      'There is an urgent need to ...',
      'It is of paramount importance that ...',
    ],
    pitfall:
      'imperative 后的从句同样用虚拟语气；不要因为句子长就改用一般时态，这是阅卷常抓的语法点。',
    upgrade: {
      from: 'Governments and people must work together on plastic.',
      to: 'It is imperative that governments and citizens should join hands to tackle plastic pollution.',
    },
  },

  {
    cat: 'suggest',
    tier: 'expert',
    form: 'subjunctive',
    levels: ['kaoyan'],
    structure: 'Should + 主语 + 动词原形, + 主句',
    cn: '如果……，就……',
    usage:
      '省略 if 的虚拟条件句倒装，把 should 提到句首，书面语色彩极浓。用于提出"万一发生"的情形并给出对策，是考研写作的高阶句式。',
    when: ['假设某种可能性并给出对策', '正式书面语中的条件句', '冲刺高分的收束句'],
    examples: [
      {
        en: 'Should the current trend continue, we will soon be forced to confront a serious water crisis.',
        cn: '如果当前趋势持续下去，我们很快将被迫面对严重的水危机。',
        note: 'Should 提前代替 If the trend should continue。',
      },
      {
        en: 'Should we ignore these warning signs, the cost of inaction will far exceed that of action.',
        cn: '如果我们忽视这些警示信号，不作为的代价将远超行动的代价。',
        note: 'that of action 中的 that 指代 the cost。',
      },
    ],
    variants: [
      'If ... should ... , ... will ...',
      'Were ... to ... , ... would ...',
      'Provided that ... , ...',
    ],
    pitfall:
      'Should 倒装后动词必须用原形；主句通常用 will/would，不要再用 should。',
    upgrade: {
      from: 'If this trend goes on, we will face a water crisis.',
      to: 'Should the current trend continue, we will soon be forced to confront a serious water crisis.',
    },
  },
]
