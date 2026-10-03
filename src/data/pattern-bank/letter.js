/**
 * 书信应用 · 5 句
 * 功能：书信、通知、申请、建议等应用文的功能句。
 */
export default [
  {
    cat: 'letter',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'I am writing to express my sincere gratitude for + 名词/动名词',
    cn: '我写信是为了对……表达我诚挚的感谢。',
    usage:
      '感谢信开头第一句，I am writing to 是应用文最标准的开场，后接动词说明写信目的，清晰得体。',
    when: ['感谢信开头', '说明写信目的', '应用文通用开场'],
    examples: [
      {
        en: 'I am writing to express my sincere gratitude for your generous support during my exchange year.',
        cn: '我写信是为了对您在我交换学年期间给予的慷慨支持表达诚挚感谢。',
        note: 'for 后接名词或动名词。',
      },
      {
        en: 'I am writing to express my sincere gratitude for the warm reception you gave our delegation.',
        cn: '我写信是为了对您给予我们代表团的热情接待表达诚挚感谢。',
        note: '适合正式公务书信。',
      },
    ],
    variants: [
      'I am writing to convey my heartfelt thanks for ...',
      'On behalf of ..., I would like to thank you for ...',
      'Please accept my sincere appreciation for ...',
    ],
    pitfall:
      'gratitude 后接 for + 名词/动名词，不接 to do；sincere 不要误写为 sincerest 之外的混搭形式。',
    upgrade: {
      from: 'Thank you for helping me.',
      to: 'I am writing to express my sincere gratitude for your generous support during my exchange year.',
    },
  },

  {
    cat: 'letter',
    tier: 'core',
    form: 'basic',
    levels: ['cet4', 'cet6', 'kaoyan'],
    structure: 'I would appreciate it if you could + 动词',
    cn: '如果您能……，我将不胜感激。',
    usage:
      '应用文中最礼貌的请求句式。it 是形式宾语，真正的内容是 if 从句。比 "Please do" 委婉得多，是书信体的必备句。',
    when: ['提出请求', '书信结尾的期待回复', '委婉要求对方做某事'],
    examples: [
      {
        en: 'I would appreciate it if you could send me the relevant materials at your earliest convenience.',
        cn: '如果您能尽早把相关材料寄给我，我将不胜感激。',
        note: 'at your earliest convenience 是书信常用的客气表达。',
      },
      {
        en: 'I would appreciate it if you could take my suggestion into consideration.',
        cn: '如果您能考虑我的建议，我将不胜感激。',
        note: 'take ... into consideration 意为"把……纳入考虑"。',
      },
    ],
    variants: [
      'It would be greatly appreciated if you could ...',
      'I would be grateful if you could ...',
      'Could you please ... ?',
    ],
    pitfall:
      'appreciate 后必须先接形式宾语 it，再接 if 从句；不能写成 "I would appreciate if you could"。',
    upgrade: {
      from: 'Please send me the materials quickly.',
      to: 'I would appreciate it if you could send me the relevant materials at your earliest convenience.',
    },
  },

  {
    cat: 'letter',
    tier: 'advanced',
    form: 'basic',
    levels: ['cet6', 'kaoyan'],
    structure: 'I am writing to apply for the position of + 职位 + advertised in + 渠道',
    cn: '我写信是为了申请在……上刊登的……职位。',
    usage:
      '求职信的标准开头。过去分词 advertised in 作后置定语，说明信息来源，一句话交代清楚申请对象与渠道。',
    when: ['求职信开头', '申请信说明来意', '留学申请套用'],
    examples: [
      {
        en: 'I am writing to apply for the position of marketing assistant advertised in China Daily on May 12.',
        cn: '我写信是为了申请 5 月 12 日《中国日报》上刊登的市场助理一职。',
        note: 'advertised in ... 是过去分词短语作后置定语。',
      },
      {
        en: 'I am writing to apply for the volunteer programme advertised on your official website.',
        cn: '我写信是为了申请贵方官网上公布的志愿者项目。',
        note: '申请非职位项目时用 programme 替换 position。',
      },
    ],
    variants: [
      'I wish to apply for the post of ... which you advertised in ...',
      'In response to your advertisement in ..., I am writing to apply for ...',
      'I am writing in the hope of being considered for the position of ...',
    ],
    pitfall:
      'position 后接 of + 职位名称，职位名称前一般不加冠词（the position of marketing assistant）；广告渠道用 advertised in + 媒体名。',
    upgrade: {
      from: 'I saw your ad and I want this job.',
      to: 'I am writing to apply for the position of marketing assistant advertised in China Daily on May 12.',
    },
  },

  {
    cat: 'letter',
    tier: 'advanced',
    form: 'subjunctive',
    levels: ['cet6', 'kaoyan'],
    structure: 'I would like to suggest that + 主语 + (should) + 动词原形',
    cn: '我想建议……',
    usage:
      '建议信中提出意见的标准句式。that 从句用虚拟语气（should 可省），语气礼貌而不失明确，适合向机构或老师提建议。',
    when: ['建议信提出意见', '向机构反馈改进方案', '应用文建议段'],
    examples: [
      {
        en: 'I would like to suggest that the library should extend its opening hours during the examination period.',
        cn: '我想建议图书馆在考试期间延长开放时间。',
        note: 'should 可省略，extend 保持原形。',
      },
      {
        en: 'I would like to suggest that more recycling bins should be placed in the canteen area.',
        cn: '我想建议在食堂区域增设更多回收箱。',
        note: '适合校园建议类题目。',
      },
    ],
    variants: [
      'It might be a good idea if ...',
      'I wonder whether it would be possible to ...',
      'May I suggest that ... (should) ...',
    ],
    pitfall:
      'suggest 表"建议"时从句用虚拟语气（should + 原形）；表"表明"时则用陈述语气，注意区分。',
    upgrade: {
      from: 'You should open the library longer.',
      to: 'I would like to suggest that the library should extend its opening hours during the examination period.',
    },
  },

  {
    cat: 'letter',
    tier: 'expert',
    form: 'participle',
    levels: ['cet6', 'kaoyan'],
    structure: 'Should you have any further questions, please do not hesitate to contact me.',
    cn: '若您还有任何疑问，请随时与我联系。',
    usage:
      'Should 倒装的虚拟条件句作书信结尾，礼貌、正式且句式高级。一句同时完成"提供进一步帮助"与"礼貌收尾"两件事。',
    when: ['书信结尾收束', '提供后续联系方式', '需要礼貌且高级的结束语'],
    examples: [
      {
        en: 'Should you have any further questions, please do not hesitate to contact me at the address below.',
        cn: '若您还有任何疑问，请随时按下方的地址与我联系。',
        note: 'Should you have 相当于 If you should have。',
      },
      {
        en: 'Should you require any additional information, please do not hesitate to let me know.',
        cn: '若您需要任何补充信息，请随时告知我。',
        note: 'require 比 need 更正式，适合公务书信。',
      },
    ],
    variants: [
      'If you have any questions, please feel free to contact me.',
      'Please do not hesitate to reach out should you need further assistance.',
      'I remain at your disposal for any further information.',
    ],
    pitfall:
      'Should 提到句首后，从句动词用原形且不再加 if；主句用祈使句，不要用 will。',
    upgrade: {
      from: 'If you have questions, ask me.',
      to: 'Should you have any further questions, please do not hesitate to contact me.',
    },
  },
]
