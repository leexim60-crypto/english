/**
 * 论证说理 · 6 句
 * 功能：提出论据、推进逻辑、把道理讲透。
 */
export default [
  {
    cat: 'argue',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'There is no denying that + 从句',
    cn: '不可否认，……',
    usage:
      '承认一个难以辩驳的事实，常作为论证的起点或让步的第一步。比 "Everyone knows" 更书面，也比 "It is obvious" 更有力。',
    when: ['论证开头承认客观事实', '让步结构的第一句', '强调论点不可辩驳时'],
    examples: [
      {
        en: 'There is no denying that the Internet has transformed the way we communicate.',
        cn: '不可否认，互联网已经改变了我们交流的方式。',
        note: 'the way 后的定语从句可省略 in which。',
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
      'denying 是动名词，不能写成 "There is no deny that"；该句型后必须接完整从句，不能直接接名词。',
    upgrade: {
      from: 'Everyone knows the Internet changed how we talk.',
      to: 'There is no denying that the Internet has transformed the way we communicate.',
    },
  },

  {
    cat: 'argue',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6'],
    structure: 'What matters most is not A but B.',
    cn: '最重要的不是 A，而是 B。',
    usage:
      '用"否定 + 肯定"的对比结构突出真正的重点，观点鲜明、节奏感强，是阅卷老师眼中的亮点句，适合放在段落收尾或全文点题处。',
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
      'what 引导的主语从句中 matters 是谓语，必须用第三人称单数；not ... but ... 两侧必须同为名词、动名词或从句。',
    upgrade: {
      from: 'The quality of friends is more important than the number.',
      to: 'What matters most is not the quantity of friends but the quality of friendship.',
    },
  },

  {
    cat: 'argue',
    tier: 'advanced',
    form: 'cleft',
    levels: ['cet6', 'kaoyan'],
    structure: 'It is + 被强调部分 + that + 句子其余部分',
    cn: '正是……才……',
    usage:
      '强调句型，把最想让阅卷老师看到的部分推到 it is 之后。它是"很高级"句式中最容易写对、性价比最高的一种，适合强调原因、主体或方式。',
    when: ['强调原因或主体', '段落核心句需要加重语气', '反驳"只怪某一方"的片面看法'],
    examples: [
      {
        en: 'It is the collaboration between individuals and governments that ultimately drives social progress.',
        cn: '正是个人与政府之间的协作最终推动了社会进步。',
        note: '强调主语 the collaboration；去掉 it is ... that 后句子仍完整。',
      },
      {
        en: 'It is not the tools themselves but the way we use them that determines the outcome.',
        cn: '决定结果的不是工具本身，而是我们使用它们的方式。',
        note: '强调主语且带 not ... but ... 对比，句式更亮。',
      },
    ],
    variants: [
      'It is ... that ... （强调主语/宾语/状语）',
      'It was not until ... that ...',
      'What ... is ... （主语从句式强调）',
    ],
    pitfall:
      '判断方法：去掉 it is 和 that 后句子依然成立，才是强调句；若原句缺主语则是主语从句。强调人时可用 who，强调其他成分只能用 that。',
    upgrade: {
      from: 'Individuals and governments work together and drive progress.',
      to: 'It is the collaboration between individuals and governments that ultimately drives social progress.',
    },
  },

  {
    cat: 'argue',
    tier: 'advanced',
    form: 'nominal',
    levels: ['cet6', 'kaoyan'],
    structure: 'It is worth noting that + 从句',
    cn: '值得注意的是，……',
    usage:
      '用形式主语把一个补充论据自然带出，语气客观克制，不会像 "Also" 那样显得随意。适合在主体段补充第二层论证，或在结论前补一句关键限定。',
    when: ['主体段补充第二层论据', '提示读者注意关键细节', '结论前补充限定条件'],
    examples: [
      {
        en: 'It is worth noting that the same technology can either widen or narrow the educational gap.',
        cn: '值得注意的是，同一项技术既可能扩大也可能缩小教育差距。',
        note: 'either ... or ... 表示两种可能并存。',
      },
      {
        en: 'It is worth noting that short-term convenience often comes at the cost of long-term well-being.',
        cn: '值得注意的是，短期的便利往往以长期的福祉为代价。',
        note: 'at the cost of 意为"以……为代价"。',
      },
    ],
    variants: [
      'It is noteworthy that ...',
      'It deserves mention that ...',
      'What is particularly striking is that ...',
    ],
    pitfall:
      'worth 后接动名词（worth noting），不能写成 "worth to note"；若改用 worthy 则须说 be worthy of note。',
    upgrade: {
      from: 'Also, technology can make education better or worse.',
      to: 'It is worth noting that the same technology can either widen or narrow the educational gap.',
    },
  },

  {
    cat: 'argue',
    tier: 'advanced',
    form: 'absolute',
    levels: ['cet6', 'kaoyan'],
    structure: 'Other things being equal, + 主句',
    cn: '在其他条件相同的情况下，……',
    usage:
      '独立主格结构作条件状语，用极简的形式表达严谨的前提限定。这是学术写作的标志性表达，用在论证段能显著提升逻辑严密感。',
    when: ['需要设定讨论前提', '学术化论证', '避免绝对化表述时'],
    examples: [
      {
        en: 'Other things being equal, students who read widely tend to perform better in language tests.',
        cn: '在其他条件相同的情况下，广泛阅读的学生往往在语言测试中表现更好。',
        note: 'Other things 与 being 构成独立主格，相当于 If other things are equal。',
      },
      {
        en: 'Other things being equal, a well-designed policy is more likely to win public support.',
        cn: '在其他条件相同的情况下，设计良好的政策更可能赢得公众支持。',
        note: '适合社会政策类话题。',
      },
    ],
    variants: [
      'All else being equal, ...',
      'Given the same conditions, ...',
      'Provided that other factors remain unchanged, ...',
    ],
    pitfall:
      '独立主格中 being 不能换成 is/are，因为它不是完整句子；主句主语与 Other things 不同，故不能用分词短语。',
    upgrade: {
      from: 'If everything is the same, reading students do better.',
      to: 'Other things being equal, students who read widely tend to perform better in language tests.',
    },
  },

  {
    cat: 'argue',
    tier: 'expert',
    form: 'participle',
    levels: ['cet6', 'kaoyan'],
    structure: 'Coupled with + 名词, + 主句',
    cn: '再加上……，……',
    usage:
      '用过去分词短语在句首叠加第二个因素，把"因果 + 递进"压缩进一个句子，避免连续使用 and 或 moreover。适合论证段把两个原因合并表达。',
    when: ['合并两个并列原因', '递进补充论据', '避免频繁使用 and 时'],
    examples: [
      {
        en: 'Coupled with the rising cost of living, stagnant wages have made saving increasingly difficult for young people.',
        cn: '再加上生活成本上涨，工资停滞使年轻人越来越难存下钱。',
        note: 'Coupled with 的逻辑主语应与主句主语一致或为独立因素。',
      },
      {
        en: 'Coupled with easy access to information, critical thinking has become the scarcest resource of our age.',
        cn: '再加上信息获取极为便利，批判性思维已成为这个时代最稀缺的资源。',
        note: '适合信息时代、教育类话题。',
      },
    ],
    variants: [
      'Combined with ...',
      'Together with ...',
      'When combined with ..., ...',
    ],
    pitfall:
      'Coupled with 是过去分词短语，逻辑上修饰主句主语，因此主语必须是该因素能修饰的对象；不可写成 "Coupling with"。',
    upgrade: {
      from: 'Living costs are rising and wages are not, so young people cannot save money.',
      to: 'Coupled with the rising cost of living, stagnant wages have made saving increasingly difficult for young people.',
    },
  },
]
