/**
 * 写作句型库（四六级 / 考研 高分作文）
 * ---------------------------------------------------------------
 * 字段说明：
 *   cat        分类 key，对应 CATEGORIES
 *   levels     适用考试：cet4 / cet6 / kaoyan
 *   structure  句型骨架（+ 处为可替换槽位）
 *   cn         中文释义
 *   usage      这个句型"什么时候用"——写作位置与语用功能
 *   when[]     具体适用场景清单
 *   examples[] 例句（英 + 中 + 出处说明）
 *   variants[] 同义替换表达，避免全篇重复同一句式
 *   pitfall    易错点 / 阅卷扣分雷区
 */

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
]

export const LEVELS = [
  { key: 'all', label: '全部' },
  { key: 'cet4', label: '四级' },
  { key: 'cet6', label: '六级' },
  { key: 'kaoyan', label: '考研' },
]

export const LEVEL_NAMES = { cet4: '四级', cet6: '六级', kaoyan: '考研' }

export const patterns = [
  /* ============ 开篇引入 ============ */
  {
    id: 1,
    cat: 'opening',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'It is universally acknowledged that + 从句',
    cn: '众所周知／人们普遍认为……',
    usage:
      '议论文首段第一句，用来引出一个人人认可的背景性事实，为后文展开论点铺路。语气正式、立场中立，是最稳妥的开篇方式。',
    when: ['议论文首段引入背景', '需要强调观点具有普遍性时', '正式书面语、学术写作'],
    examples: [
      {
        en: 'It is universally acknowledged that a healthy diet contributes to both physical and mental well-being.',
        cn: '众所周知，健康的饮食对身心健康都有益处。',
        note: 'that 引导主语从句，it 是形式主语。',
      },
      {
        en: 'It is universally acknowledged that reading widely broadens one\u2019s horizons.',
        cn: '众所周知，广泛阅读能开阔视野。',
        note: '可用于"读书""终身学习"类话题。',
      },
    ],
    variants: [
      'It is widely believed that ...',
      'There is a general consensus that ...',
      'It is commonly accepted that ...',
      'Few people would deny that ...',
    ],
    pitfall:
      'acknowledge 的被动语态必须保留形式主语 it，不能写成 "It universally acknowledged that"。另外 that 后必须接完整句子，不能只接名词短语。',
  },
  {
    id: 2,
    cat: 'opening',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'With the rapid development of + 名词, ... has become a heated topic.',
    cn: '随着……的迅速发展，……已成为热议话题。',
    usage:
      '用于"社会现象类"作文的开头。先用 with 短语交代时代背景，再点出争议话题，两句之间的逻辑衔接自然，是阅卷老师最熟悉也最认可的写法。',
    when: ['科技、经济、教育等发展类话题', '现象评述型作文开头', '需要交代时代背景时'],
    examples: [
      {
        en: 'With the rapid development of artificial intelligence, whether it will replace human jobs has become a heated topic.',
        cn: '随着人工智能的迅速发展，它是否会取代人类工作已成为热议话题。',
        note: 'whether 引导的主语从句作真正主语。',
      },
      {
        en: 'With the rapid development of online education, the way students acquire knowledge has changed dramatically.',
        cn: '随着在线教育的迅速发展，学生获取知识的方式已发生巨大变化。',
        note: '后半句也可写成 has undergone dramatic changes。',
      },
    ],
    variants: [
      'With the advent of ...',
      'Along with the boom of ...',
      'As ... advances by leaps and bounds, ...',
      'In the era of ..., ...',
    ],
    pitfall:
      'development 后接 of + 名词，不要接动词原形。另外 heated 表示"激烈的（讨论）"，不能换成 hot。',
  },
  {
    id: 3,
    cat: 'opening',
    levels: ['cet4', 'cet6'],
    structure: 'Recently, ... has aroused wide public concern.',
    cn: '近来，……引起了公众的广泛关注。',
    usage:
      '适合"问题型"作文开篇——先说某个现象引发关注，接着分析原因、提出对策。比上一句型更聚焦于"问题"，常用于负面或需要改进的现象。',
    when: ['社会问题类作文', '需要引出争议或担忧时', '调查报告、评论性文章'],
    examples: [
      {
        en: 'Recently, the excessive use of smartphones among teenagers has aroused wide public concern.',
        cn: '近来，青少年过度使用智能手机引起了公众的广泛关注。',
        note: 'arouse concern 是固定搭配，意为"引起关注"。',
      },
      {
        en: 'Recently, food waste on campus has aroused wide public concern.',
        cn: '近来，校园里的食物浪费引起了公众的广泛关注。',
        note: '可用于"光盘行动""节约"类话题。',
      },
    ],
    variants: [
      '... has drawn considerable attention.',
      '... has become a matter of public concern.',
      'Much attention has been paid to ...',
    ],
    pitfall:
      'arouse 与 rise 形近但意义完全不同：arouse 是"引起（情绪/关注）"，rise 是"上升"。不要写成 "has risen wide public concern"。',
  },
  {
    id: 4,
    cat: 'opening',
    levels: ['cet6', 'kaoyan'],
    structure: 'When it comes to + 名词/动名词, opinions vary from person to person.',
    cn: '谈到……，人们看法不一。',
    usage:
      '用于"观点对立型"作文，一句话点明话题存在分歧，为下文"有人认为……另一些人认为……"的对照结构做铺垫。',
    when: ['存在两派观点的话题', '需要铺垫对比论证时', '议论性文章引入争议'],
    examples: [
      {
        en: 'When it comes to whether college students should take part-time jobs, opinions vary from person to person.',
        cn: '谈到大学生是否应该做兼职，人们看法不一。',
        note: 'comes to 后接名词或 whether/wh- 从句。',
      },
      {
        en: 'When it comes to choosing a career, opinions vary from person to person.',
        cn: '谈到择业，人们看法不一。',
        note: '也可换成 views differ sharply。',
      },
    ],
    variants: [
      'Opinions are divided on ...',
      'Views differ when it comes to ...',
      'There is no consensus on ...',
    ],
    pitfall:
      'come to 是固定搭配，不能写成 "When it comes about"。另外 to 是介词，后面接动名词而非动词原形。',
  },

  /* ============ 观点态度 ============ */
  {
    id: 5,
    cat: 'view',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'From my perspective, ... / As far as I am concerned, ...',
    cn: '在我看来／就我而言……',
    usage:
      '用于亮明个人立场。四六级作文通常要求在首段末或第二段开头给出明确观点，这两个短语比 "I think" 正式得多，能显著提升语言档次。',
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
  },
  {
    id: 6,
    cat: 'view',
    levels: ['cet6', 'kaoyan'],
    structure: 'It is my firm belief that + 从句',
    cn: '我坚信……',
    usage:
      '语气强于 "I think"，用于表达经过思考后的坚定判断，适合放在结论段或转折之后强化立场。',
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
    ],
    pitfall:
      'belief 是名词，所以用 it is my firm belief that，不能说 "I firmly believe that" 之外的混搭形式如 "It is my firm believe"。',
  },

  /* ============ 论证说理 ============ */
  {
    id: 7,
    cat: 'argue',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'There is no denying that + 从句',
    cn: '不可否认……',
    usage:
      '用于承认一个难以辩驳的事实，常作为论证的起点或让步的第一步。比 "Everyone knows" 更书面，也比 "It is obvious" 更有力。',
    when: ['论证开头承认客观事实', '让步结构的第一句', '强调论点不可辩驳时'],
    examples: [
      {
        en: 'There is no denying that the Internet has transformed the way we communicate.',
        cn: '不可否认，互联网已经改变了我们交流的方式。',
        note: 'the way 后接定语从句可省略 in which。',
      },
      {
        en: 'There is no denying that hard work is indispensable to success.',
        cn: '不可否认，努力对成功不可或缺。',
        note: 'be indispensable to 意为"对……不可或缺"。',
      },
    ],
    variants: [
      'It cannot be denied that ...',
      'There is no doubt that ...',
      'No one can deny that ...',
    ],
    pitfall:
      'denying 是动名词，不能写成 "There is no deny that"。另外该句型后面必须接完整从句，不能直接接名词。',
  },
  {
    id: 8,
    cat: 'argue',
    levels: ['cet6', 'kaoyan'],
    structure: 'What matters most is not A but B.',
    cn: '最重要的不是 A，而是 B。',
    usage:
      '用"否定 + 肯定"的对比结构突出真正的重点，观点鲜明、节奏感强，是阅卷老师眼中的"亮点句"，适合放在段落收尾或全文点题处。',
    when: ['需要突出核心论点时', '纠正常见误解后点明真相', '段落收尾强化观点'],
    examples: [
      {
        en: 'What matters most is not how much we earn but whether we find meaning in what we do.',
        cn: '最重要的不是我们赚多少，而是能否在工作中找到意义。',
        note: 'not ... but ... 连接两个并列成分，结构必须对称。',
      },
      {
        en: 'What matters most is not the quantity of friends but the quality of friendship.',
        cn: '最重要的不是朋友的数量，而是友谊的质量。',
        note: '可套用于"数量 vs 质量"类话题。',
      },
    ],
    variants: [
      'It is not A but B that counts.',
      'What counts is ...',
      'The essence lies not in A but in B.',
    ],
    pitfall:
      'what 引导的主语从句中 matters 是谓语动词，必须用第三人称单数。另外 not ... but ... 两侧必须同为名词、动名词或从句，不能一边名词一边句子。',
  },
  {
    id: 9,
    cat: 'argue',
    levels: ['cet4', 'cet6'],
    structure: 'It goes without saying that + 从句',
    cn: '不言而喻……',
    usage:
      '表达一个无需论证的常识性判断，用于快速建立共识，节省篇幅留给更重要的论证。',
    when: ['陈述公认常识', '论证的铺垫句', '需要简洁有力时'],
    examples: [
      {
        en: 'It goes without saying that a positive attitude helps us cope with difficulties.',
        cn: '不言而喻，积极的态度有助于我们应对困难。',
        note: 'cope with 意为"应对、处理"。',
      },
      {
        en: 'It goes without saying that protecting the environment is everyone\u2019s responsibility.',
        cn: '不言而喻，保护环境是每个人的责任。',
        note: '可用于环保类话题。',
      },
    ],
    variants: [
      'It is self-evident that ...',
      'Needless to say, ...',
      'It stands to reason that ...',
    ],
    pitfall:
      'goes 必须用第三人称单数；without saying 中间不加 the。不要与 "It goes without saying" 混淆为 "It goes without to say"。',
  },

  /* ============ 举例说明 ============ */
  {
    id: 10,
    cat: 'example',
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
      'in point 是固定搭配，不能写成 "a case in the point"。该句型后接名词短语或从句均可，但同一句中不要重复使用两个举例表达。',
  },
  {
    id: 11,
    cat: 'example',
    levels: ['cet4', 'cet6'],
    structure: 'Take + 名词 + for example, ...',
    cn: '以……为例，……',
    usage:
      '最灵活的举例句型，可插入句首或句中。适合需要快速举出日常例子（手机、外卖、网课）的段落。',
    when: ['日常现象类举例', '需要具体化抽象论点', '篇幅紧张时快速举例'],
    examples: [
      {
        en: 'Take food delivery apps for example, they have freed countless office workers from cooking.',
        cn: '以外卖应用为例，它们让无数上班族从做饭中解放出来。',
        note: '后半句也可用 and 连接，避免逗号连接两个独立句。',
      },
      {
        en: 'Take shared bikes for example, they offer a low-carbon way to travel short distances.',
        cn: '以共享单车为例，它们为短途出行提供了低碳方式。',
        note: 'low-carbon 意为"低碳的"。',
      },
    ],
    variants: [
      'Consider ... as an illustration.',
      '... serves as a typical example.',
      'To illustrate, ...',
    ],
    pitfall:
      'Take 后接名词宾格（me/him），不能接主格（I/he）。另外该句型本身不是完整句，后面需另起一个完整句子。',
  },

  /* ============ 对比转折 ============ */
  {
    id: 12,
    cat: 'contrast',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'While + 从句, 主句',
    cn: '虽然／然而……',
    usage:
      'while 引导让步或对比状语从句，一句之内完成"承认一方 + 强调另一方"，是高分作文中替代 but 的首选，能显著提升句式复杂度。',
    when: ['对比两种观点或现象', '让步后引出重点', '需要替换 but 时'],
    examples: [
      {
        en: 'While online shopping offers convenience, it also brings the risk of impulsive spending.',
        cn: '虽然网购带来便利，但它也带来冲动消费的风险。',
        note: 'while 在此表对比，前后主语不同。',
      },
      {
        en: 'While some people value stability, others prefer to take risks.',
        cn: '有些人看重稳定，另一些人则偏爱冒险。',
        note: 'others 与前句 some people 呼应。',
      },
    ],
    variants: [
      'Whereas ...',
      'Although ...',
      'Even though ...',
      'Much as ...',
    ],
    pitfall:
      'while 引导的从句中不能再用 but，即不能出现 "While ..., but ..." 的双重连接词错误，这是最常见的扣分点。',
  },
  {
    id: 13,
    cat: 'contrast',
    levels: ['cet4', 'cet6'],
    structure: 'On the one hand, ... On the other hand, ...',
    cn: '一方面……另一方面……',
    usage:
      '用于并列陈述一个事物的两面，结构清晰、逻辑对称，特别适合"利弊分析型"作文的第二段。',
    when: ['利弊分析', '并列两个对等论点', '需要结构对称时'],
    examples: [
      {
        en: 'On the one hand, social media keeps us informed; on the other hand, it may distract us from study.',
        cn: '一方面社交媒体让我们了解信息，另一方面它可能让我们分心。',
        note: '两个分句之间用分号连接，避免逗号拼接。',
      },
      {
        en: 'On the one hand, AI improves efficiency; on the other hand, it raises concerns about privacy.',
        cn: '一方面人工智能提升效率，另一方面它引发隐私担忧。',
        note: '可用于科技类话题。',
      },
    ],
    variants: [
      'For one thing, ... For another, ...',
      'In one respect, ... In another, ...',
    ],
    pitfall:
      '必须是 on the one hand / on the other hand，两个 the 都不能省。另外该结构只适用于"两方面"，不能用于列举三点。',
  },
  {
    id: 14,
    cat: 'contrast',
    levels: ['cet6', 'kaoyan'],
    structure: 'Compared with + 名词, ...',
    cn: '与……相比，……',
    usage:
      '用于比较两个对象，突出差异。常用于图表作文或"今昔对比"类话题，也是考研英语大作文的常用句式。',
    when: ['今昔对比', '图表数据比较', '突出某一方优势'],
    examples: [
      {
        en: 'Compared with traditional classrooms, online courses offer greater flexibility in time and place.',
        cn: '与传统课堂相比，在线课程在时间和地点上提供了更大灵活性。',
        note: 'compared with 作状语，逻辑主语须与主句一致。',
      },
      {
        en: 'Compared with a decade ago, people today attach greater importance to mental health.',
        cn: '与十年前相比，如今人们更重视心理健康。',
        note: 'attach importance to 意为"重视"。',
      },
    ],
    variants: [
      'In comparison with ...',
      'Unlike ...',
      'Relative to ...',
    ],
    pitfall:
      'compared with 是分词短语，其逻辑主语必须与主句主语一致。不能写成 "Compared with traditional classrooms, online courses\u2019 flexibility is greater"（比较对象不对等）。',
  },

  /* ============ 因果影响 ============ */
  {
    id: 15,
    cat: 'cause',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'This can be attributed to + 名词',
    cn: '这可以归因于……',
    usage:
      '用于分析原因，语气客观、学术性强。比 "because of" 高级得多，适合放在"原因分析"段落的开头。',
    when: ['分析现象背后的原因', '需要客观陈述时', '替换 because of'],
    examples: [
      {
        en: 'This can be attributed to the growing pressure of modern life.',
        cn: '这可以归因于现代生活日益增长的压力。',
        note: 'attribute A to B 意为"把 A 归因于 B"。',
      },
      {
        en: 'The decline in reading can be attributed to the popularity of short videos.',
        cn: '阅读量的下降可以归因于短视频的流行。',
        note: 'decline in 意为"……的下降"。',
      },
    ],
    variants: [
      'This is largely due to ...',
      'Several factors account for ...',
      '... stems from ...',
      '... arises from ...',
    ],
    pitfall:
      'attribute 的被动形式是 be attributed to，to 是介词，后接名词或动名词。不要写成 "be attributed by"。',
  },
  {
    id: 16,
    cat: 'cause',
    levels: ['cet4', 'cet6'],
    structure: '... contributes to + 名词',
    cn: '……有助于／导致……',
    usage:
      '既能表"有助于"（正面）也能表"导致"（负面），是因果关系中最通用的动词短语，可用于分析影响。',
    when: ['说明某事物的积极作用或消极影响', '分析结果', '提出建议的铺垫'],
    examples: [
      {
        en: 'Regular exercise contributes to both physical fitness and mental health.',
        cn: '规律锻炼有助于身体健康和心理健康。',
        note: '此处 contributes to 表正面作用。',
      },
      {
        en: 'Excessive screen time contributes to poor eyesight among teenagers.',
        cn: '过多的屏幕时间导致青少年视力下降。',
        note: '此处表负面结果。',
      },
    ],
    variants: [
      '... leads to ...',
      '... gives rise to ...',
      '... results in ...',
      '... is conducive to ...',
    ],
    pitfall:
      'contribute to 的 to 是介词，后接名词或动名词，不能接动词原形。若要表达"为……做贡献"，用 contribute to 后直接接名词即可。',
  },
  {
    id: 17,
    cat: 'cause',
    levels: ['cet6', 'kaoyan'],
    structure: 'The reason why + 从句 + is that + 从句',
    cn: '……的原因是……',
    usage:
      '用定语从句强调"原因"，句式复杂且有力量感，适合在原因分析段中作为主题句。',
    when: ['深入剖析某一现象的根本原因', '需要强调因果逻辑时', '段落主题句'],
    examples: [
      {
        en: 'The reason why so many students feel anxious is that they are under constant pressure to perform well.',
        cn: '这么多学生感到焦虑的原因是，他们长期承受着要表现优秀的压力。',
        note: 'why 引导定语从句，that 引导表语从句。',
      },
      {
        en: 'The reason why I admire him is that he never gives up in the face of failure.',
        cn: '我钦佩他的原因是，他在失败面前从不放弃。',
        note: 'in the face of 意为"面对"。',
      },
    ],
    variants: [
      'The main reason for ... is that ...',
      'What accounts for ... is that ...',
    ],
    pitfall:
      '必须是 why ... is that ...，不能写成 "The reason why ... is because ..."。reason 与 because 语义重复，是典型中式英语错误。',
  },

  /* ============ 让步反驳 ============ */
  {
    id: 18,
    cat: 'concession',
    levels: ['cet6', 'kaoyan'],
    structure: 'Admittedly, ... Nevertheless, ...',
    cn: '诚然……然而……',
    usage:
      '先承认对方观点的合理之处，再转折提出自己的立场。这种"先退后进"的写法能体现思辨能力，是六级和考研作文的加分项。',
    when: ['需要展现辩证思维时', '反驳对立观点', '论述的转折段落'],
    examples: [
      {
        en: 'Admittedly, technology has made our lives more efficient. Nevertheless, we should not let it dominate our attention.',
        cn: '诚然，科技让生活更高效。然而，我们不应让它支配我们的注意力。',
        note: '两句之间用句号断开，转折词另起一句更有力。',
      },
      {
        en: 'Admittedly, part-time jobs may take up some study time. Nevertheless, they build valuable social skills.',
        cn: '诚然，兼职会占用一些学习时间。然而，它们能培养宝贵的社交能力。',
        note: 'take up 意为"占用"。',
      },
    ],
    variants: [
      'Granted, ... However, ...',
      'It is true that ... but ...',
      'True, ... Yet ...',
    ],
    pitfall:
      'Admittedly 是副词，不能连接两个句子，必须用句号或分号隔开。不能写成 "Admittedly technology is efficient, nevertheless we..." 这样的逗号拼接。',
  },
  {
    id: 19,
    cat: 'concession',
    levels: ['cet4', 'cet6'],
    structure: 'Despite the fact that + 从句, 主句',
    cn: '尽管……',
    usage:
      'despite 是介词，后面本应接名词，加 the fact that 之后就能接完整句子，比 although 更正式。',
    when: ['让步状语', '需要正式语气时', '替换 although'],
    examples: [
      {
        en: 'Despite the fact that the task was demanding, the team finished it on schedule.',
        cn: '尽管任务艰巨，团队还是按时完成了。',
        note: 'on schedule 意为"按时"。',
      },
      {
        en: 'Despite the fact that he is young, he has rich experience.',
        cn: '尽管他很年轻，却经验丰富。',
        note: '注意不要与 but 连用。',
      },
    ],
    variants: [
      'In spite of the fact that ...',
      'Regardless of the fact that ...',
    ],
    pitfall:
      'despite 后不能直接接句子，必须加 the fact that。常见错误是 "Despite the task was hard"，这是语法错误。',
  },

  /* ============ 建议措施 ============ */
  {
    id: 20,
    cat: 'suggest',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'It is high time that we took measures to + 动词',
    cn: '是时候我们采取措施……了',
    usage:
      '用于"措施建议"段落的开头，语气带有紧迫感，能有效推动文章从"分析问题"转向"解决问题"。',
    when: ['提出对策的段落开头', '强调问题紧迫性', '结尾段建议部分'],
    examples: [
      {
        en: 'It is high time that we took measures to reduce plastic waste.',
        cn: '是我们采取措施减少塑料浪费的时候了。',
        note: 'that 从句用虚拟语气，动词用过去式 took。',
      },
      {
        en: 'It is high time that we took measures to protect intangible cultural heritage.',
        cn: '是我们采取措施保护非物质文化遗产的时候了。',
        note: 'intangible cultural heritage 意为"非物质文化遗产"。',
      },
    ],
    variants: [
      'It is about time that we ...',
      'There is an urgent need for us to ...',
      'The time has come for us to ...',
    ],
    pitfall:
      '该句型后接虚拟语气，从句谓语用过去式（took），不能用 take。这是四六级高频考点，也是常见错误。',
  },
  {
    id: 21,
    cat: 'suggest',
    levels: ['cet6', 'kaoyan'],
    structure: 'Only by + 动名词 + can we + 动词',
    cn: '只有通过……我们才能……',
    usage:
      'Only 引导的状语置于句首时主句要部分倒装，句式高级、语气坚决，非常适合放在结尾段作为收束全文的点睛句。',
    when: ['结尾段提出根本解决之道', '强调唯一有效途径', '需要倒装句式加分'],
    examples: [
      {
        en: 'Only by working together can we tackle the challenge of climate change.',
        cn: '只有共同努力，我们才能应对气候变化的挑战。',
        note: '主句 can we 为部分倒装。',
      },
      {
        en: 'Only by respecting nature can we achieve sustainable development.',
        cn: '只有尊重自然，我们才能实现可持续发展。',
        note: 'sustainable development 意为"可持续发展"。',
      },
    ],
    variants: [
      'It is only through ... that we can ...',
      'Not until ... can we ...',
    ],
    pitfall:
      'Only + 状语置于句首，主句必须部分倒装（can we 而非 we can）。若 Only 修饰主语则不倒装，这是易混点。',
  },
  {
    id: 22,
    cat: 'suggest',
    levels: ['cet4', 'cet6'],
    structure: 'Greater efforts should be made to + 动词',
    cn: '应当付出更大努力去……',
    usage:
      '被动语态的建议句，语气客观、不针对个人，特别适合"政府/学校/社会应当如何"类的措施段。',
    when: ['提出社会层面的建议', '需要客观语气', '措施段的主干句'],
    examples: [
      {
        en: 'Greater efforts should be made to promote reading among young people.',
        cn: '应当付出更大努力在年轻人中推广阅读。',
        note: 'promote 意为"推广、促进"。',
      },
      {
        en: 'Greater efforts should be made to narrow the gap between urban and rural education.',
        cn: '应当付出更大努力缩小城乡教育差距。',
        note: 'narrow the gap 意为"缩小差距"。',
      },
    ],
    variants: [
      'More attention should be paid to ...',
      'Effective measures should be taken to ...',
      'It is advisable that ... be done.',
    ],
    pitfall:
      'efforts 用复数，且 make efforts to 后接动词原形。不要写成 "make greater effort to doing"。',
  },

  /* ============ 结尾总结 ============ */
  {
    id: 23,
    cat: 'conclusion',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'Taking all these factors into consideration, we may safely conclude that + 从句',
    cn: '综合考虑以上因素，我们可以有把握地得出结论：……',
    usage:
      '结论段的经典句式，用分词短语作状语统领全段，体现"总结前文"的逻辑，比简单的 "In conclusion" 更有层次。',
    when: ['全文最后一段开头', '需要总结多个论点时', '考研英语大作文结尾'],
    examples: [
      {
        en: 'Taking all these factors into consideration, we may safely conclude that lifelong learning is no longer optional but essential.',
        cn: '综合考虑以上因素，我们可以得出结论：终身学习不再是一种选择，而是必需。',
        note: 'no longer ... but ... 意为"不再是……而是……"。',
      },
      {
        en: 'Taking all these factors into consideration, we may safely conclude that a balanced diet is the foundation of good health.',
        cn: '综合考虑以上因素，我们可以得出结论：均衡饮食是健康的基础。',
        note: '可用于健康类话题。',
      },
    ],
    variants: [
      'In light of the above analysis, ...',
      'On the basis of the discussion above, ...',
      'All things considered, ...',
    ],
    pitfall:
      'taking 是分词，其逻辑主语须与主句主语一致（we）。另外 conclude 后接 that 从句，不能直接接名词。',
  },
  {
    id: 24,
    cat: 'conclusion',
    levels: ['cet4', 'cet6'],
    structure: 'To sum up, ... plays an irreplaceable role in ...',
    cn: '总之，……在……中扮演着不可替代的角色',
    usage:
      '结尾段的收束句，用 irreplaceable 这类强语气形容词强调重要性，简洁有力，适合篇幅有限的四六级作文。',
    when: ['结尾段总结', '强调某事物的重要性', '需要简洁收尾时'],
    examples: [
      {
        en: 'To sum up, reading plays an irreplaceable role in shaping one\u2019s character.',
        cn: '总之，阅读在塑造人的品格方面扮演着不可替代的角色。',
        note: 'shape 在此作动词，意为"塑造"。',
      },
      {
        en: 'To sum up, mutual trust plays an irreplaceable role in maintaining friendship.',
        cn: '总之，相互信任在维持友谊中扮演着不可替代的角色。',
        note: 'maintain 意为"维持"。',
      },
    ],
    variants: [
      'In conclusion, ... is of vital importance to ...',
      'To conclude, ... is central to ...',
      'All in all, ... is indispensable to ...',
    ],
    pitfall:
      'play a role in 中的 role 前必须有冠词 a/an，不能漏掉。另外该句型后接名词或动名词，不能接句子。',
  },

  /* ============ 数据图表 ============ */
  {
    id: 25,
    cat: 'data',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'The past decade has witnessed a sharp rise in + 名词',
    cn: '过去十年见证了……的急剧上升',
    usage:
      '图表作文的黄金句式。用 witnessed（见证）把时间作主语，句式新颖且地道，能立刻拉开与 "The number increased" 的差距。',
    when: ['图表作文描述趋势', '需要描述时间跨度变化', '数据上升类'],
    examples: [
      {
        en: 'The past decade has witnessed a sharp rise in the number of electric vehicles.',
        cn: '过去十年见证了电动汽车数量的急剧上升。',
        note: 'sharp rise 意为"急剧上升"。',
      },
      {
        en: 'The past five years have witnessed a steady growth in online learning.',
        cn: '过去五年见证了在线学习的稳步增长。',
        note: '主语为复数年份时用 have witnessed。',
      },
    ],
    variants: [
      'Recent years have seen a dramatic increase in ...',
      'There has been a marked growth in ... over the past decade.',
    ],
    pitfall:
      '主语是 the past decade（单数）用 has witnessed；若是 the past five years 则用 have witnessed。另外 rise/growth 后接 in + 名词。',
  },
  {
    id: 26,
    cat: 'data',
    levels: ['cet6', 'kaoyan'],
    structure: 'The figure climbed from + 数字 + to + 数字, accounting for + 百分比 + of the total.',
    cn: '该数字从……上升到……，占总量……%',
    usage:
      '精确描述数据变化及占比，常用于图表作文的第二句——先描述变化，再补充占比，信息完整。',
    when: ['图表作文描述具体数据', '需要说明占比', '数据对比分析'],
    examples: [
      {
        en: 'The figure climbed from 12 percent to 38 percent, accounting for over a third of the total.',
        cn: '该数字从 12% 上升到 38%，占总量三分之一以上。',
        note: 'accounting for 为分词短语作状语，表补充说明。',
      },
      {
        en: 'The proportion doubled from 15 percent to 30 percent, accounting for nearly one third of the total.',
        cn: '该比例从 15% 翻倍至 30%，占总量近三分之一。',
        note: 'double 可作动词表示"翻倍"。',
      },
    ],
    variants: [
      'The percentage rose from ... to ..., making up ... of the total.',
      '... experienced a twofold increase, taking up ... percent.',
    ],
    pitfall:
      'account for 在此表"占（比例）"，用现在分词 accounting for 作状语时其逻辑主语须是前面的 the figure。另外 percent 与 percentage 不可混用。',
  },

  /* ============ 书信应用 ============ */
  {
    id: 27,
    cat: 'letter',
    levels: ['cet4', 'cet6'],
    structure: 'I am writing to express my sincere gratitude for + 名词/动名词',
    cn: '我写信是为了对……表达诚挚的感谢',
    usage:
      '感谢信的第一句，直接点明写信目的。书信类作文要求"开门见山"，这一句既完成了目的陈述，又保持了正式语气。',
    when: ['感谢信开头', '书信作文表明目的', '需要正式书信语气时'],
    examples: [
      {
        en: 'I am writing to express my sincere gratitude for your generous help during my stay in Beijing.',
        cn: '我写信是为了感谢您在我北京期间给予的慷慨帮助。',
        note: 'for 后接名词或动名词短语。',
      },
      {
        en: 'I am writing to express my sincere gratitude for the warm reception you gave me.',
        cn: '我写信是为了感谢您对我的热情接待。',
        note: 'reception 意为"接待"。',
      },
    ],
    variants: [
      'I am writing to convey my heartfelt thanks for ...',
      'I would like to take this opportunity to thank you for ...',
    ],
    pitfall:
      '书信开头不要写 "I am writing to you for..."，直接写写信目的即可。另外 gratitude 后接 for，不接 to。',
  },
  {
    id: 28,
    cat: 'letter',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'I would appreciate it if you could + 动词',
    cn: '如果您能……我将不胜感激',
    usage:
      '书信正文提出请求的礼貌表达。用虚拟语气 would 和 if 从句使请求显得委婉，是应用文的高分句式。',
    when: ['书信中提出请求', '需要礼貌委婉语气', '建议信、申请信正文'],
    examples: [
      {
        en: 'I would appreciate it if you could take my application into consideration.',
        cn: '如果您能考虑我的申请，我将不胜感激。',
        note: 'take ... into consideration 意为"考虑"。',
      },
      {
        en: 'I would appreciate it if you could offer me some advice on how to improve my English writing.',
        cn: '如果您能就如何提高英语写作给我一些建议，我将不胜感激。',
        note: 'how to do 作 on 的宾语。',
      },
    ],
    variants: [
      'I would be grateful if you could ...',
      'It would be highly appreciated if you could ...',
      'I wonder if you could possibly ...',
    ],
    pitfall:
      'it 是形式宾语，不能省略，即不能写成 "I would appreciate if you could"。这是书信类作文最高频的错误之一。',
  },
  {
    id: 29,
    cat: 'letter',
    levels: ['cet4', 'cet6'],
    structure: 'I am writing to apply for the position of + 职位 + advertised in + 渠道',
    cn: '我写信是为了申请在……上刊登的……职位',
    usage:
      '求职信／申请信的第一句，一句话交代"申请什么"和"从哪得知"，信息密度高，符合应用文简洁明确的要求。',
    when: ['求职信、申请信开头', '需要交代信息来源', '正式应用文'],
    examples: [
      {
        en: 'I am writing to apply for the position of English teacher advertised on your website.',
        cn: '我写信是为了申请贵网站刊登的英语教师职位。',
        note: 'advertised 为过去分词作后置定语。',
      },
      {
        en: 'I am writing to apply for the position of volunteer advertised in the campus newspaper.',
        cn: '我写信是为了申请校报刊登的志愿者岗位。',
        note: 'volunteer 在此作名词，指志愿岗位。',
      },
    ],
    variants: [
      'I am writing in response to your advertisement for ...',
      'I wish to apply for the post of ...',
    ],
    pitfall:
      'position of 后接职位名词，不要加冠词（position of English teacher 而非 position of an English teacher）。advertised 作后置定语时用过去分词，因为广告是被刊登的。',
  },
  {
    id: 30,
    cat: 'letter',
    levels: ['cet6', 'kaoyan'],
    structure: 'I would like to suggest that + 从句 (should) + 动词原形',
    cn: '我想建议……',
    usage:
      '建议信的核心句式。suggest 后接 that 从句要用虚拟语气 (should) do，体现正式书面语特征，是六级应用文的加分点。',
    when: ['建议信提出具体建议', '需要虚拟语气', '正式场合提建议'],
    examples: [
      {
        en: 'I would like to suggest that the library (should) extend its opening hours during the exam week.',
        cn: '我想建议图书馆在考试周延长开放时间。',
        note: 'should 可省略，后接动词原形 extend。',
      },
      {
        en: 'I would like to suggest that more elective courses (should) be offered to students.',
        cn: '我想建议为学生开设更多选修课。',
        note: '被动式用 (should) be offered。',
      },
    ],
    variants: [
      'It would be advisable for you to ...',
      'I recommend that ... (should) ...',
      'My suggestion is that ... (should) ...',
    ],
    pitfall:
      'suggest 表"建议"时从句用虚拟语气 (should) + 动词原形；但表"暗示、表明"时用陈述语气。这是六级语法高频考点。',
  },
]
