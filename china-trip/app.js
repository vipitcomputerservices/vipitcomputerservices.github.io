async function init() {
  const data = await fetch('trip-data.json').then((r) => r.json());

  document.getElementById('print-btn')?.addEventListener('click', () => window.print());

  const firstFlightRaw = data?.tickets?.outbound?.[0]?.depart || '';
  const firstFlightIso = firstFlightRaw
    .replace(' EST', '-05:00')
    .replace(' EDT', '-04:00')
    .replace(' CST', '+08:00');
  const firstFlightAt = new Date(firstFlightIso.replace(' ', 'T'));
  const countdownEl = document.getElementById('countdown-value');
  const renderCountdown = () => {
    if (!countdownEl || Number.isNaN(firstFlightAt.getTime())) return;
    const now = new Date();
    const diffMs = firstFlightAt.getTime() - now.getTime();
    if (diffMs <= 0) {
      countdownEl.textContent = 'Departed';
      return;
    }
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    countdownEl.textContent = `${days}d ${hours}h`;
  };
  renderCountdown();
  setInterval(renderCountdown, 60 * 1000);

  const hero = document.querySelector('.hero');
  const heroImg = data.itinerary?.find((d) => d.attraction?.img)?.attraction?.img;
  if (hero && heroImg) {
    hero.style.backgroundImage = `linear-gradient(rgba(15,23,42,.55),rgba(15,23,42,.45)),url('${heroImg}')`;
  }

  const toMin = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  const parseClockMin = (text) => {
    const m = String(text || '').match(/(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return Number(m[1]) * 60 + Number(m[2]);
  };
  const toHHMM = (mins) => {
    const m = ((mins % 1440) + 1440) % 1440;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  const attendees = document.getElementById('attendees');
  data.attendees.forEach((a) => {
    const li = document.createElement('li');
    li.textContent = `${a.name} (${a.age})`;
    attendees.appendChild(li);
  });

  const outbound = document.getElementById('outbound');
  if (data.tickets.confirmationNumber) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>Confirmation:</strong> ${data.tickets.confirmationNumber} | <strong>Traveler:</strong> ${data.tickets.traveler || ''}`;
    outbound.appendChild(p);
  }
  data.tickets.outbound.forEach((f) => {
    const p = document.createElement('p');
    p.textContent = `${f.flight}: ${f.from} -> ${f.to} | ${f.depart} -> ${f.arrive}`;
    outbound.appendChild(p);
  });

  const ret = document.getElementById('return');
  data.tickets.return.forEach((f) => {
    const p = document.createElement('p');
    p.textContent = `${f.flight}: ${f.from} -> ${f.to} | ${f.depart} -> ${f.arrive}`;
    ret.appendChild(p);
  });

  const optimizedByCity = {
    'Hong Kong': [
      { walk: 'Kowloon Waterfront Promenade + Star Ferry views', attraction: { name: 'Avenue of Stars + TST Harbourfront', url: 'https://www.discoverhongkong.com/eng/explore/great-outdoor/avenue-of-stars.html' }, evening: 'Symphony of Lights + easy harbour dinner' },
      { walk: 'Ngong Ping village scenic paths', attraction: { name: 'Ngong Ping 360 + Tian Tan Buddha', url: 'https://www.np360.com.hk/en/' }, evening: 'Temple Street night market' },
      { walk: 'Dragon’s Back coastal nature hike', attraction: { name: 'Shek O coastal stop after hike', url: 'https://www.discoverhongkong.com/eng/explore/great-outdoor/dragons-back.html' }, evening: 'West Kowloon Art Park sunset' },
      { walk: 'Peak Circle Walk', attraction: { name: 'Victoria Peak tram + skyline lookout', url: 'https://www.thepeak.com.hk/en' }, evening: 'PMQ + SoHo stroll' }
    ],
    'Shenzhen': [
      { walk: 'Shenzhen Bay Park seaside walk', attraction: { name: 'Ping An Finance Center observatory', url: 'https://www.pafcskymall.cn/en/' }, evening: 'Coco Park district' },
      { walk: 'Lianhuashan park summit path', attraction: { name: 'OCT Loft art district', url: 'https://www.travelchinaguide.com/cityguides/guangdong/shenzhen/splendid-china.htm' }, evening: 'Nantou Ancient City' },
      { walk: 'Dameisha boardwalk', attraction: { name: 'Dameisha beach coast + viewpoints', url: 'https://www.travelchinaguide.com/cityguides/guangdong/shenzhen/dameisha.htm' }, evening: 'Seafood dinner near coast' }
    ],
    "Xi'an": [
      { walk: 'Ancient City Wall west segment walk', attraction: { name: 'Terracotta Army museum', url: 'http://www.bmy.com.cn/' }, evening: 'Muslim Quarter food lane' },
      { walk: 'Bell Tower to Drum Tower old-city walk', attraction: { name: 'Great Mosque historical district', url: 'https://www.travelchinaguide.com/attraction/shaanxi/xian/great-mosque.htm' }, evening: 'Tang-style district' },
      { walk: 'Tang Paradise gardens', attraction: { name: 'Shaanxi History Museum', url: 'https://www.sxhm.com/en/' }, evening: 'South Gate night stroll' }
    ],
    'Chengdu': [
      { walk: 'People’s Park tea-walk loop', attraction: { name: 'Chengdu Panda Base early entry', url: 'http://www.panda.org.cn/english/' }, evening: 'Kuanzhai Alley night snacks' },
      { walk: 'Wenshu Monastery lanes', attraction: { name: 'Wenshu Monastery + old teahouses', url: 'https://www.travelchinaguide.com/cityguides/sichuan/chengdu/wenshu-monastery.htm' }, evening: 'Jinjiang riverside walk' },
      { walk: 'Qingcheng foothill nature walk', attraction: { name: 'Dujiangyan irrigation scenic area', url: 'https://www.travelchinaguide.com/attraction/sichuan/chengdu/dujiangyan.htm' }, evening: 'Hotpot in central Chengdu' }
    ],
    'Chongqing': [
      { walk: 'Nanbin Road riverfront walk', attraction: { name: 'Hongya Cave district', url: 'https://www.travelchinaguide.com/cityguides/chongqing/hongyadong.htm' }, evening: 'Riverside skyline photos' },
      { walk: 'Jiefangbei city-core loop', attraction: { name: 'Yangtze cable car + river crossing', url: 'https://www.travelchinaguide.com/cityguides/chongqing/yangtze-river-cableway.htm' }, evening: 'Night market grazing' },
      { walk: 'Hilly old-street stair routes', attraction: { name: 'Liziba train-through-building viewpoint', url: 'https://www.chinadiscovery.com/chongqing-tours/liziba-station.html' }, evening: 'Ciqikou old town' }
    ],
    'Yunnan': [
      { walk: 'Kunming Green Lake park path', attraction: { name: 'Stone Forest karst area', url: 'https://www.travelchinaguide.com/attraction/yunnan/kunming/stoneforest/' }, evening: 'Kunming old street' },
      { walk: 'Erhai lakeside section', attraction: { name: 'Dali Ancient Town + Three Pagodas zone', url: 'https://www.chinadiscovery.com/yunnan/dali/erhai-lake.html' }, evening: 'Dali lakeside sunset' },
      { walk: 'Lijiang Old Town canal lanes', attraction: { name: 'Black Dragon Pool', url: 'https://www.travelchinaguide.com/cityguides/yunnan/lijiang/' }, evening: 'Lijiang old town lights' },
      { walk: 'Tiger Leaping Gorge viewpoint trail', attraction: { name: 'Tiger Leaping Gorge scenic section', url: 'https://www.travelchinaguide.com/attraction/yunnan/lijiang/tiger-leaping-gorge.htm' }, evening: 'Early rest' }
    ]
  };

  const attractionMeta = {
    'Avenue of Stars + TST Harbourfront': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 25, stayMin: 90 },
    'Ngong Ping 360 + Tian Tan Buddha': { ticketCADAdult: 45, ticketCADChild: 30, transitMin: 55, stayMin: 210 },
    'Shek O coastal stop after hike': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 60, stayMin: 180 },
    'Victoria Peak tram + skyline lookout': { ticketCADAdult: 20, ticketCADChild: 10, transitMin: 35, stayMin: 120 },
    'Ping An Finance Center observatory': { ticketCADAdult: 40, ticketCADChild: 25, transitMin: 30, stayMin: 90 },
    'OCT Loft art district': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 35, stayMin: 120 },
    'Dameisha beach coast + viewpoints': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 50, stayMin: 150 },
    'Terracotta Army museum': { ticketCADAdult: 30, ticketCADChild: 15, transitMin: 70, stayMin: 180 },
    'Great Mosque historical district': { ticketCADAdult: 10, ticketCADChild: 5, transitMin: 25, stayMin: 90 },
    'Shaanxi History Museum': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 30, stayMin: 120 },
    'Chengdu Panda Base early entry': { ticketCADAdult: 20, ticketCADChild: 10, transitMin: 45, stayMin: 180 },
    'Wenshu Monastery + old teahouses': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 25, stayMin: 100 },
    'Dujiangyan irrigation scenic area': { ticketCADAdult: 25, ticketCADChild: 12, transitMin: 80, stayMin: 180 },
    'Hongya Cave district': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 25, stayMin: 120 },
    'Yangtze cable car + river crossing': { ticketCADAdult: 8, ticketCADChild: 5, transitMin: 30, stayMin: 90 },
    'Liziba train-through-building viewpoint': { ticketCADAdult: 0, ticketCADChild: 0, transitMin: 35, stayMin: 60 },
    'Stone Forest karst area': { ticketCADAdult: 35, ticketCADChild: 18, transitMin: 75, stayMin: 210 },
    'Dali Ancient Town + Three Pagodas zone': { ticketCADAdult: 25, ticketCADChild: 12, transitMin: 45, stayMin: 180 },
    'Black Dragon Pool': { ticketCADAdult: 14, ticketCADChild: 7, transitMin: 30, stayMin: 120 },
    'Tiger Leaping Gorge scenic section': { ticketCADAdult: 20, ticketCADChild: 10, transitMin: 90, stayMin: 210 }
  };

  const suggestionCards = {
    'Hong Kong': ['Chi Lin Nunnery gardens', 'Man Mo Temple', 'K11 Musea waterfront'],
    'Shenzhen': ['Talent Park sunset', 'Shenzhen Museum', 'Happy Harbour'],
    "Xi'an": ['Datang Everbright City', 'Forest of Stone Steles', 'Little Wild Goose Pagoda'],
    'Chengdu': ['Jinli old street', 'IFS panda sculpture', 'Sichuan Opera face-changing show'],
    'Chongqing': ['Raffles City skydeck', 'Eling Park', 'Mountain city walkway'],
    'Yunnan': ['Shuhe Ancient Town', 'Yulong Snow Mountain area', 'Blue Moon Valley boardwalk']
  };

  const transferOptions = [
    { route: 'Hong Kong → Shenzhen', trainMin: 20, trainCAD: 18, busMin: 85, busCAD: 9, flightMin: null, flightCAD: null, stationAccessMin: 30, stationExitMin: 25, busAccessMin: 35, busExitMin: 30, airportAccessMin: 0, airportExitMin: 0 },
    { route: 'Shenzhen → Xi\'an', trainMin: 540, trainCAD: 130, busMin: 1560, busCAD: 95, flightMin: 180, flightCAD: 210, stationAccessMin: 35, stationExitMin: 35, busAccessMin: 35, busExitMin: 35, airportAccessMin: 55, airportExitMin: 45 },
    { route: 'Xi\'an → Chengdu', trainMin: 255, trainCAD: 80, busMin: 330, busCAD: 45, flightMin: 150, flightCAD: 190, stationAccessMin: 35, stationExitMin: 30, busAccessMin: 40, busExitMin: 35, airportAccessMin: 50, airportExitMin: 40 },
    { route: 'Chengdu → Chongqing', trainMin: 110, trainCAD: 35, busMin: 180, busCAD: 18, flightMin: null, flightCAD: null, stationAccessMin: 35, stationExitMin: 30, busAccessMin: 40, busExitMin: 35, airportAccessMin: 0, airportExitMin: 0 },
    { route: 'Chongqing → Kunming', trainMin: 360, trainCAD: 95, busMin: 450, busCAD: 55, flightMin: 165, flightCAD: 170, stationAccessMin: 35, stationExitMin: 35, busAccessMin: 40, busExitMin: 35, airportAccessMin: 50, airportExitMin: 45 },
    { route: 'Yunnan (Kunming) → Hong Kong', trainMin: null, trainCAD: null, busMin: 1680, busCAD: 120, flightMin: 180, flightCAD: 240, stationAccessMin: 0, stationExitMin: 0, busAccessMin: 45, busExitMin: 40, airportAccessMin: 55, airportExitMin: 50 }
  ];

  const fmtHours = (mins) => `${(mins / 60).toFixed(1)} hrs`;
  const DOMESTIC_FLIGHT_BUFFER_MIN = 150; // 2h early arrival + 0.5h baggage pickup
  const effectiveTrainMin = (o) => (o.trainMin ? o.trainMin + o.stationAccessMin + o.stationExitMin : null);
  const effectiveBusMin = (o) => (o.busMin ? o.busMin + o.busAccessMin + o.busExitMin : null);
  const effectiveFlightMin = (o) => (o.flightMin ? o.flightMin + DOMESTIC_FLIGHT_BUFFER_MIN + o.airportAccessMin + o.airportExitMin : null);

  const decideTransfer = (o) => {
    const trainEff = effectiveTrainMin(o);
    const busEff = effectiveBusMin(o);
    const flightEff = effectiveFlightMin(o);

    if (busEff && trainEff) {
      const busPenalty = busEff - trainEff;
      const busSavings = (o.trainCAD || 0) - (o.busCAD || 0);
      if (busPenalty <= 75 && busSavings >= 20) {
        return `✅ Recommend charter bus option (time loss ~${fmtHours(busPenalty)}, saves ~CAD $${busSavings}/person).`;
      }
    }

    if (trainEff && flightEff) {
      const flightSavingsVsTrain = trainEff - flightEff;
      if (flightSavingsVsTrain >= 120) {
        return `✅ Recommend flight (net savings ~${fmtHours(flightSavingsVsTrain)} vs train after full access/buffer time).`;
      }
      return `✅ Recommend bullet train (flight only saves ~${fmtHours(Math.max(0, flightSavingsVsTrain))} after full access/buffer time).`;
    }

    if (trainEff && !flightEff) return `✅ Recommend bullet train (best balance of time and comfort).`;
    if (flightEff) return `✅ Recommend flight (effective door-to-door ~${fmtHours(flightEff)}).`;
    return 'Use local transfer/driver option as needed.';
  };

  const waypoints = document.getElementById('waypoints');
  Object.entries(suggestionCards).forEach(([city, spots]) => {
    const box = document.createElement('article');
    box.className = 'waypoint';
    box.innerHTML = `<div class="city">${city}</div><div class="spot">${spots.join(' · ')}</div>`;
    waypoints.appendChild(box);
  });

  const transfers = document.getElementById('transfers');
  transferOptions.forEach((o) => {
    const el = document.createElement('article');
    el.className = 'transfer';
    el.innerHTML = `
      <div class="route">${o.route}</div>
      <div class="spot">
        Train: ${o.trainMin ? `${fmtHours(o.trainMin)} rail + ${fmtHours(o.stationAccessMin + o.stationExitMin)} terminal access = ${fmtHours(effectiveTrainMin(o))} total · CAD $${o.trainCAD}` : 'N/A'}<br>
        Charter bus: ${o.busMin ? `${fmtHours(o.busMin)} drive + ${fmtHours(o.busAccessMin + o.busExitMin)} terminal access = ${fmtHours(effectiveBusMin(o))} total · CAD $${o.busCAD}` : 'N/A'}<br>
        Flight: ${o.flightMin ? `${fmtHours(o.flightMin)} air + ${fmtHours(DOMESTIC_FLIGHT_BUFFER_MIN)} airport process + ${fmtHours(o.airportAccessMin + o.airportExitMin)} airport access = ${fmtHours(effectiveFlightMin(o))} total · CAD $${o.flightCAD}` : 'N/A'}
      </div>
      <div class="decision">${decideTransfer(o)}</div>
    `;
    transfers.appendChild(el);
  });

  const getBaseCity = (city) => city.replace(' (Departure Prep)', '').trim();
  const cityVisitCount = {};
  const googleMapLink = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const googleMapEmbed = (query) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  const referenceUrlByName = {
    'Avenue of Stars': 'https://en.wikipedia.org/wiki/Avenue_of_Stars,_Hong_Kong',
    'Avenue of Stars + TST Harbourfront': 'https://en.wikipedia.org/wiki/Avenue_of_Stars,_Hong_Kong',
    'Victoria Peak': 'https://en.wikipedia.org/wiki/Victoria_Peak',
    'Victoria Peak tram + skyline lookout': 'https://en.wikipedia.org/wiki/Victoria_Peak',
    'Ngong Ping 360 + Tian Tan Buddha': 'https://en.wikipedia.org/wiki/Ngong_Ping_360',
    'Shek O coastal stop after hike': 'https://en.wikipedia.org/wiki/Shek_O',
    'Ping An Finance Center': 'https://en.wikipedia.org/wiki/Ping_An_Finance_Centre',
    'Ping An Finance Center observatory': 'https://en.wikipedia.org/wiki/Ping_An_Finance_Centre',
    'OCT Loft art district': 'https://en.wikivoyage.org/wiki/Shenzhen',
    'Dameisha beach coast + viewpoints': 'https://en.wikivoyage.org/wiki/Shenzhen',
    'Terracotta Army': 'https://en.wikipedia.org/wiki/Terracotta_Army',
    'Terracotta Army museum': 'https://en.wikipedia.org/wiki/Terracotta_Army',
    'Great Mosque historical district': 'https://en.wikipedia.org/wiki/Great_Mosque_of_Xi%27an',
    'Shaanxi History Museum': 'https://en.wikipedia.org/wiki/Shaanxi_History_Museum',
    'Chengdu Panda Base': 'https://en.wikipedia.org/wiki/Chengdu_Research_Base_of_Giant_Panda_Breeding',
    'Chengdu Panda Base early entry': 'https://en.wikipedia.org/wiki/Chengdu_Research_Base_of_Giant_Panda_Breeding',
    'Wenshu Monastery + old teahouses': 'https://en.wikivoyage.org/wiki/Chengdu',
    'Dujiangyan irrigation scenic area': 'https://en.wikipedia.org/wiki/Dujiangyan',
    'Hongya Cave': 'https://en.wikipedia.org/wiki/Hongyadong',
    'Hongya Cave district': 'https://en.wikipedia.org/wiki/Hongyadong',
    'Yangtze cable car + river crossing': 'https://en.wikipedia.org/wiki/Yangtze_River_Cableway',
    'Liziba train-through-building viewpoint': 'https://en.wikipedia.org/wiki/Liziba_station',
    'Stone Forest (Kunming)': 'https://en.wikipedia.org/wiki/Stone_Forest',
    'Stone Forest karst area': 'https://en.wikipedia.org/wiki/Stone_Forest',
    'Dali Ancient Town + Three Pagodas zone': 'https://en.wikipedia.org/wiki/Three_Pagodas',
    'Black Dragon Pool': 'https://en.wikivoyage.org/wiki/Lijiang',
    'Tiger Leaping Gorge scenic section': 'https://en.wikipedia.org/wiki/Tiger_Leaping_Gorge'
  };

  const wikiTitleByAttraction = {
    'Avenue of Stars': 'Avenue_of_Stars,_Hong_Kong',
    'Avenue of Stars + TST Harbourfront': 'Avenue_of_Stars,_Hong_Kong',
    'Victoria Peak': 'Victoria_Peak',
    'Victoria Peak tram + skyline lookout': 'Victoria_Peak',
    'Ngong Ping 360 + Tian Tan Buddha': 'Ngong_Ping_360',
    'Shek O coastal stop after hike': 'Shek_O',
    'Ping An Finance Center': 'Ping_An_Finance_Centre',
    'Ping An Finance Center observatory': 'Ping_An_Finance_Centre',
    'Terracotta Army': 'Terracotta_Army',
    'Terracotta Army museum': 'Terracotta_Army',
    'Great Mosque historical district': "Great_Mosque_of_Xi'an",
    'Shaanxi History Museum': 'Shaanxi_History_Museum',
    'Chengdu Panda Base': 'Chengdu_Research_Base_of_Giant_Panda_Breeding',
    'Chengdu Panda Base early entry': 'Chengdu_Research_Base_of_Giant_Panda_Breeding',
    'Dujiangyan irrigation scenic area': 'Dujiangyan',
    'Hongya Cave': 'Hongyadong',
    'Hongya Cave district': 'Hongyadong',
    'Yangtze cable car + river crossing': 'Yangtze_River_Cableway',
    'Liziba train-through-building viewpoint': 'Liziba_station',
    'Stone Forest (Kunming)': 'Stone_Forest',
    'Stone Forest karst area': 'Stone_Forest',
    'Dali Ancient Town + Three Pagodas zone': 'Three_Pagodas',
    'Tiger Leaping Gorge scenic section': 'Tiger_Leaping_Gorge'
  };

  const normalizeReferenceUrl = (name, fallback = '') => referenceUrlByName[name] || fallback || '';

  const wikiThumbCache = {};
  const fetchWikiThumb = async (title) => {
    if (!title) return '';
    if (wikiThumbCache[title] !== undefined) return wikiThumbCache[title];
    try {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=1200&origin=*&titles=${encodeURIComponent(title)}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('wiki thumb fetch failed');
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const page = Object.values(pages)[0] || {};
      const src = page?.thumbnail?.source || '';
      wikiThumbCache[title] = src;
      return src;
    } catch {
      wikiThumbCache[title] = '';
      return '';
    }
  };

  const commonsThumbCache = {};
  const fetchCommonsThumb = async (query) => {
    if (!query) return '';
    if (commonsThumbCache[query] !== undefined) return commonsThumbCache[query];
    try {
      const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=1&gsrsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('commons thumb fetch failed');
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const page = Object.values(pages)[0] || {};
      const ii = page?.imageinfo?.[0] || {};
      const src = ii?.thumburl || ii?.url || '';
      commonsThumbCache[query] = src;
      return src;
    } catch {
      commonsThumbCache[query] = '';
      return '';
    }
  };

  const cityDining = {
    'Hong Kong': [
      { name: 'Yat Lok Roast Goose', url: 'https://www.openrice.com/en/hongkong/r-yat-lok-roast-goose-central-guangdong-roast-meat-r11795' },
      { name: 'Mak\'s Noodle', url: 'https://www.openrice.com/en/hongkong/r-maks-noodle-central-guangdong-noodles-r11784' },
      { name: 'Australia Dairy Company', url: 'https://www.openrice.com/en/hongkong/r-australia-dairy-company-jordan-hong-kong-style-r3338' }
    ],
    'Shenzhen': [
      { name: 'Social All Day Dining (Futian)', url: 'https://www.tripadvisor.com/Restaurant_Review-g297415-d10251332-Reviews-Social_All_Day_Dining_Restaurant-Shenzhen_Guangdong.html' },
      { name: 'Bus Grill (Coco Park)', url: '' },
      { name: 'Ba He Li Hai Ji Niu Rou Dian', url: '' }
    ],
    "Xi'an": [
      { name: 'De Fa Chang Dumpling Banquet', url: 'https://www.tripadvisor.com/Restaurant_Review-g298557-d4471159-Reviews-De_Fa_Chang_Restaurant-Xi_an_Shaanxi.html' },
      { name: 'First Noodle Under The Sun', url: '' },
      { name: 'Muslim Quarter BBQ Stalls', url: '' }
    ],
    'Chengdu': [
      { name: 'Chen Mapo Tofu', url: 'https://www.tripadvisor.com/Restaurant_Review-g297463-d3510566-Reviews-Chen_Mapo_Doufu-Chengdu_Sichuan.html' },
      { name: 'Yu\'s Family Kitchen', url: '' },
      { name: 'Shu Jiu Xiang Hotpot', url: '' }
    ],
    'Chongqing': [
      { name: 'Qin Ma Hotpot', url: 'https://www.tripadvisor.com/Restaurant_Review-g294213-d3504362-Reviews-Qin_Ma_Hotpot-Chongqing.html' },
      { name: 'Da Dui Zhang Lao Hotpot', url: '' },
      { name: 'Jiefangbei Noodle Shops', url: '' }
    ],
    'Yunnan': [
      { name: 'Grandma\'s Kitchen (Kunming)', url: '' },
      { name: 'The Sweet Tooth (Dali)', url: '' },
      { name: 'N\'s Kitchen (Lijiang)', url: '' }
    ]
  };

  const itinerary = [...data.itinerary];
  if (itinerary.length >= 2) {
    const d1 = itinerary[0];
    const d2 = itinerary[1];
    itinerary.splice(0, 2, {
      ...d1,
      weekday: `${d1.weekday} + ${d2.weekday}`,
      city: 'Travel Day',
      attraction: null,
      estimatedCostCAD: (d1.estimatedCostCAD || 0) + (d2.estimatedCostCAD || 0),
      notes: 'Combined D1 + D2 travel buffer. Arrival in Hong Kong: Apr 14 at 6:55 PM (HKT).',
      schedule: d1.schedule
    });
  }

  const attractionImageByName = {};
  const attractionNames = new Set();
  itinerary.forEach((d) => {
    if (d.attraction?.name) attractionNames.add(d.attraction.name);
  });
  Object.values(optimizedByCity).flat().forEach((plan) => {
    if (plan?.attraction?.name) attractionNames.add(plan.attraction.name);
  });

  await Promise.all([...attractionNames].map(async (name) => {
    const title = wikiTitleByAttraction[name];
    let img = title ? await fetchWikiThumb(title) : '';
    if (!img) img = await fetchCommonsThumb(name);
    if (img) attractionImageByName[name] = img;
  }));

  let total = 0;
  const days = document.getElementById('days');

  itinerary.forEach((d, idx) => {
    total += d.estimatedCostCAD;
    const sec = document.createElement('section');
    sec.className = 'day';

    const baseCity = getBaseCity(d.city);
    const isTravelDay = d.city === 'Travel Day';

    if (!cityVisitCount[baseCity]) cityVisitCount[baseCity] = 0;
    const visitIndex = cityVisitCount[baseCity]++;

    const cityPlan = optimizedByCity[baseCity] || [];
    const dayPlan = cityPlan.length ? cityPlan[visitIndex % cityPlan.length] : null;

    const attractionName = dayPlan?.attraction?.name || d.attraction?.name;
    const attractionUrl = normalizeReferenceUrl(attractionName, dayPlan?.attraction?.url || d.attraction?.url);
    const featuredImageBase = attractionImageByName[attractionName] || (attractionName === d.attraction?.name ? (d.attraction?.img || '') : '') || `https://picsum.photos/seed/${encodeURIComponent(attractionName || d.city)}/1200/800`;
    const featuredImage = `${featuredImageBase}${featuredImageBase.includes('?') ? '&' : '?'}v=${idx + 1}`;
    const meta = attractionMeta[attractionName] || null;

    const attractionTime = '14:30';
    const dinnerTime = '18:30';
    let leaveHotel = null;
    let leaveAttraction = null;
    let familyTicket = null;

    if (meta) {
      leaveHotel = toHHMM(toMin(attractionTime) - meta.transitMin);
      leaveAttraction = toHHMM(toMin(dinnerTime) - meta.transitMin);
      familyTicket = meta.ticketCADAdult * 2 + meta.ticketCADChild;
    }

    const transitSuggestion = (origin, destination, isMajor = false, minutesHint = 35) => {
      if (isMajor) {
        const notes = (d.notes || '').toLowerCase();
        if (notes.includes('flight')) return { mode: 'flight', modeLabel: 'Flight', minutes: 180, costCAD: 210, mapsMode: 'transit' };
        if (notes.includes('bullet train') || notes.includes('hsr')) return { mode: 'train', modeLabel: 'Train', minutes: 240, costCAD: 95, mapsMode: 'transit' };
        return { mode: 'train', modeLabel: 'Train', minutes: 240, costCAD: 95, mapsMode: 'transit' };
      }
      const mode = 'taxi';
      const modeLabel = 'Ground transfer';
      const costCAD = 12;
      return { mode, modeLabel, minutes: minutesHint, costCAD, mapsMode: 'driving' };
    };

    const directionsLink = (origin, destination, mapsMode) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mapsMode}`;
    const directionsEmbed = (origin, destination, mapsMode) => `https://www.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${mapsMode === 'driving' ? 'd' : 'r'}&output=embed`;

    const baseSchedule = [...d.schedule];
    const earliestEventMin = baseSchedule.map((x) => parseClockMin(x.time)).filter((x) => x !== null).sort((a, b) => a - b)[0] ?? toMin('07:30');
    const wakeMin = Math.max(0, earliestEventMin - 60);
    const sleepMin = wakeMin + (16 * 60); // 8h sleep window preserved
    const wakeTime = toHHMM(wakeMin);
    const sleepTime = toHHMM(sleepMin);
    if (!baseSchedule.some((x) => x.type === 'wake')) {
      baseSchedule.unshift({ time: wakeTime, plan: 'Wake up', type: 'wake', exactTime: true });
    }
    if (!baseSchedule.some((x) => x.type === 'sleep')) {
      baseSchedule.push({ time: sleepTime, plan: 'Sleep (8h target)', type: 'sleep', exactTime: true });
    }

    const isMajorTravelEvent = (s) => {
      if (s.type !== 'travel') return false;
      const txt = `${s.plan || ''} ${d.notes || ''}`.toLowerCase();
      return /flight|\bua\d+\b|bullet train|\bhsr\b|high-speed rail|high speed rail/.test(txt);
    };

    const filteredSchedule = baseSchedule.filter((s) => {
      if (s.type === 'meal') return false;
      if (s.type === 'travel') return isMajorTravelEvent(s);
      return true;
    });

    const scheduleWithRanges = filteredSchedule.map((s, i) => {
      if (s.exactTime || s.type === 'wake' || s.type === 'sleep') {
        return { ...s, timeLabel: s.time };
      }
      const start = parseClockMin(s.time);
      let end = null;
      for (let j = i + 1; j < filteredSchedule.length; j += 1) {
        const candidate = parseClockMin(filteredSchedule[j].time);
        if (candidate !== null) {
          end = candidate;
          break;
        }
      }
      if (start === null) return { ...s, timeLabel: s.time };
      if (end === null || end <= start) end = start + 60;
      const duration = (end - start) / 60;
      const timeLabel = `${toHHMM(start)} - ${toHHMM(end)} (${duration.toFixed(1)} hours)`;
      return { ...s, timeLabel };
    });

    const rows = scheduleWithRanges.map((s) => {
      let text = s.plan;
      let itemUrl = '';
      let mapTarget = `${d.city} ${d.stayArea || ''}`;
      const origin = d.stayArea || baseCity;
      const rowParts = [];

      if (!isTravelDay && s.type === 'activity' && s.time === '09:00' && dayPlan?.walk) {
        text = `Scenic walk / sightseeing: ${dayPlan.walk}`;
        mapTarget = `${dayPlan.walk}, ${baseCity}`;
      }

      if (!isTravelDay && s.type === 'activity' && s.time === '14:30' && dayPlan?.attraction?.name) {
        text = `Featured attraction: ${dayPlan.attraction.name}${leaveHotel ? ` (leave stay area by ${leaveHotel})` : ''}`;
        itemUrl = normalizeReferenceUrl(dayPlan.attraction.name, dayPlan.attraction.url || '');
        mapTarget = `${dayPlan.attraction.name}, ${baseCity}`;
      }

      if (s.type === 'rest') {
        text = `Rest stop near suggested stay area: ${d.stayArea || baseCity}`;
        mapTarget = `${d.stayArea || baseCity}`;
      }

      const isMajorTravel = isMajorTravelEvent(s);

      const rowMapLink = googleMapLink(mapTarget);
      const rowMapEmbed = googleMapEmbed(mapTarget);
      const linkHtml = itemUrl ? `<a href='${itemUrl}' target='_blank' rel='noreferrer'>Website</a>` : '';
      const mapToggleHtml = (s.type === 'wake' || s.type === 'sleep')
        ? ''
        : isMajorTravel
          ? `<a href='${rowMapLink}' class='js-map-toggle' data-embed='${rowMapEmbed}' data-open-label='Map' data-close-label='Hide map' target='_blank' rel='noreferrer'>Hide map</a><div class='map-frame js-map-frame' style='display:block'><iframe loading="eager" referrerpolicy="strict-origin-when-cross-origin" src="${rowMapEmbed}" allowfullscreen></iframe></div>`
          : `<a href='${rowMapLink}' class='js-map-toggle' data-embed='${rowMapEmbed}' data-open-label='Map' data-close-label='Hide map' target='_blank' rel='noreferrer'>Map</a><div class='map-frame js-map-frame'></div>`;

      const rowClass = s.type === 'wake' ? 'row-wake' : s.type === 'sleep' ? 'row-sleep' : s.type === 'meal' ? 'row-meal' : s.type === 'rest' ? 'row-rest' : s.type === 'activity' ? 'row-activity' : s.type === 'travel' ? 'row-major-travel' : '';
      const rowHasBg = rowClass === 'row-activity' && !!featuredImage;
      const rowClassFull = `${rowClass}${rowHasBg ? ' has-bg' : ''}`.trim();
      const rowStyle = rowHasBg ? ` style="--row-bg:url('${featuredImage}')"` : '';

      rowParts.push(`<tr class='${rowClassFull}'${rowStyle}><td>${s.timeLabel || s.time}</td><td>${text}<div class='plan-links'>${linkHtml}${mapToggleHtml}</div></td><td>${isMajorTravel ? 'major travel' : s.type}</td></tr>`);
      return rowParts.join('');
    }).join('');

    const planningHtml = meta
      ? `<div class='timing'>
          <p><strong>Attraction cost:</strong> Adult ~CAD $${meta.ticketCADAdult}, Child ~CAD $${meta.ticketCADChild}, Family of 3 ~CAD $${familyTicket}</p>
          <p><strong>Transit (stay area → attraction):</strong> ~${(meta.transitMin / 60).toFixed(1)} hrs</p>
          <p><strong>Average stay:</strong> ~${Math.round(meta.stayMin / 60 * 10) / 10} hrs</p>
          <p><strong>Recommended leave times:</strong> Leave stay area by <strong>${leaveHotel}</strong>; leave attraction by <strong>${leaveAttraction}</strong> to stay on schedule.</p>
        </div>`
      : '';

    const mapTargetDay = `${attractionName || d.city}, ${baseCity || d.city}`;
    const mapLink = googleMapLink(mapTargetDay);
    const mapEmbed = googleMapEmbed(mapTargetDay);

    const mapHtml = `
      <div class='map-wrap'>
        <a href='${mapLink}' class='map-link js-map-toggle' data-embed='${mapEmbed}' data-open-label='🗺️ View map for this day' data-close-label='🗺️ Hide map for this day' target='_blank' rel='noreferrer'>🗺️ View map for this day</a>
        <div class='map-frame js-map-frame'></div>
      </div>
    `;

    const attractionHtml = attractionName && !isTravelDay
      ? `<div class='attraction'><img src='${featuredImage}' alt='${attractionName}' onerror="this.onerror=null;this.src='https://picsum.photos/seed/${encodeURIComponent(attractionName || d.city)}/1200/800';" /><div><p><strong>Featured attraction:</strong> ${attractionName}</p><p><a href='${attractionUrl}' target='_blank' rel='noreferrer'>Official/reference link</a></p>${planningHtml}${d.notes ? `<p><strong>Transit notes:</strong> ${d.notes}</p>` : ''}${mapHtml}</div></div>`
      : `${d.notes ? `<p><strong>Notes:</strong> ${d.notes}</p>` : ''}${mapHtml}`;

    sec.innerHTML = `<div class='dayhead'><div><h3>Day ${idx + 1} - ${d.date} (${d.weekday})</h3><div class='meta'>City: <strong>${d.city}</strong><br><strong>Suggested stay area:</strong> ${d.stayArea || 'TBD'}</div></div><div class='cost'>Estimated daily cost: CAD $${d.estimatedCostCAD.toLocaleString()}</div></div><table class='schedule'><thead><tr><th style='width:120px'>Time</th><th>Plan</th><th style='width:120px'>Type</th></tr></thead><tbody>${rows}</tbody></table>${attractionHtml}`;

    days.appendChild(sec);
  });

  const mountMapFrame = (container, embedUrl, href) => {
    const token = Date.now();
    container.innerHTML = `<iframe loading="eager" referrerpolicy="strict-origin-when-cross-origin" src="${embedUrl}${embedUrl.includes('?') ? '&' : '?'}_t=${token}" allowfullscreen></iframe><div style="padding:8px 10px;font-size:12px;border-top:1px solid #dce3ef"><a href="${href}" target="_blank" rel="noreferrer">Open in Google Maps</a></div>`;
  };

  document.querySelectorAll('.js-map-toggle').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const frame = link.parentElement.querySelector('.js-map-frame');
      const embed = link.dataset.embed;
      const href = link.getAttribute('href');
      const expanded = frame.style.display === 'block';

      const openLabel = link.dataset.openLabel || 'View map';
      const closeLabel = link.dataset.closeLabel || 'Hide map';

      if (expanded) {
        frame.style.display = 'none';
        frame.innerHTML = '';
        link.textContent = openLabel;
      } else {
        frame.style.display = 'block';
        mountMapFrame(frame, embed, href);
        link.textContent = closeLabel;
      }
    });
  });

  document.getElementById('total-cost').textContent = `Estimated total trip cost: CAD $${total.toLocaleString()} (draft estimate)`;
}

init();
