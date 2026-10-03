/**
 * 开篇引入 · 7 句
 * 功能：首段交代背景、引出话题、制造张力。
 */
export default [
  {
    cat: 'opening',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'It is universally acknowledged that + 从句',
    cn: '众所周知，……',
    usage:
      '首段第一句，交代一个被普遍接受的事实，为后文论点铺路。语气正式、立场中立，是最稳妥的开篇方式。但也正因为稳妥而极易撞句，建议全文只用一次，并紧跟一句具体现象把套话落地。',
    when: ['议论文首段引入背景', '需要强调观点具有普遍性时', '正式书面语、学术写作'],
    examples: [
      {
        en: 'It is universally acknowledged that a healthy diet contributes to both physical and mental well-being.',
        cn: '众所周知，健康的饮食对身心健康都有益处。',
        note: 'that 引导主语从句，it 是形式主语，两者缺一不可。',
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
      'Few people would deny that ...',
      'It is commonly held that ...',
    ],
    pitfall:
      'acknowledge 的被动语态必须保留形式主语 it，不能写成 "It universally acknowledged that"；that 后必须接完整句子，不能只接名词短语。',
    upgrade: {
      from: 'Everyone knows that reading is important.',
      to: 'It is universally acknowledged that reading is indispensable to personal growth.',
    },
  },

  {
    cat: 'opening',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'When it comes to + 名词/动名词, opinions vary from person to person.',
    cn: '谈到……，人们看法不一。',
    usage:
      '一句话同时完成"切换话题"和"引出分歧"两件事，比 Nowadays 更有推进感。适合首段点题之后转入讨论，或第二段换论点时作为过渡。',
    when: ['引出有争议的话题', '从一个论点过渡到另一个', '首段点题后转入具体讨论'],
    examples: [
      {
        en: 'When it comes to choosing a career, opinions vary from person to person.',
        cn: '谈到职业选择，人们看法不一。',
        note: 'to 是介词，后面用动名词 choosing。',
      },
      {
        en: 'When it comes to reducing carbon emissions, opinions vary from person to person.',
        cn: '在减少碳排放的问题上，人们观点各异。',
        note: '可用于环保、科技类话题。',
      },
    ],
    variants: [
      'Views differ widely when it comes to ...',
      'Opinions are divided on the issue of ...',
      'There is no consensus on ...',
    ],
    pitfall:
      'to 是介词，后接名词或动名词，不能接动词原形（× When it comes to choose a career）。',
    upgrade: {
      from: 'People have different ideas about career choice.',
      to: 'When it comes to career choice, opinions vary from person to person.',
    },
  },

  {
    cat: 'opening',
    tier: 'advanced',
    form: 'nominal',
    levels: ['cet6', 'kaoyan'],
    structure: 'The past decade has witnessed a dramatic shift in + 名词',
    cn: '过去十年见证了……的巨大转变。',
    usage:
      '用"时间"作主语（无灵主语），把"发生了变化"写成客观事实，语气比人作主语沉稳得多。适合科技、社会、教育类话题交代背景，比 With the development of 高一个档次。',
    when: ['交代时代背景', '描述长期变化趋势', '图表作文开头定调'],
    examples: [
      {
        en: 'The past decade has witnessed a dramatic shift in the way people acquire knowledge.',
        cn: '过去十年见证了人们获取知识方式的剧变。',
        note: 'witness 在此意为"见证"，主语是时间而非人。',
      },
      {
        en: 'The past decade has witnessed a dramatic shift in public attitudes towards mental health.',
        cn: '过去十年间，公众对心理健康的看法发生了巨大转变。',
        note: '可用于社会民生类话题。',
      },
    ],
    variants: [
      'Recent years have seen a marked change in ...',
      'The last few years have brought about a profound transformation in ...',
      'We have witnessed a sweeping change in ...',
    ],
    pitfall:
      'witness 的主语应是时间、地点或事件这类无生命名词，不能写成 "People have witnessed the past decade" 这种主客颠倒的句子。',
    upgrade: {
      from: 'With the development of technology, the way we learn has changed a lot.',
      to: 'The past decade has witnessed a dramatic shift in the way we acquire knowledge.',
    },
  },

  {
    cat: 'opening',
    tier: 'advanced',
    form: 'comparative',
    levels: ['cet6', 'kaoyan'],
    structure: 'Few issues have aroused such heated debate as + 名词',
    cn: '很少有议题像……这样引发如此激烈的争论。',
    usage:
      '用"否定 + 比较"抬高话题分量，暗示没有比这更受关注的事。开场即有张力，是阅卷老师一眼能认出的亮点结构。',
    when: ['引出社会热点', '首段营造讨论氛围', '需要强调话题重要性时'],
    examples: [
      {
        en: 'Few issues have aroused such heated debate as the impact of artificial intelligence on employment.',
        cn: '很少有议题像人工智能对就业的影响这样引发如此激烈的争论。',
        note: 'such ... as 构成比较结构，as 后接被比较的对象。',
      },
      {
        en: 'Few issues have aroused such heated debate as the balance between study and rest.',
        cn: '很少有话题像学习与休息的平衡这样引起如此激烈的讨论。',
        note: '适合学生生活类话题。',
      },
    ],
    variants: [
      'Rarely has a topic provoked such intense discussion as ...',
      'No issue is more hotly debated than ...',
      'Nothing has generated more controversy than ...',
    ],
    pitfall:
      '该结构本身已含否定（few），不能再加 not；such 后接名词短语，不要写成 "such heated debate like"。',
    upgrade: {
      from: 'AI and jobs is a hot topic now.',
      to: 'Few issues have aroused such heated debate as the impact of AI on employment.',
    },
  },

  {
    cat: 'opening',
    tier: 'advanced',
    form: 'clause',
    levels: ['cet6', 'kaoyan'],
    structure: 'What merits our close attention is not + A but + B',
    cn: '真正值得我们关注的不是 A，而是 B。',
    usage:
      '用主语从句把"真正值得关注的东西"提到句首，先否定表面现象再点出本质，观点鲜明、层次清楚。适合首段末立论，或纠正普遍误解后亮出核心论点。',
    when: ['纠正普遍误解后点明重点', '首段末亮出核心论点', '需要突出本质问题时'],
    examples: [
      {
        en: 'What merits our close attention is not the speed of technological change but our capacity to adapt to it.',
        cn: '真正值得我们关注的不是技术变革的速度，而是我们适应它的能力。',
        note: 'not ... but ... 两侧结构必须对称。',
      },
      {
        en: 'What merits our close attention is not how much we learn but how well we apply it.',
        cn: '真正值得关注的不是我们学了多少，而是我们运用得多好。',
        note: '可用于教育、学习方法类话题。',
      },
    ],
    variants: [
      'What deserves our attention is ...',
      'It is not A but B that warrants our concern.',
      'The real issue lies not in A but in B.',
    ],
    pitfall:
      'what 引导的主语从句中 merits 是谓语，须用第三人称单数；not ... but ... 两侧词性必须一致。',
    upgrade: {
      from: 'The real problem is not technology but people.',
      to: 'What merits our close attention is not technology itself but our capacity to adapt to it.',
    },
  },

  {
    cat: 'opening',
    tier: 'expert',
    form: 'inversion',
    levels: ['cet6', 'kaoyan'],
    structure: 'So prevalent has + 名词 + become that + 从句',
    cn: '……已如此普遍，以至于……',
    usage:
      '把 so + 形容词提到句首引发完全倒装，节奏强、气势足，天然带有"程度之深以至于……"的推进感。放在首段能瞬间拉开语言档次，属于冲刺高分的句式。',
    when: ['描述普遍到极点的现象', '首段强调问题严重性', '需要一句"镇住"阅卷老师的句子'],
    examples: [
      {
        en: 'So prevalent has online shopping become that physical stores are struggling to survive.',
        cn: '网络购物已如此普遍，以至于实体店举步维艰。',
        note: '倒装后助动词 has 提到主语之前，become 留在句末。',
      },
      {
        en: 'So deeply has social media permeated our daily lives that few can imagine a day without it.',
        cn: '社交媒体已如此深入地渗透进我们的日常生活，以至于很少有人能想象没有它的一天。',
        note: '副词 deeply 提前同样触发倒装。',
      },
    ],
    variants: [
      'So widespread is X that ...',
      'So severe has the problem become that ...',
      'To such an extent has X grown that ...',
    ],
    pitfall:
      '倒装只把助动词或 be 动词提前，实义动词留在主语之后；"So prevalent online shopping has become" 是错的。',
    upgrade: {
      from: 'Online shopping is very popular now, so stores are in trouble.',
      to: 'So prevalent has online shopping become that physical stores are struggling to survive.',
    },
  },

  {
    cat: 'opening',
    tier: 'expert',
    form: 'inversion',
    levels: ['cet6', 'kaoyan'],
    structure: 'Never before has the importance of + 名词 + been so keenly felt.',
    cn: '……的重要性从未像今天这样被人们深切感受到。',
    usage:
      '否定词置于句首构成部分倒装，用"前所未有"强调当下问题的紧迫性。适合环境、教育公平、科技伦理等重大议题的开篇定调，也可在结尾回扣。',
    when: ['强调问题前所未有地紧迫', '重大议题开篇定调', '结尾回扣主题'],
    examples: [
      {
        en: 'Never before has the importance of environmental protection been so keenly felt.',
        cn: '环境保护的重要性从未像今天这样被人们深切感受到。',
        note: '倒装后主语 the importance 位于 has 之后，been felt 为被动语态。',
      },
      {
        en: 'Never before has the need for critical thinking been so keenly felt.',
        cn: '批判性思维的必要性从未如此迫切。',
        note: '可用于信息时代、教育类话题。',
      },
    ],
    variants: [
      'Never has X been more urgent.',
      'At no time has X mattered more.',
      'Rarely has X been so widely recognized.',
    ],
    pitfall:
      '否定词提前后必须部分倒装；"Never before the importance has been felt" 未倒装即错。另注意 been so keenly felt 是被动语态，felt 不能丢。',
    upgrade: {
      from: 'Environmental protection is more important than ever.',
      to: 'Never before has the importance of environmental protection been so keenly felt.',
    },
  },
]
