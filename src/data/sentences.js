/**
 * 每日一句 · 语料库
 * ---------------------------------------------------------------
 * 收录标准：
 *   ① 出处可靠（名言/谚语/经典文献，注明作者；无法确证的一律标「佚名」或「谚语」）
 *   ② 句式本身值得学 —— 优先选含倒装、虚拟、强调、分词结构的句子，
 *      让"每日一句"同时承担阅读输入与写作句型的双重作用
 *   ③ 长度适中（8–25 词），适合朗读与背记
 *
 * 服务端 server/words-data.js 的 sentencesData 与此保持一致。
 */
export const sentences = [
  { en: 'The best way to predict the future is to create it.', cn: '预测未来的最好方式就是创造未来。', author: 'Peter Drucker' },
  { en: 'A journey of a thousand miles begins with a single step.', cn: '千里之行，始于足下。', author: '老子' },
  { en: 'The limits of my language mean the limits of my world.', cn: '我语言的界限，就是我世界的界限。', author: 'Ludwig Wittgenstein' },
  { en: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', cn: '如同明日将死般生活，如同永远不死般学习。', author: 'Mahatma Gandhi' },
  { en: 'There is no substitute for hard work.', cn: '努力没有替代品。', author: 'Thomas Edison' },
  { en: 'The unexamined life is not worth living.', cn: '未经省察的人生不值得过。', author: 'Socrates' },
  { en: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', cn: '我们由反复的行为造就。因此，卓越不是一种行为，而是一种习惯。', author: 'Aristotle（威尔·杜兰特转述）' },
  { en: 'It is not that we have a short time to live, but that we waste much of it.', cn: '并不是我们拥有的时间太短，而是我们浪费了太多。', author: 'Seneca' },
  { en: 'The only thing we have to fear is fear itself.', cn: '我们唯一需要恐惧的，就是恐惧本身。', author: 'Franklin D. Roosevelt' },
  { en: 'In the middle of difficulty lies opportunity.', cn: '困难之中蕴藏着机遇。', author: 'Albert Einstein' },
  { en: 'Not until we are lost do we begin to understand ourselves.', cn: '直到迷失，我们才开始认识自己。', author: 'Henry David Thoreau' },
  { en: 'It is not the strongest of the species that survives, but the one most responsive to change.', cn: '生存下来的不是最强的物种，而是对变化反应最快的那个。', author: 'Charles Darwin（常引述）' },
  { en: 'Education is not the filling of a pail, but the lighting of a fire.', cn: '教育不是灌满一桶水，而是点燃一把火。', author: '常归于 W. B. Yeats' },
  { en: 'The more that you read, the more things you will know.', cn: '你读得越多，知道的就越多。', author: 'Dr. Seuss' },
  { en: 'However difficult life may seem, there is always something you can succeed at.', cn: '无论生活看起来多么艰难，总有一件事你能做成。', author: 'Stephen Hawking' },
  { en: 'What we think, we become.', cn: '我们所思，即我们所成。', author: 'Buddhist proverb（佛教谚语）' },
  { en: 'Should you doubt your ability, remember that practice outlasts talent.', cn: '若你怀疑自己的能力，请记住：坚持比天赋更持久。', author: '佚名' },
  { en: 'Only by admitting what we do not know can we begin to learn.', cn: '只有承认自己不知道，我们才开始学习。', author: '佚名' },
  { en: 'It is easier to resist at the beginning than at the end.', cn: '在开始处抵制，比在结尾处容易。', author: 'Leonardo da Vinci' },
  { en: 'Wheresoever you go, go with all your heart.', cn: '无论去往何处，都要全心全意。', author: 'Confucius（《论语》英译）' },
  { en: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.', cn: '告诉我，我会忘记；教导我，我会记住；让我参与，我才会真正学会。', author: '常归于 Benjamin Franklin' },
  { en: 'Coupled with patience, curiosity can carry a learner further than talent alone.', cn: '有了耐心相伴，好奇心能把学习者带得比仅靠天赋更远。', author: '佚名' },
  { en: 'Reading is to the mind what exercise is to the body.', cn: '阅读之于头脑，正如运动之于身体。', author: 'Joseph Addison' },
  { en: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', cn: '人生最大的荣耀不在于从不跌倒，而在于每次跌倒后都能站起来。', author: 'Nelson Mandela' },
  { en: 'Happiness depends upon ourselves.', cn: '幸福取决于我们自己。', author: 'Aristotle' },
  { en: 'I have not failed. I have just found ten thousand ways that will not work.', cn: '我没有失败，我只是找到了一万种行不通的方法。', author: '常归于 Thomas Edison' },
  { en: 'Knowledge speaks, but wisdom listens.', cn: '知识在说，智慧在听。', author: 'Jimi Hendrix' },
  { en: 'The future belongs to those who believe in the beauty of their dreams.', cn: '未来属于那些相信梦想之美的人。', author: 'Eleanor Roosevelt' },
  { en: 'Rather than waiting for inspiration, sit down and begin.', cn: '与其等待灵感，不如坐下来开始。', author: '常归于 Chuck Close' },
  { en: 'Nothing in life is to be feared; it is only to be understood.', cn: '生活中没有什么可怕的东西，只有需要理解的东西。', author: 'Marie Curie' },
  { en: 'So long as we keep asking better questions, progress remains possible.', cn: '只要我们不断提出更好的问题，进步就仍然可能。', author: '佚名' },
  { en: 'If you want to go fast, go alone. If you want to go far, go together.', cn: '想走得快，独自前行；想走得远，结伴同行。', author: '非洲谚语' },
  { en: 'Genius is one percent inspiration and ninety-nine percent perspiration.', cn: '天才是百分之一的灵感加百分之九十九的汗水。', author: 'Thomas Edison' },
  { en: 'A room without books is like a body without a soul.', cn: '没有书的房间，就像没有灵魂的身体。', author: 'Cicero' },
  { en: 'It always seems impossible until it is done.', cn: '在事情完成之前，它总显得不可能。', author: 'Nelson Mandela' },
  { en: 'Were it not for mistakes, we would never learn to think.', cn: '若没有错误，我们永远学不会思考。', author: '佚名' },
  { en: 'The measure of intelligence is the ability to change.', cn: '衡量智力的标准是改变的能力。', author: 'Albert Einstein' },
  { en: 'Do not go where the path may lead; go instead where there is no path and leave a trail.', cn: '不要走向既有道路的尽头，而要走向无路之处，并留下一条路。', author: 'Ralph Waldo Emerson' },
  { en: 'What is written without effort is in general read without pleasure.', cn: '不经努力写出的东西，通常也读之无味。', author: 'Samuel Johnson' },
  { en: 'Little by little, one travels far.', cn: '一点一点，终能远行。', author: '常归于 J. R. R. Tolkien' },
]
