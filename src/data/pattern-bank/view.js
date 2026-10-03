/**
 * 观点态度 · 6 句
 * 功能：亮明立场、表达判断、回应他人观点。
 */
export default [
  {
    cat: 'view',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'From my perspective, ... / As far as I am concerned, ...',
    cn: '在我看来／就我而言，……',
    usage:
      '用于亮明个人立场。四六级作文通常要求在首段末或第二段开头给出明确观点，这两个短语比 "I think" 正式得多，能立刻提升语言档次。',
    when: ['议论文表明立场', '第二段开头引出个人观点', '需要替换 I think 时'],
    examples: [
      {
        en: 'From my perspective, the benefits of online learning far outweigh its drawbacks.',
        cn: '在我看来，在线学习的好处远大于弊端。',
        note: 'far outweigh 是"远大于"的高分表达。',
      },
      {
        en: 'As far as I am concerned, diligence matters more than talent in the long run.',
        cn: '就我而言，从长远看勤奋比天赋更重要。',
        note: 'in the long run 意为"从长远看"。',
      },
    ],
    variants: [
      'In my eyes, ...',
      'To my mind, ...',
      'Personally, I am convinced that ...',
      'It is my firm belief that ...',
    ],
    pitfall:
      'as far as I am concerned 中的 am 不能省略，也不能写成 "as far as I concern"。concern 在此是"涉及"的被动含义。',
    upgrade: {
      from: 'I think online learning is better.',
      to: 'From my perspective, the benefits of online learning far outweigh its drawbacks.',
    },
  },

  {
    cat: 'view',
    tier: 'core',
    form: 'clause',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'It is my firm belief that + 从句',
    cn: '我坚信，……',
    usage:
      '语气强于 I think，表达经过思考后的坚定判断，适合放在结论段或反驳之后强化立场。形式主语结构使句子重心后移，读起来比 "I firmly believe that" 更书面。',
    when: ['结论段强化立场', '反驳对立观点后表明态度', '需要提升语言正式度时'],
    examples: [
      {
        en: 'It is my firm belief that perseverance is the key to overcoming any obstacle.',
        cn: '我坚信，坚持是克服一切障碍的关键。',
        note: 'the key to 后接动名词。',
      },
      {
        en: 'It is my firm belief that education should aim to cultivate independent thinkers.',
        cn: '我坚信，教育应当以培养独立思考者为目标。',
        note: 'aim to do 意为"旨在做"。',
      },
    ],
    variants: [
      'I am firmly convinced that ...',
      'I hold the view that ...',
      'I am of the opinion that ...',
      'It is my conviction that ...',
    ],
    pitfall:
      'belief 是名词，所以是 it is my firm belief that；不能混写成 "It is my firm believe that"。',
    upgrade: {
      from: 'I really think perseverance is important.',
      to: 'It is my firm belief that perseverance is the key to overcoming any obstacle.',
    },
  },

  {
    cat: 'view',
    tier: 'advanced',
    form: 'nominal',
    levels: ['cet6', 'kaoyan'],
    structure: 'A growing body of evidence points to the conclusion that + 从句',
    cn: '越来越多的证据表明，……',
    usage:
      '用"证据"作主语，把个人判断包装成有据可依的结论，说服力远高于 "I think"。适合论证段开头引入自己的核心判断，也适合反驳对方时先立证据再下结论。',
    when: ['论证段开头引入核心判断', '需要为观点提供依据时', '反驳对方观点前的立论'],
    examples: [
      {
        en: 'A growing body of evidence points to the conclusion that early reading habits shape lifelong learning ability.',
        cn: '越来越多的证据表明，早期阅读习惯塑造了终身学习能力。',
        note: 'points to the conclusion that 后接同位语从句。',
      },
      {
        en: 'A growing body of evidence points to the conclusion that regular exercise improves academic performance.',
        cn: '越来越多的证据表明，规律运动能提升学业表现。',
        note: '适合教育与健康交叉话题。',
      },
    ],
    variants: [
      'Mounting evidence suggests that ...',
      'A wealth of research indicates that ...',
      'Studies conducted over the past decade have consistently shown that ...',
    ],
    pitfall:
      'conclusion 后是同位语从句，that 只起连接作用、不作句子成分；points to 中的 to 不可省。',
    upgrade: {
      from: 'I think reading habits are important for learning.',
      to: 'A growing body of evidence points to the conclusion that early reading habits shape lifelong learning ability.',
    },
  },

  {
    cat: 'view',
    tier: 'advanced',
    form: 'comparative',
    levels: ['cet6', 'kaoyan'],
    structure: 'Nothing is more + 形容词 + than + 名词/动名词',
    cn: '没有什么比……更……了。',
    usage:
      '用比较级表达最高级含义，比 "X is the most ..." 更有力度，也避开了最高级易犯的冠词错误。适合放在段首或段尾强调某一因素的决定性作用。',
    when: ['强调某因素的决定性作用', '段落首尾强化观点', '需要替换 the most 时'],
    examples: [
      {
        en: 'Nothing is more essential to personal growth than the courage to admit one\u2019s mistakes.',
        cn: '对个人成长而言，没有什么比承认错误的勇气更重要的了。',
        note: 'to personal growth 表示"对……而言"。',
      },
      {
        en: 'Nothing is more rewarding than turning knowledge into practical value.',
        cn: '没有什么比把知识转化为实际价值更有意义的了。',
        note: 'than 后接动名词，与前面的名词结构对应。',
      },
    ],
    variants: [
      'No quality is more valuable than ...',
      'There is nothing more important than ...',
      'Nothing counts more than ...',
    ],
    pitfall:
      '比较结构要求 than 前后形式对称：前面是名词，than 后也应接名词或动名词。',
    upgrade: {
      from: 'The courage to admit mistakes is the most important thing.',
      to: 'Nothing is more essential to personal growth than the courage to admit one\u2019s mistakes.',
    },
  },

  {
    cat: 'view',
    tier: 'advanced',
    form: 'negation',
    levels: ['cet6', 'kaoyan'],
    structure: 'I can hardly agree with the view that + 从句',
    cn: '我很难认同……这一观点。',
    usage:
      '礼貌而坚定地表达不同意见。用 hardly 弱化否定力度，既保持书面语的分寸感，又清楚表明立场，适合驳论段落的第一句。',
    when: ['驳论段开头', '委婉表达不同意见', '评述他人观点时'],
    examples: [
      {
        en: 'I can hardly agree with the view that academic performance alone determines a student\u2019s future.',
        cn: '我很难认同"学业成绩独自决定学生未来"这一观点。',
        note: 'the view that 后接同位语从句。',
      },
      {
        en: 'I can hardly agree with the view that technology will eventually replace teachers.',
        cn: '我很难认同技术终将取代教师这一观点。',
        note: '适合科技与教育类话题。',
      },
    ],
    variants: [
      'I find it hard to accept the argument that ...',
      'I am not convinced by the claim that ...',
      'The view that ... does not hold water.',
    ],
    pitfall:
      'hardly 本身已含否定，句中不能再加 not；the view that 后是同位语从句，需为完整句子。',
    upgrade: {
      from: 'I do not think grades decide everything.',
      to: 'I can hardly agree with the view that academic performance alone determines a student\u2019s future.',
    },
  },

  {
    cat: 'view',
    tier: 'expert',
    form: 'inversion',
    levels: ['cet6', 'kaoyan'],
    structure: 'Under no circumstances should we + 动词原形',
    cn: '在任何情况下我们都不应……',
    usage:
      '否定介词短语置于句首引发部分倒装，语气斩钉截铁，适合表达底线立场（如诚信、安全、环保）。用在结尾段提出呼吁时，分量极重。',
    when: ['表达不可逾越的底线', '结尾段提出强烈呼吁', '强调原则性问题时'],
    examples: [
      {
        en: 'Under no circumstances should we sacrifice environmental protection for short-term economic gain.',
        cn: '在任何情况下我们都不应以牺牲环境保护来换取短期经济利益。',
        note: '情态动词 should 提到主语 we 之前。',
      },
      {
        en: 'Under no circumstances should academic integrity be compromised for a higher score.',
        cn: '在任何情况下都不应为取得更高分数而损害学术诚信。',
        note: '被动语态倒装：should + 主语 + be + 过去分词。',
      },
    ],
    variants: [
      'On no account should we ...',
      'In no case should we ...',
      'By no means should we ...',
    ],
    pitfall:
      '倒装后 must/should 等情态动词提到主语前，其后动词用原形；被动语态别漏掉 be。',
    upgrade: {
      from: 'We should never hurt the environment for money.',
      to: 'Under no circumstances should we sacrifice environmental protection for short-term economic gain.',
    },
  },
]
