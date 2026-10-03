// 单词库：按难度分级
export const words = [
  // ===== 基础 Level 1 =====
  { id: 1, word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃，抛弃', level: 1, example: 'He abandoned his car in the snow.', exampleCn: '他把车丢在雪地里。' },
  { id: 2, word: 'benefit', phonetic: '/ˈbenɪfɪt/', meaning: 'n. 好处 v. 受益', level: 1, example: 'Exercise benefits your health.', exampleCn: '锻炼有益健康。' },
  { id: 3, word: 'curious', phonetic: '/ˈkjʊəriəs/', meaning: 'adj. 好奇的', level: 1, example: 'The child was curious about everything.', exampleCn: '这个孩子对一切都很好奇。' },
  { id: 4, word: 'decide', phonetic: '/dɪˈsaɪd/', meaning: 'v. 决定', level: 1, example: 'She decided to study abroad.', exampleCn: '她决定出国留学。' },
  { id: 5, word: 'energy', phonetic: '/ˈenədʒi/', meaning: 'n. 能量，精力', level: 1, example: 'He is full of energy every morning.', exampleCn: '他每天早上都精力充沛。' },
  { id: 6, word: 'famous', phonetic: '/ˈfeɪməs/', meaning: 'adj. 著名的', level: 1, example: 'The city is famous for its food.', exampleCn: '这座城市以美食闻名。' },
  { id: 7, word: 'gather', phonetic: '/ˈɡæðər/', meaning: 'v. 聚集，收集', level: 1, example: 'We gathered around the campfire.', exampleCn: '我们围着篝火聚集。' },
  { id: 8, word: 'honest', phonetic: '/ˈɒnɪst/', meaning: 'adj. 诚实的', level: 1, example: 'He is an honest man.', exampleCn: '他是个诚实的人。' },
  { id: 9, word: 'improve', phonetic: '/ɪmˈpruːv/', meaning: 'v. 改进，提高', level: 1, example: 'I want to improve my English.', exampleCn: '我想提高我的英语水平。' },
  { id: 10, word: 'journey', phonetic: '/ˈdʒɜːni/', meaning: 'n. 旅行，旅程', level: 1, example: 'Life is a long journey.', exampleCn: '人生是一场漫长的旅行。' },

  // ===== 进阶 Level 2 =====
  { id: 11, word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: 'v. 实现，达到', level: 2, example: 'You can achieve anything with hard work.', exampleCn: '努力工作你就能实现任何目标。' },
  { id: 12, word: 'brilliant', phonetic: '/ˈbrɪliənt/', meaning: 'adj. 杰出的，灿烂的', level: 2, example: 'She came up with a brilliant idea.', exampleCn: '她想到了一个绝妙的主意。' },
  { id: 13, word: 'challenge', phonetic: '/ˈtʃælɪndʒ/', meaning: 'n. 挑战 v. 向…挑战', level: 2, example: 'Learning a new language is a big challenge.', exampleCn: '学习一门新语言是个巨大的挑战。' },
  { id: 14, word: 'delicate', phonetic: '/ˈdelɪkət/', meaning: 'adj. 精致的，微妙的', level: 2, example: 'The vase is delicate and expensive.', exampleCn: '这个花瓶精致而昂贵。' },
  { id: 15, word: 'essential', phonetic: '/ɪˈsenʃl/', meaning: 'adj. 必要的，本质的', level: 2, example: 'Water is essential for life.', exampleCn: '水对生命必不可少。' },
  { id: 16, word: 'grateful', phonetic: '/ˈɡreɪtfl/', meaning: 'adj. 感激的', level: 2, example: 'I am grateful for your help.', exampleCn: '我很感激你的帮助。' },
  { id: 17, word: 'hesitate', phonetic: '/ˈhezɪteɪt/', meaning: 'v. 犹豫', level: 2, example: 'Don\'t hesitate to ask questions.', exampleCn: '有问题尽管问，别犹豫。' },
  { id: 18, word: 'influence', phonetic: '/ˈɪnfluəns/', meaning: 'n./v. 影响', level: 2, example: 'Parents have a great influence on children.', exampleCn: '父母对孩子有很大的影响。' },
  { id: 19, word: 'maintain', phonetic: '/meɪnˈteɪn/', meaning: 'v. 维持，保养', level: 2, example: 'It\'s hard to maintain a good habit.', exampleCn: '坚持一个好习惯很难。' },
  { id: 20, word: 'obstacle', phonetic: '/ˈɒbstəkl/', meaning: 'n. 障碍', level: 2, example: 'Fear is the biggest obstacle to success.', exampleCn: '恐惧是成功最大的障碍。' },

  // ===== 高阶 Level 3 =====
  { id: 21, word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: 'v. 完成，实现', level: 3, example: 'She accomplished the mission successfully.', exampleCn: '她成功完成了任务。' },
  { id: 22, word: 'comprehensive', phonetic: '/ˌkɒmprɪˈhensɪv/', meaning: 'adj. 全面的，综合的', level: 3, example: 'The report gives a comprehensive analysis.', exampleCn: '这份报告给出了全面的分析。' },
  { id: 23, word: 'distinguish', phonetic: '/dɪˈstɪŋɡwɪʃ/', meaning: 'v. 区分，辨别', level: 3, example: 'Can you distinguish the two sounds?', exampleCn: '你能区分这两个发音吗？' },
  { id: 24, word: 'elaborate', phonetic: '/ɪˈlæbərət/', meaning: 'adj. 精心的 v. 详细阐述', level: 3, example: 'Could you elaborate on your plan?', exampleCn: '你能详细说明一下你的计划吗？' },
  { id: 25, word: 'fundamental', phonetic: '/ˌfʌndəˈmentl/', meaning: 'adj. 基本的，根本的', level: 3, example: 'Freedom is a fundamental human right.', exampleCn: '自由是基本人权。' },
  { id: 26, word: 'hypothetical', phonetic: '/ˌhaɪpəˈθetɪkl/', meaning: 'adj. 假设的', level: 3, example: 'That\'s a purely hypothetical question.', exampleCn: '那纯粹是个假设性的问题。' },
  { id: 27, word: 'inevitable', phonetic: '/ɪnˈevɪtəbl/', meaning: 'adj. 不可避免的', level: 3, example: 'Change is inevitable in life.', exampleCn: '生活中变化是不可避免的。' },
  { id: 28, word: 'legitimate', phonetic: '/lɪˈdʒɪtɪmət/', meaning: 'adj. 合法的，正当的', level: 3, example: 'He has a legitimate reason for being late.', exampleCn: '他迟到是有正当理由的。' },
  { id: 29, word: 'perspective', phonetic: '/pəˈspektɪv/', meaning: 'n. 观点，视角', level: 3, example: 'Try to see things from my perspective.', exampleCn: '试着从我的角度看问题。' },
  { id: 30, word: 'sophisticated', phonetic: '/səˈfɪstɪkeɪtɪd/', meaning: 'adj. 复杂的，精密的', level: 3, example: 'The software uses sophisticated algorithms.', exampleCn: '这个软件使用了复杂的算法。' },
]

// 每日一句：语料库独立维护，见 ./sentences.js
export { sentences } from './sentences.js'
