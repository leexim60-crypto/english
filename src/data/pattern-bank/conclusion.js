/**
 * 结尾总结 · 5 句
 * 功能：收束全文、升华主题、留下余味。
 */
export default [
  {
    cat: 'conclusion',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'Taking all these factors into consideration, we may safely conclude that + 从句',
    cn: '综合以上因素，我们可以有把握地得出结论：……',
    usage:
      '标准的总结句，把前文论述打包成一句结论。安全性极高，适合作为结尾段第一句，之后再补一句展望即可。',
    when: ['结尾段第一句', '归纳全文论点', '需要稳妥收束时'],
    examples: [
      {
        en: 'Taking all these factors into consideration, we may safely conclude that reading habits shape the way we think.',
        cn: '综合以上因素，我们可以有把握地得出结论：阅读习惯塑造我们的思维方式。',
        note: 'we may safely conclude that 后接宾语从句。',
      },
      {
        en: 'Taking all these factors into consideration, we may safely conclude that technology is a means rather than an end.',
        cn: '综合以上因素，我们可以有把握地得出结论：技术是手段而非目的。',
        note: 'a means rather than an end 是常用升华表达。',
      },
    ],
    variants: [
      'In light of the above analysis, it is reasonable to conclude that ...',
      'All things considered, ...',
      'From what has been discussed above, we can draw the conclusion that ...',
    ],
    pitfall:
      '该结构是分词短语作状语，逻辑主语须与主句主语一致（都是 we）；不要写成 "Taking all these factors into consideration, the conclusion is ..."。',
    upgrade: {
      from: 'So reading habits are important.',
      to: 'Taking all these factors into consideration, we may safely conclude that reading habits shape the way we think.',
    },
  },

  {
    cat: 'conclusion',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: '... plays an irreplaceable role in ...',
    cn: '……在……中发挥着不可替代的作用。',
    usage:
      '一句高度凝练的价值判断，适合在结尾回扣主题词，把全文论点收拢到核心概念上。',
    when: ['结尾回扣主题', '强调某事物的重要性', '总结段收束'],
    examples: [
      {
        en: 'In a word, curiosity plays an irreplaceable role in lifelong learning.',
        cn: '总之，好奇心在终身学习中发挥着不可替代的作用。',
        note: 'In a word 是简短的总结标志词。',
      },
      {
        en: 'Ultimately, mutual trust plays an irreplaceable role in any lasting cooperation.',
        cn: '归根结底，互信在任何持久合作中都发挥着不可替代的作用。',
        note: '适合合作、诚信类话题。',
      },
    ],
    variants: [
      '... is indispensable to ...',
      '... serves as the cornerstone of ...',
      'No ... can be achieved without ...',
    ],
    pitfall:
      'role 后接 in + 名词/动名词；irreplaceable 不要误拼为 irreplacable（注意 -eable 前有 c 时保留 e 的规则）。',
    upgrade: {
      from: 'Curiosity is very important for learning.',
      to: 'Curiosity plays an irreplaceable role in lifelong learning.',
    },
  },

  {
    cat: 'conclusion',
    tier: 'advanced',
    form: 'comparative',
    levels: ['cet6', 'kaoyan'],
    structure: 'Only when + 从句 + will + 主语 + 动词',
    cn: '只有当……，……才会……',
    usage:
      'Only when 引导状语从句置于句首，主句倒装。把条件与结果紧密绑定，结论更有力度，适合结尾段提出"前提式"展望。',
    when: ['结尾段提出前提条件', '强调条件的必要性', '替代简单的 If ... will ...'],
    examples: [
      {
        en: 'Only when individuals and institutions share responsibility will environmental protection move beyond slogans.',
        cn: '只有当个人与机构共同担责，环境保护才能超越口号。',
        note: '主句倒装为 will environmental protection move。',
      },
      {
        en: 'Only when we learn to question will knowledge become genuine understanding.',
        cn: '只有当我们学会质疑，知识才会变成真正的理解。',
        note: '适合教育与思维类话题。',
      },
    ],
    variants: [
      'It is only when ... that ...',
      'Only if ... will ...',
      'Not until ... will ...',
    ],
    pitfall:
      'Only 修饰状语从句置于句首时，倒装发生在主句而非从句；从句本身用陈述语序。',
    upgrade: {
      from: 'If everyone takes responsibility, environment protection will work.',
      to: 'Only when individuals and institutions share responsibility will environmental protection move beyond slogans.',
    },
  },

  {
    cat: 'conclusion',
    tier: 'advanced',
    form: 'nominal',
    levels: ['cet6', 'kaoyan'],
    structure: 'What remains to be seen is whether + 从句',
    cn: '仍有待观察的是，……是否……',
    usage:
      '用"留白"的方式结尾，承认不确定性而非强行下结论，显得思考审慎、有分寸。适合作文结尾的最后一笔，也适合评论类写作。',
    when: ['结尾段留有余味', '避免绝对化结论', '评论类作文收束'],
    examples: [
      {
        en: 'What remains to be seen is whether these policies will translate into real change on the ground.',
        cn: '仍有待观察的是，这些政策能否转化为实实在在的改变。',
        note: 'translate into 意为"转化为"。',
      },
      {
        en: 'What remains to be seen is whether a generation raised online can rediscover the value of deep reading.',
        cn: '仍有待观察的是，在网络中成长的一代能否重新发现深度阅读的价值。',
        note: '适合阅读与媒介类话题。',
      },
    ],
    variants: [
      'It remains to be seen whether ...',
      'Only time will tell whether ...',
      'Whether ... is still an open question.',
    ],
    pitfall:
      'whether 引导主语从句或表语从句，不能用 if 替换（介词后、句首均须用 whether）。',
    upgrade: {
      from: 'We do not know if these policies will work.',
      to: 'What remains to be seen is whether these policies will translate into real change on the ground.',
    },
  },

  {
    cat: 'conclusion',
    tier: 'expert',
    form: 'rhetorical',
    levels: ['cet6', 'kaoyan'],
    structure: 'Only by doing so can we ... , and only then will ...',
    cn: '唯有如此，我们才能……；也只有到那时，……才会……',
    usage:
      '两个倒装结构并列推进，先给方法再给愿景，节奏层层升高，是结尾段最能"提气"的写法。适合需要升华主题的议论文。',
    when: ['结尾升华主题', '方法与愿景并列', '冲刺满分结尾'],
    examples: [
      {
        en: 'Only by valuing substance over appearance can we build a healthier society, and only then will true progress become possible.',
        cn: '唯有重视实质而非表象，我们才能建设更健康的社会；也只有到那时，真正的进步才可能实现。',
        note: '两个分句均倒装，形成排比节奏。',
      },
      {
        en: 'Only by respecting difference can we live together in peace, and only then will diversity become our strength.',
        cn: '唯有尊重差异，我们才能和平共处；也只有到那时，多样性才会成为我们的力量。',
        note: '适合文化、包容类话题。',
      },
    ],
    variants: [
      'Only in this way can we ...',
      'It is only through ... that ...',
      'Not until we ... will ...',
    ],
    pitfall:
      '两个分句都要保持倒装，第二个分句不要因为句子长就退回陈述语序；and 连接的并列结构须保持形式一致。',
    upgrade: {
      from: 'If we value substance, society will be better.',
      to: 'Only by valuing substance over appearance can we build a healthier society, and only then will true progress become possible.',
    },
  },
]
