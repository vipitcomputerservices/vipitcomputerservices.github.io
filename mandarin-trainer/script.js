const TOTAL_LEVELS = 20;
const SLIDES_PER_LEVEL = 50;
const QUIZ_QUESTIONS = 10;

const state = {
  level: 1,
  tab: 'flashcards',
  slideIndex: 0,
  quizMode: false,
  reviewMode: false,
  quizAnswers: {},
  quizItems: [],
  sectionProgress: {},
};

function progressKey() {
  return `${state.tab}|${state.level}`;
}

function getSectionProgress() {
  const key = progressKey();
  if (!state.sectionProgress[key]) {
    state.sectionProgress[key] = {
      statusBySlide: Array(SLIDES_PER_LEVEL).fill(null), // null | true | false
      reviewLaterBySlide: Array(SLIDES_PER_LEVEL).fill(false),
    };
  }
  return state.sectionProgress[key];
}

function setSlideResult(slideIdx, isCorrect) {
  const section = getSectionProgress();
  section.statusBySlide[slideIdx] = !!isCorrect;
}

function getUnresolvedSlides() {
  const section = getSectionProgress();
  const unresolved = [];
  for (let i = 0; i < SLIDES_PER_LEVEL; i++) {
    if (state.tab === 'listening') {
      if (section.statusBySlide[i] !== true || section.reviewLaterBySlide[i] === true) unresolved.push(i);
    } else {
      if (section.reviewLaterBySlide[i] === true) unresolved.push(i);
    }
  }
  return unresolved;
}

function resetCurrentSectionProgress() {
  const key = progressKey();
  state.sectionProgress[key] = {
    statusBySlide: Array(SLIDES_PER_LEVEL).fill(null),
    reviewLaterBySlide: Array(SLIDES_PER_LEVEL).fill(false),
  };
}

function canAdvanceFromCurrentSlide() {
  if (state.tab !== 'listening') return true;
  const section = getSectionProgress();
  return section.statusBySlide[state.slideIndex] !== null;
}

function setReviewLater(slideIdx, value) {
  const section = getSectionProgress();
  section.reviewLaterBySlide[slideIdx] = !!value;
}

function isReviewLater(slideIdx) {
  const section = getSectionProgress();
  return !!section.reviewLaterBySlide[slideIdx];
}

function getAllReviewItems() {
  const items = [];
  for (let level = 1; level <= TOTAL_LEVELS; level++) {
    ['flashcards', 'kumon', 'listening'].forEach((tab) => {
      const key = `${tab}|${level}`;
      const section = state.sectionProgress[key];
      if (!section) return;
      for (let i = 0; i < SLIDES_PER_LEVEL; i++) {
        if (!section.reviewLaterBySlide[i]) continue;
        const words = getLevelWords(level);
        const word = words[i % words.length];
        items.push({ tab, level, slideIndex: i, word });
      }
    });
  }
  return items;
}

const LEVEL_WORD_BANKS = {
  1: [
    ['I','我','wǒ'],['you','你','nǐ'],['he','他','tā'],['good','好','hǎo'],['yes','是','shì'],['not','不','bù'],
    ['one','一','yī'],['two','二','èr'],['person','人','rén'],['water','水','shuǐ'],['eat','吃','chī'],['book','书','shū']
  ],
  2: [
    ['school','学校','xué xiào'],['student','学生','xué sheng'],['teacher','老师','lǎo shī'],['friend','朋友','péng you'],
    ['today','今天','jīn tiān'],['tomorrow','明天','míng tiān'],['now','现在','xiàn zài'],['home','家','jiā'],
    ['go','去','qù'],['come','来','lái'],['look','看','kàn'],['listen','听','tīng']
  ],
  3: [
    ['dog','狗','gǒu'],['cat','猫','māo'],['bird','鸟','niǎo'],['fish','鱼','yú'],['milk','牛奶','niú nǎi'],['rice','米饭','mǐ fàn'],
    ['tea','茶','chá'],['apple','苹果','píng guǒ'],['fruit','水果','shuǐ guǒ'],['small','小','xiǎo'],['big','大','dà'],['many','多','duō']
  ],
  4: [
    ['room','房间','fáng jiān'],['table','桌子','zhuō zi'],['chair','椅子','yǐ zi'],['door','门','mén'],['window','窗户','chuāng hu'],
    ['bed','床','chuáng'],['cup','杯子','bēi zi'],['clock','钟','zhōng'],['clothes','衣服','yī fu'],['shoe','鞋','xié'],['open','开','kāi'],['close','关','guān']
  ],
  5: [
    ['bus','公共汽车','gōng gòng qì chē'],['train','火车','huǒ chē'],['station','车站','chē zhàn'],['road','路','lù'],['city','城市','chéng shì'],
    ['left','左边','zuǒ biān'],['right','右边','yòu biān'],['front','前面','qián mian'],['behind','后面','hòu mian'],['near','附近','fù jìn'],['far','远','yuǎn'],['walk','走路','zǒu lù']
  ],
  6: [
    ['sun','太阳','tài yáng'],['moon','月亮','yuè liang'],['rain','雨','yǔ'],['snow','雪','xuě'],['wind','风','fēng'],['hot','热','rè'],
    ['cold','冷','lěng'],['spring','春天','chūn tiān'],['summer','夏天','xià tiān'],['autumn','秋天','qiū tiān'],['winter','冬天','dōng tiān'],['weather','天气','tiān qì']
  ],
  7: [
    ['morning','早上','zǎo shang'],['noon','中午','zhōng wǔ'],['evening','晚上','wǎn shang'],['before','以前','yǐ qián'],['after','以后','yǐ hòu'],['because','因为','yīn wèi'],
    ['so','所以','suǒ yǐ'],['but','但是','dàn shì'],['if','如果','rú guǒ'],['can','可以','kě yǐ'],['must','必须','bì xū'],['should','应该','yīng gāi']
  ],
  8: [
    ['happy','高兴','gāo xìng'],['sad','难过','nán guò'],['busy','忙','máng'],['tired','累','lèi'],['easy','容易','róng yì'],['difficult','困难','kùn nán'],
    ['important','重要','zhòng yào'],['interesting','有意思','yǒu yì si'],['careful','小心','xiǎo xīn'],['healthy','健康','jiàn kāng'],['exercise','锻炼','duàn liàn'],['rest','休息','xiū xi']
  ],
  9: [
    ['question','问题','wèn tí'],['answer','回答','huí dá'],['idea','主意','zhǔ yi'],['plan','计划','jì huà'],['decide','决定','jué dìng'],['remember','记得','jì de'],
    ['forget','忘记','wàng jì'],['understand','明白','míng bai'],['explain','解释','jiě shì'],['practice','练习','liàn xí'],['improve','提高','tí gāo'],['change','改变','gǎi biàn']
  ],
  10: [
    ['library','图书馆','tú shū guǎn'],['museum','博物馆','bó wù guǎn'],['restaurant','饭馆','fàn guǎn'],['market','市场','shì chǎng'],['hospital','医院','yī yuàn'],['bank','银行','yín háng'],
    ['post office','邮局','yóu jú'],['street','街道','jiē dào'],['bridge','桥','qiáo'],['river','河','hé'],['mountain','山','shān'],['park','公园','gōng yuán']
  ],
  11: [
    ['newspaper','报纸','bào zhǐ'],['magazine','杂志','zá zhì'],['story','故事','gù shi'],['article','文章','wén zhāng'],['sentence','句子','jù zi'],['word','词语','cí yǔ'],
    ['character','汉字','hàn zì'],['grammar','语法','yǔ fǎ'],['translation','翻译','fān yì'],['pronunciation','发音','fā yīn'],['tone','声调','shēng diào'],['conversation','对话','duì huà']
  ],
  12: [
    ['community','社区','shè qū'],['culture','文化','wén huà'],['history','历史','lì shǐ'],['festival','节日','jié rì'],['custom','习俗','xí sú'],['traditional','传统','chuán tǒng'],
    ['modern','现代','xiàn dài'],['development','发展','fā zhǎn'],['environment','环境','huán jìng'],['protect','保护','bǎo hù'],['pollution','污染','wū rǎn'],['resource','资源','zī yuán']
  ],
  13: [
    ['mathematics','数学','shù xué'],['science','科学','kē xué'],['technology','技术','jì shù'],['experiment','实验','shí yàn'],['result','结果','jié guǒ'],['process','过程','guò chéng'],
    ['method','方法','fāng fǎ'],['ability','能力','néng lì'],['knowledge','知识','zhī shi'],['experience','经验','jīng yàn'],['discover','发现','fā xiàn'],['invent','发明','fā míng']
  ],
  14: [
    ['society','社会','shè huì'],['economy','经济','jīng jì'],['industry','工业','gōng yè'],['agriculture','农业','nóng yè'],['service','服务','fú wù'],['management','管理','guǎn lǐ'],
    ['cooperate','合作','hé zuò'],['compete','竞争','jìng zhēng'],['success','成功','chéng gōng'],['failure','失败','shī bài'],['opportunity','机会','jī huì'],['challenge','挑战','tiǎo zhàn']
  ],
  15: [
    ['planet','行星','xíng xīng'],['earth','地球','dì qiú'],['space','太空','tài kōng'],['energy','能源','néng yuán'],['material','材料','cái liào'],['structure','结构','jié gòu'],
    ['system','系统','xì tǒng'],['data','数据','shù jù'],['analysis','分析','fēn xī'],['model','模型','mó xíng'],['pattern','模式','mó shì'],['logic','逻辑','luó ji']
  ],
  16: [
    ['citizen','公民','gōng mín'],['responsibility','责任','zé rèn'],['rights','权利','quán lì'],['law','法律','fǎ lǜ'],['rule','规则','guī zé'],['fairness','公平','gōng píng'],
    ['respect','尊重','zūn zhòng'],['trust','信任','xìn rèn'],['honesty','诚实','chéng shí'],['kindness','善良','shàn liáng'],['patience','耐心','nài xīn'],['courage','勇气','yǒng qì']
  ],
  17: [
    ['opinion','意见','yì jiàn'],['discussion','讨论','tǎo lùn'],['debate','辩论','biàn lùn'],['evidence','证据','zhèng jù'],['reason','理由','lǐ yóu'],['conclusion','结论','jié lùn'],
    ['compare','比较','bǐ jiào'],['summarize','总结','zǒng jié'],['predict','预测','yù cè'],['evaluate','评价','píng jià'],['strategy','策略','cè lüè'],['goal','目标','mù biāo']
  ],
  18: [
    ['imagination','想象力','xiǎng xiàng lì'],['creativity','创造力','chuàng zào lì'],['design','设计','shè jì'],['art','艺术','yì shù'],['music','音乐','yīn yuè'],['literature','文学','wén xué'],
    ['drama','戏剧','xì jù'],['poem','诗','shī'],['rhythm','节奏','jié zòu'],['emotion','情感','qíng gǎn'],['expression','表达','biǎo dá'],['style','风格','fēng gé']
  ],
  19: [
    ['journey','旅程','lǚ chéng'],['destination','目的地','mù dì dì'],['direction','方向','fāng xiàng'],['map','地图','dì tú'],['safety','安全','ān quán'],['experience','体验','tǐ yàn'],
    ['explore','探索','tàn suǒ'],['observe','观察','guān chá'],['record','记录','jì lù'],['report','报告','bào gào'],['share','分享','fēn xiǎng'],['reflect','反思','fǎn sī']
  ],
  20: [
    ['paragraph','段落','duàn luò'],['main idea','中心思想','zhōng xīn sī xiǎng'],['detail','细节','xì jié'],['sequence','顺序','shùn xù'],['cause','原因','yuán yīn'],['effect','结果','jié guǒ'],
    ['character','人物','rén wù'],['setting','背景','bèi jǐng'],['problem','问题','wèn tí'],['solution','解决办法','jiě jué bàn fǎ'],['summary','摘要','zhāi yào'],['lesson','道理','dào lǐ']
  ],
};

const levelsEl = document.getElementById('levels');
const slideHost = document.getElementById('slideHost');
const quizHost = document.getElementById('quizHost');
const statusText = document.getElementById('statusText');
const progressText = document.getElementById('progressText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const emojiMap = {
  apple:'🍎', water:'💧', book:'📘', car:'🚗', cat:'🐱', dog:'🐶', house:'🏠', school:'🏫', friend:'🧑‍🤝‍🧑', money:'💰',
  phone:'📱', computer:'💻', table:'🪑', chair:'🪑', door:'🚪', window:'🪟', rice:'🍚', tea:'🍵', coffee:'☕', milk:'🥛',
  bread:'🍞', egg:'🥚', fish:'🐟', meat:'🥩', vegetable:'🥬', fruit:'🍉', sun:'☀️', moon:'🌙', star:'⭐', rain:'🌧️',
  snow:'❄️', wind:'💨', mountain:'⛰️', river:'🏞️', sea:'🌊', city:'🏙️', road:'🛣️', train:'🚆', plane:'✈️', bicycle:'🚲',
  shirt:'👕', pants:'👖', shoes:'👟', clock:'🕒', bed:'🛏️', hospital:'🏥', market:'🛒', park:'🌳', teacher:'👩‍🏫', student:'🧑‍🎓'
};

function makeWordImageSvgDataUri(wordEn, zh) {
  const emoji = emojiMap[wordEn] || '🀄';
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#1d4ed8'/>
          <stop offset='100%' stop-color='#0f172a'/>
        </linearGradient>
      </defs>
      <rect width='1200' height='800' fill='url(#g)'/>
      <text x='600' y='300' text-anchor='middle' font-size='170'>${emoji}</text>
      <text x='600' y='430' text-anchor='middle' font-size='84' fill='white' font-family='Segoe UI, Arial'>${wordEn}</text>
      <text x='600' y='520' text-anchor='middle' font-size='86' fill='#bfdbfe' font-family='Segoe UI, Arial'>${zh}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getPhotoUrl(keyword, seed) {
  return `https://loremflickr.com/360/240/${encodeURIComponent(keyword)}?lock=${seed}`;
}

function attachImageFallbacks(root = document) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.onerror = () => {
      if (img.dataset.fallback) img.src = img.dataset.fallback;
      img.onerror = null;
    };
  });
}

function getUniqueWordPool(level, count = SLIDES_PER_LEVEL) {
  const orderedLevels = [];
  for (let l = level; l <= TOTAL_LEVELS; l++) orderedLevels.push(l);
  for (let l = 1; l < level; l++) orderedLevels.push(l);

  const seen = new Set();
  const unique = [];

  for (const l of orderedLevels) {
    const bank = LEVEL_WORD_BANKS[l] || [];
    for (const item of bank) {
      const [en, zh, py] = item;
      const key = `${zh}|${py}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push([en, zh, py]);
      if (unique.length >= count) return unique;
    }
  }

  return unique;
}

function getLevelWords(level) {
  const pool = getUniqueWordPool(level, SLIDES_PER_LEVEL);
  return pool.map(([en, zh, py]) => {
    const emojiImage = makeWordImageSvgDataUri(en, zh);
    return {
      en,
      zh,
      py,
      image: emojiImage,
      fallbackImage: emojiImage,
      ttsText: zh,
    };
  });
}

function makeSentenceImageSvgDataUri(emoji, english) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
      <defs>
        <linearGradient id='sg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0ea5e9'/>
          <stop offset='100%' stop-color='#1e293b'/>
        </linearGradient>
      </defs>
      <rect width='800' height='450' fill='url(#sg)'/>
      <text x='400' y='190' text-anchor='middle' font-size='120'>${emoji}</text>
      <text x='400' y='300' text-anchor='middle' font-size='44' fill='white' font-family='Segoe UI, Arial'>${english}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const KUMON_PATTERNS = [
  { connectorZh: '和', connectorPy: 'hé', connectorEn: 'and', sentenceTailZh: '在一起。', sentenceTailPy: 'zài yì qǐ.', sentenceTailEn: 'together.', sceneEmoji: '🤝' },
  { connectorZh: '在', connectorPy: 'zài', connectorEn: 'at', sentenceTailZh: '学习。', sentenceTailPy: 'xué xí.', sentenceTailEn: 'study.', sceneEmoji: '📚' },
  { connectorZh: '和', connectorPy: 'hé', connectorEn: 'with', sentenceTailZh: '练习。', sentenceTailPy: 'liàn xí.', sentenceTailEn: 'practice.', sceneEmoji: '📝' },
  { connectorZh: '在', connectorPy: 'zài', connectorEn: 'in', sentenceTailZh: '使用。', sentenceTailPy: 'shǐ yòng.', sentenceTailEn: 'use.', sceneEmoji: '🧩' },
  { connectorZh: '和', connectorPy: 'hé', connectorEn: 'with', sentenceTailZh: '复习。', sentenceTailPy: 'fù xí.', sentenceTailEn: 'review.', sceneEmoji: '🔁' }
];

function getStrictLevelWords(level) {
  const bank = LEVEL_WORD_BANKS[level] || [];
  if (!bank.length) return getLevelWords(level).slice(0, 12);
  return bank.map(([en, zh, py]) => ({ en, zh, py, ttsText: zh }));
}

function buildKumonSentence(wordA, wordB, pattern) {
  const emojiA = emojiMap[wordA.en] || '🀄';
  const emojiB = emojiMap[wordB.en] || '🀄';

  const gloss = [
    { zh: wordA.zh, py: wordA.py, en: wordA.en },
    { zh: pattern.connectorZh, py: pattern.connectorPy, en: pattern.connectorEn },
    { zh: wordB.zh, py: wordB.py, en: wordB.en }
  ];

  const chinese = `${wordA.zh}${pattern.connectorZh}${wordB.zh}${pattern.sentenceTailZh}`;
  const pinyin = `${wordA.py} ${pattern.connectorPy} ${wordB.py} ${pattern.sentenceTailPy}`;
  const english = `${wordA.en} ${pattern.connectorEn} ${wordB.en} ${pattern.sentenceTailEn}`;

  return {
    english,
    chinese,
    pinyin,
    emoji: `${emojiA}${emojiB}${pattern.sceneEmoji}`,
    gloss
  };
}

function getKumonTriplet(slideIndex, level) {
  const levelWords = getStrictLevelWords(level);
  const pattern = KUMON_PATTERNS[slideIndex % KUMON_PATTERNS.length];

  return Array.from({ length: 3 }, (_, idx) => {
    const a = levelWords[(slideIndex * 3 + idx) % levelWords.length];
    const b = levelWords[(slideIndex * 3 + idx + 1) % levelWords.length];
    const sentence = buildKumonSentence(a, b, pattern);
    const emojiImage = makeSentenceImageSvgDataUri(sentence.emoji, sentence.english);

    return {
      ...sentence,
      image: emojiImage,
      fallbackImage: emojiImage
    };
  });
}

function renderGlossedChinese(gloss = []) {
  return `${gloss.map((g) => `<span class="gloss-token" title="${g.en}">${g.zh}</span>`).join('')}。`;
}

function renderGlossedPinyin(gloss = []) {
  return `${gloss.map((g) => `<span class="gloss-token" title="${g.en}">${g.py}</span>`).join(' ')}.`;
}

function ttsUrl(text) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`;
}

function speakChinese(text) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return;
  }
  new Audio(ttsUrl(text)).play().catch(() => {});
}

function renderLevels() {
  levelsEl.innerHTML = '';
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const btn = document.createElement('button');
    btn.className = `level-btn ${state.level === i ? 'active' : ''}`;
    btn.textContent = `Level ${i}`;
    btn.onclick = () => {
      state.level = i;
      state.slideIndex = 0;
      resetQuiz();
      render();
    };
    levelsEl.appendChild(btn);
  }
}

function renderTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === state.tab);
    tab.onclick = () => {
      state.tab = tab.dataset.tab;
      state.slideIndex = 0;
      resetQuiz();
      render();
    };
  });
}

function resetQuiz() {
  state.quizMode = false;
  state.reviewMode = false;
  state.quizAnswers = {};
  state.quizItems = [];
}

function startQuiz(words) {
  state.quizMode = true;
  state.quizAnswers = {};
  state.quizItems = Array.from({ length: QUIZ_QUESTIONS }, (_, idx) => {
    const correctIdx = (idx * 5 + state.level) % words.length;
    const correct = words[correctIdx];
    const distractorA = words[(correctIdx + 3) % words.length];
    const distractorB = words[(correctIdx + 9) % words.length];
    const options = [correct, distractorA, distractorB].sort(() => Math.random() - 0.5);
    return { correct, options };
  });
}

function renderFlash(word) {
  slideHost.innerHTML = `
    <div class="flash-card">
      <div class="flash-inner" id="flashInner">
        <div class="flash-face flash-front">
          <img class="flash-main-img" src="${word.image}" data-fallback="${word.fallbackImage || ''}" alt="${word.en}" loading="lazy" />
          <p class="flash-en">${word.en}</p>
          <p>Click card to flip</p>
        </div>
        <div class="flash-face flash-back">
          <img class="flash-small-img" src="${word.image}" data-fallback="${word.fallbackImage || ''}" alt="${word.en}" loading="lazy" />
          <p class="flash-en" title="${word.en}">${word.en}</p>
          <p class="cn" title="${word.en}">${word.zh}</p>
          <p class="py" title="${word.en}">${word.py}</p>
          <button class="speaker" id="flashSpeaker" title="Play audio">🔊</button>
        </div>
      </div>
    </div>
  `;
  attachImageFallbacks(slideHost);
  const inner = document.getElementById('flashInner');
  inner.onclick = () => inner.classList.toggle('flipped');
  document.getElementById('flashSpeaker').onclick = (e) => {
    e.stopPropagation();
    speakChinese(word.ttsText);
  };
}

function renderKumon() {
  const triplet = getKumonTriplet(state.slideIndex, state.level);
  slideHost.innerHTML = `
    <div class="kumon-card">
      <h3>Kumon Repetition · Beginner Sentences</h3>
      ${triplet.map((t, idx) => `
        <div class="kumon-sentence">
          <img class="kumon-img" src="${t.image}" data-fallback="${t.fallbackImage || ''}" alt="${t.english}" loading="lazy" />
          <div class="kumon-text">
            <div class="kumon-english">${idx + 1}) ${t.english}</div>
            <div class="kumon-chinese">${renderGlossedChinese(t.gloss)}</div>
            <div class="kumon-pinyin">${renderGlossedPinyin(t.gloss)}</div>
          </div>
          <button class="speaker kumon-speaker" data-kumon-say="${t.chinese}" title="Play sentence audio">🔊</button>
        </div>
      `).join('')}
    </div>
  `;

  attachImageFallbacks(slideHost);
  slideHost.querySelectorAll('.kumon-speaker').forEach((btn) => {
    btn.onclick = () => speakChinese(btn.dataset.kumonSay || '');
  });
}

function renderReviewLaterControl() {
  const wrap = document.createElement('div');
  wrap.className = 'review-later-wrap';
  wrap.innerHTML = `
    <label class="review-later-label" title="Add this slide to review after all 50 slides">
      <input type="checkbox" id="reviewLaterCheck" />
      Review Later
    </label>
  `;
  slideHost.appendChild(wrap);

  const box = document.getElementById('reviewLaterCheck');
  box.onchange = () => {
    if (box.checked) {
      setReviewLater(state.slideIndex, true);
      box.checked = false;
    }
  };
}

function renderReviewTab() {
  const items = getAllReviewItems();

  if (!items.length) {
    slideHost.innerHTML = `<div class="quiz-card"><h3>Review</h3><p>No items flagged for Review Later.</p></div>`;
    return;
  }

  slideHost.innerHTML = `
    <div class="quiz-card">
      <h3>Review (${items.length})</h3>
      <div id="reviewList"></div>
    </div>
  `;

  const reviewList = document.getElementById('reviewList');
  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'review-item';
    row.innerHTML = `
      <img class="review-item-img" src="${item.word.image}" data-fallback="${item.word.fallbackImage || ''}" alt="${item.word.en}" loading="lazy" />
      <div>
        <div class="review-item-title">L${item.level} · ${item.tab} · Slide ${item.slideIndex + 1}</div>
        <div class="review-item-cn">${item.word.zh}</div>
        <div class="review-item-py">${item.word.py}</div>
      </div>
      <div class="review-item-actions">
        <button class="speaker" data-say="${item.word.zh}" title="Play">🔊</button>
        <label><input type="checkbox" data-uncheck="1" data-tab="${item.tab}" data-level="${item.level}" data-slide="${item.slideIndex}" checked /> Review Later</label>
      </div>
    `;
    reviewList.appendChild(row);
  });

  attachImageFallbacks(slideHost);
  reviewList.querySelectorAll('button[data-say]').forEach((btn) => {
    btn.onclick = () => speakChinese(btn.dataset.say || '');
  });

  reviewList.querySelectorAll('input[data-uncheck="1"]').forEach((cb) => {
    cb.onchange = () => {
      const key = `${cb.dataset.tab}|${Number(cb.dataset.level)}`;
      const section = state.sectionProgress[key];
      if (!section) return;
      section.reviewLaterBySlide[Number(cb.dataset.slide)] = cb.checked;
      render();
    };
  });
}

function renderListening(word, words) {
  const correct = word;
  const options = [
    correct,
    words[(state.slideIndex + 7) % words.length],
    words[(state.slideIndex + 13) % words.length],
  ].sort(() => Math.random() - 0.5);

  slideHost.innerHTML = `
    <div class="listen-card">
      <div class="listen-question">Listen and choose the correct meaning:</div>
      <button class="speaker" id="listenPlay">🔊</button>
      <div id="listenAnswers"></div>
      <div id="listenFeedback" style="margin-top:10px;color:#cbd5e1;"></div>
    </div>
  `;

  document.getElementById('listenPlay').onclick = () => speakChinese(correct.ttsText);

  const answers = document.getElementById('listenAnswers');
  options.forEach((opt) => {
    const b = document.createElement('button');
    b.className = 'answer-btn';
    b.textContent = `${opt.en}`;
    b.onclick = () => {
      speakChinese(opt.zh);
      const ok = opt.en === correct.en;
      setSlideResult(state.slideIndex, ok);
      b.classList.add(ok ? 'correct' : 'wrong');

      answers.querySelectorAll('.answer-btn').forEach((btn, idx) => {
        const optionWord = options[idx];
        btn.innerHTML = `${optionWord.en} (${optionWord.py}) <span class="listen-mini-speaker" data-say="${optionWord.zh}" title="Play pronunciation">🔊</span>`;
      });

      answers.querySelectorAll('.listen-mini-speaker').forEach((spk) => {
        spk.onclick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          speakChinese(spk.dataset.say || '');
        };
      });

      document.getElementById('listenFeedback').textContent = ok
        ? `Correct: ${correct.zh} (${correct.py})`
        : `Wrong. Correct answer is: ${correct.en} -> ${correct.zh} (${correct.py})`;
      nextBtn.disabled = false;
    };
    answers.appendChild(b);
  });
}

function renderQuiz(words) {
  slideHost.classList.add('hidden');
  quizHost.classList.remove('hidden');

  if (!state.quizItems.length) startQuiz(words);

  quizHost.innerHTML = `
    <div class="quiz-card">
      <h3>Level ${state.level} · ${state.tab} quiz (${QUIZ_QUESTIONS} questions)</h3>
      <div id="quizQuestions"></div>
      <div class="quiz-actions">
        <button id="submitQuiz">Submit Quiz</button>
        <button id="restartSlides">Back to slides</button>
      </div>
      <div id="quizResult"></div>
    </div>
  `;

  const qHost = document.getElementById('quizQuestions');
  state.quizItems.forEach((q, i) => {
    const wrapper = document.createElement('div');
    wrapper.style.margin = '12px 0';
    wrapper.className = 'quiz-question';
    wrapper.dataset.qIndex = String(i);

    let prompt;
    if (state.tab === 'flashcards') prompt = `${i + 1}. What is the correct Chinese for "${q.correct.en}"?`;
    else if (state.tab === 'kumon') prompt = `${i + 1}. Pick the sentence containing "${q.correct.zh}".`;

    if (state.tab === 'listening') {
      wrapper.innerHTML = `<div class="quiz-prompt"><button type="button" class="speaker quiz-audio-prompt" data-say="${q.correct.zh}" title="Play question audio">🔊</button></div>`;
    } else {
      wrapper.innerHTML = `<div class="quiz-prompt">${prompt}</div>`;
    }

    q.options.forEach((opt, idx) => {
      const id = `q${i}_${idx}`;
      const label = document.createElement('label');
      label.className = `quiz-option ${state.tab === 'listening' ? 'quiz-option-image' : ''}`;
      label.htmlFor = id;
      label.dataset.value = opt.en;

      if (state.tab === 'listening') {
        label.innerHTML = `<input id="${id}" type="radio" name="q${i}" value="${opt.en}" ${state.quizAnswers[i]===opt.en?'checked':''}/> <img class="quiz-answer-img" src="${opt.image}" data-fallback="${opt.fallbackImage || ''}" alt="${opt.en}" loading="lazy" /> <span class="quiz-mark" aria-hidden="true"></span>`;
      } else {
        label.innerHTML = `<input id="${id}" type="radio" name="q${i}" value="${opt.en}" ${state.quizAnswers[i]===opt.en?'checked':''}/> <span class="quiz-option-text">${opt.zh} (${opt.py})</span> <span class="quiz-mark" aria-hidden="true"></span>`;
      }

      label.querySelector('input').onchange = () => { state.quizAnswers[i] = opt.en; };
      wrapper.appendChild(label);
    });

    qHost.appendChild(wrapper);
  });

  attachImageFallbacks(quizHost);
  quizHost.querySelectorAll('.quiz-audio-prompt').forEach((btn) => {
    btn.onclick = () => speakChinese(btn.dataset.say || '');
  });

  document.getElementById('submitQuiz').onclick = () => {
    let score = 0;

    state.quizItems.forEach((q, i) => {
      const selected = state.quizAnswers[i];
      const isCorrect = selected === q.correct.en;
      if (isCorrect) score++;

      const questionEl = quizHost.querySelector(`.quiz-question[data-q-index="${i}"]`);
      if (!questionEl) return;

      questionEl.style.padding = '8px';
      questionEl.style.borderRadius = '8px';
      questionEl.style.border = isCorrect ? '1px solid #14532d' : '1px solid #7f1d1d';
      questionEl.style.background = isCorrect ? '#052e16' : '#450a0a';

      questionEl.querySelectorAll('.quiz-option').forEach((label) => {
        const value = label.dataset.value;
        const mark = label.querySelector('.quiz-mark');
        if (!mark) return;

        label.style.color = '#e2e8f0';
        mark.textContent = '';

        if (value === q.correct.en) {
          mark.textContent = ' ✅';
          label.style.color = '#86efac';
        }

        if (selected && value === selected && selected !== q.correct.en) {
          mark.textContent = ' ❌';
          label.style.color = '#fca5a5';
        }
      });
    });

    document.getElementById('quizResult').innerHTML = `<p class="score">Score: ${score}/${QUIZ_QUESTIONS}</p>`;
  };

  document.getElementById('restartSlides').onclick = () => {
    state.quizMode = false;
    state.reviewMode = false;
    state.slideIndex = 0;
    state.quizItems = [];
    resetCurrentSectionProgress();
    render();
  };
}

function render() {
  renderLevels();
  renderTabs();

  if (state.tab === 'review') {
    statusText.textContent = `Review Tab`;
    progressText.textContent = `Flagged items: ${getAllReviewItems().length}`;
    slideHost.classList.remove('hidden');
    quizHost.classList.add('hidden');
    renderReviewTab();
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const words = getLevelWords(state.level);
  const inSlides = state.slideIndex < SLIDES_PER_LEVEL;
  const progress = inSlides ? Math.round(((state.slideIndex + 1) / SLIDES_PER_LEVEL) * 100) : 100;

  statusText.textContent = inSlides
    ? `${state.reviewMode ? 'Review Mode · ' : ''}Level ${state.level} · Slide ${state.slideIndex + 1} / ${SLIDES_PER_LEVEL}`
    : `Level ${state.level} · Quiz (${QUIZ_QUESTIONS} questions)`;
  progressText.textContent = `Progress: ${progress}%`;

  if (!inSlides || state.quizMode) {
    renderQuiz(words);
    prevBtn.disabled = false;
    nextBtn.disabled = true;
    return;
  }

  slideHost.classList.remove('hidden');
  quizHost.classList.add('hidden');

  const word = words[state.slideIndex];
  if (state.tab === 'flashcards') renderFlash(word);
  else if (state.tab === 'kumon') renderKumon();
  else renderListening(word, words);

  renderReviewLaterControl();


  prevBtn.disabled = state.slideIndex === 0;
  nextBtn.disabled = !canAdvanceFromCurrentSlide();
}

prevBtn.onclick = () => {
  if (state.quizMode || state.tab === 'review') return;

  if (state.reviewMode) {
    const unresolved = getUnresolvedSlides();
    if (!unresolved.length) return;
    const pos = unresolved.indexOf(state.slideIndex);
    state.slideIndex = pos > 0 ? unresolved[pos - 1] : unresolved[unresolved.length - 1];
    render();
    return;
  }

  state.slideIndex = Math.max(0, state.slideIndex - 1);
  render();
};

nextBtn.onclick = () => {
  if (state.quizMode || state.tab === 'review') return;
  if (!canAdvanceFromCurrentSlide()) return;

  if (state.reviewMode) {
    const unresolved = getUnresolvedSlides();
    if (!unresolved.length) {
      state.reviewMode = false;
      state.quizMode = true;
      render();
      return;
    }

    const pos = unresolved.indexOf(state.slideIndex);
    state.slideIndex = pos >= 0 && pos < unresolved.length - 1 ? unresolved[pos + 1] : unresolved[0];
    render();
    return;
  }

  if (state.slideIndex < SLIDES_PER_LEVEL - 1) {
    state.slideIndex++;
    render();
    return;
  }

  const unresolved = getUnresolvedSlides();
  if (!unresolved.length) {
    state.quizMode = true;
  } else {
    state.reviewMode = true;
    state.slideIndex = unresolved[0];
  }
  render();
};

render();