/**
 * 数据图表 · 5 句
 * 功能：图表作文描述趋势、对比数据、解读数字背后的含义。
 */
export default [
  {
    cat: 'data',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6'],
    structure: 'The figure climbed from + 数字 + to + 数字, accounting for + 百分比 + of the total.',
    cn: '该数字从……上升到……，占总量的……%。',
    usage:
      '图表作文描述数据变化的标准句式。accounting for 是现在分词作状语，一句同时给出"变化"和"占比"两个信息，效率高。',
    when: ['描述上升趋势', '需要同时给出占比时', '图表作文主体段'],
    examples: [
      {
        en: 'The figure climbed from 12 percent in 2015 to 38 percent in 2024, accounting for more than a third of the total.',
        cn: '该数字从 2015 年的 12% 上升到 2024 年的 38%，占总量三分之一以上。',
        note: '现在分词 accounting for 作结果状语，逻辑主语是 the figure。',
      },
      {
        en: 'The number of online learners climbed from 5 million to 21 million, accounting for nearly half of all students.',
        cn: '在线学习人数从 500 万上升到 2100 万，占全部学生的近一半。',
        note: '数字表达要统一单位，避免中英混杂。',
      },
    ],
    variants: [
      'The figure rose sharply from ... to ...',
      '... witnessed an increase from ... to ...',
      '... climbed steadily, making up ... percent of the total.',
    ],
    pitfall:
      'climb from A to B 中 A、B 应同为数字或百分比；accounting for 的主语必须是前面的数字，否则会出现悬垂修饰。',
    upgrade: {
      from: 'In 2015 it was 12%. In 2024 it was 38%.',
      to: 'The figure climbed from 12 percent in 2015 to 38 percent in 2024, accounting for more than a third of the total.',
    },
  },

  {
    cat: 'data',
    tier: 'advanced',
    form: 'nominal',
    levels: ['cet6', 'kaoyan'],
    structure: 'The chart reveals a striking contrast between A and B',
    cn: '该图表揭示了 A 与 B 之间鲜明的对比。',
    usage:
      '用"图表"作主语，把描述数据升级为解读数据，一句话点出图表的核心信息，比逐个报数字更像分析。',
    when: ['图表作文概述句', '对比两组数据', '点出图表核心信息'],
    examples: [
      {
        en: 'The chart reveals a striking contrast between the time urban and rural residents spend on digital devices.',
        cn: '该图表揭示了城乡居民在数字设备上花费时间方面的鲜明对比。',
        note: 'between A and B 要求 A、B 结构对称。',
      },
      {
        en: 'The chart reveals a striking contrast between the career expectations of graduates and the demands of employers.',
        cn: '该图表揭示了毕业生职业期望与雇主需求之间的鲜明对比。',
        note: '适合就业类图表题。',
      },
    ],
    variants: [
      'The data point to a marked difference between A and B.',
      'A sharp contrast is evident between A and B.',
      'What the chart highlights is the gap between A and B.',
    ],
    pitfall:
      'between 用于两者，among 用于三者及以上；contrast 后接 between ... and ...，不要写成 contrast of A and B。',
    upgrade: {
      from: 'Urban and rural people use phones differently.',
      to: 'The chart reveals a striking contrast between the time urban and rural residents spend on digital devices.',
    },
  },

  {
    cat: 'data',
    tier: 'advanced',
    form: 'comparative',
    levels: ['cet6', 'kaoyan'],
    structure: 'The proportion of A is roughly three times that of B',
    cn: 'A 的比例约为 B 的三倍。',
    usage:
      '倍数比较结构，用 that of 指代前文名词，避免重复。比 "A is three times more than B" 更准确，也更能体现语言功底。',
    when: ['倍数关系描述', '两组数据对比', '图表作文分析句'],
    examples: [
      {
        en: 'The proportion of students who read for pleasure is roughly three times that of those who read only for exams.',
        cn: '为兴趣而阅读的学生比例约为只为考试而阅读者的三倍。',
        note: 'that of 指代 the proportion，避免重复。',
      },
      {
        en: 'The amount of energy consumed by industry is roughly twice that of households.',
        cn: '工业消耗的能源约为家庭的两倍。',
        note: 'twice that of 是"是……的两倍"的标准说法。',
      },
    ],
    variants: [
      'A accounts for twice as much as B.',
      'The figure for A is nearly double that of B.',
      'A exceeds B by a factor of three.',
    ],
    pitfall:
      '倍数比较要用 that of / those of 指代（单数 that，复数 those）；写成 "three times more than" 在中文语境下易产生歧义，考试中建议用 as much as 或 that of。',
    upgrade: {
      from: 'Industry uses two times more energy than families.',
      to: 'The amount of energy consumed by industry is roughly twice that of households.',
    },
  },

  {
    cat: 'data',
    tier: 'advanced',
    form: 'participle',
    levels: ['cet6', 'kaoyan'],
    structure: 'As is shown in the chart, + 主句',
    cn: '正如图表所示，……',
    usage:
      'As 引导非限制性定语从句，指代整个主句内容，是引用图表信息最规范的开头。比 "According to the chart" 更地道。',
    when: ['图表作文开头', '引用数据前的引导', '引用研究结论时'],
    examples: [
      {
        en: 'As is shown in the chart, the number of people working from home has more than doubled in five years.',
        cn: '正如图表所示，居家办公的人数五年间增长了一倍多。',
        note: 'as 指代后面整个主句，从句谓语用被动 is shown。',
      },
      {
        en: 'As is shown in the chart, spending on health care grows steadily while spending on entertainment fluctuates.',
        cn: '正如图表所示，医疗支出稳步增长，而娱乐支出则起伏不定。',
        note: 'while 表对比，前后时态可不同。',
      },
    ],
    variants: [
      'As the chart indicates, ...',
      'As can be seen from the figures, ...',
      'The chart shows that ...',
    ],
    pitfall:
      'As is shown 中 as 是关系代词作主语，不能写成 "As is shown in the chart that ..."；若要接 that 从句，应改用 The chart shows that ...。',
    upgrade: {
      from: 'According to the chart, home working doubled.',
      to: 'As is shown in the chart, the number of people working from home has more than doubled in five years.',
    },
  },

  {
    cat: 'data',
    tier: 'expert',
    form: 'clause',
    levels: ['kaoyan'],
    structure: 'What the figures make clear is that + 从句',
    cn: '这些数字清楚表明，……',
    usage:
      '用主语从句把"数据说明的道理"作为句子重心，从描述数据上升到提炼结论，是图表作文由"报数"转向"分析"的关键一句。',
    when: ['图表作文的结论句', '从数据上升到观点', '分析段收束'],
    examples: [
      {
        en: 'What the figures make clear is that convenience alone does not guarantee lasting satisfaction.',
        cn: '这些数字清楚表明，仅有便利并不足以带来持久的满足感。',
        note: 'what 从句作主语，is that 后接表语从句。',
      },
      {
        en: 'What the figures make clear is that the gap is narrowing, but far too slowly.',
        cn: '这些数字清楚表明，差距正在缩小，但速度远远不够。',
        note: 'but 后的短句能制造有力的停顿。',
      },
    ],
    variants: [
      'What the data suggest is that ...',
      'The figures point to the conclusion that ...',
      'It is clear from the data that ...',
    ],
    pitfall:
      'what 从句作主语时谓语用单数 is；表语从句的 that 不可省略，否则会与主语从句结构混淆。',
    upgrade: {
      from: 'The data show convenience is not enough.',
      to: 'What the figures make clear is that convenience alone does not guarantee lasting satisfaction.',
    },
  },
]
