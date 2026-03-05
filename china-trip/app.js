async function init() {
  const data = await fetch('trip-data.json').then((r) => r.json());

  document.getElementById('print-btn')?.addEventListener('click', () => window.print());

  const hero = document.querySelector('.hero');
  const heroImg = data.itinerary?.find((d) => d.attraction?.img)?.attraction?.img;
  if (hero && heroImg) {
    hero.style.backgroundImage = `linear-gradient(rgba(15,23,42,.55),rgba(15,23,42,.45)),url('${heroImg}')`;
  }

  const toMin = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
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
  const cityCoords = {
    'Hong Kong': '22.3193~114.1694',
    'Shenzhen': '22.5431~114.0579',
    "Xi'an": '34.3416~108.9398',
    'Chengdu': '30.5728~104.0668',
    'Chongqing': '29.5630~106.5516',
    'Yunnan': '25.0438~102.7100',
    'Travel Day': '22.3193~114.1694'
  };
  const embedFromCity = (city) => `https://www.bing.com/maps/embed?h=280&w=500&cp=${cityCoords[city] || cityCoords['Hong Kong']}&lvl=12&typ=d&sty=r&src=SHELL&FORM=MBEDV8`;

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
    const attractionUrl = dayPlan?.attraction?.url || d.attraction?.url;
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

    let mealIdx = 0;
    const rows = d.schedule.map((s) => {
      let text = s.plan;
      let itemUrl = '';
      let mapTarget = `${d.city} ${d.stayArea || ''}`;

      if (!isTravelDay && s.type === 'activity' && s.time === '09:00' && dayPlan?.walk) {
        text = `Scenic walk / sightseeing: ${dayPlan.walk}`;
        mapTarget = `${dayPlan.walk}, ${baseCity}`;
      }

      if (!isTravelDay && s.type === 'activity' && s.time === '14:30' && dayPlan?.attraction?.name) {
        text = `Featured attraction: ${dayPlan.attraction.name}${leaveHotel ? ` (leave stay area by ${leaveHotel})` : ''}`;
        itemUrl = dayPlan.attraction.url || '';
        mapTarget = `${dayPlan.attraction.name}, ${baseCity}`;
      }

      if (!isTravelDay && s.type === 'meal') {
        const picks = cityDining[baseCity] || [];
        const pick = picks[mealIdx % Math.max(1, picks.length)] || null;
        if (pick) {
          text = `${s.time === '18:30' && dayPlan?.evening ? `Dinner + evening plan: ${dayPlan.evening}. ` : ''}Meal suggestion: ${pick.name}${s.time === '18:30' && leaveAttraction ? ` (leave attraction by ${leaveAttraction})` : ''}`;
          itemUrl = pick.url || '';
          mapTarget = `${pick.name}, ${baseCity}`;
          mealIdx += 1;
        }
      }

      if (s.type === 'rest') {
        text = `Rest stop near suggested stay area: ${d.stayArea || baseCity}`;
        mapTarget = `${d.stayArea || baseCity}`;
      }

      const mapQueryRow = encodeURIComponent(mapTarget);
      const rowMapLink = `https://www.bing.com/maps/default.aspx?where1=${mapQueryRow}&lvl=12&style=r`;
      const rowMapEmbed = embedFromCity(baseCity);
      const rowMapEmbedAlt = `https://www.bing.com/maps/default.aspx?where1=${mapQueryRow}&lvl=12&style=r&FORM=MBEDLD`;
      const linkHtml = itemUrl ? `<a href='${itemUrl}' target='_blank' rel='noreferrer'>Website</a>` : '';
      const mapToggleHtml = `<a href='${rowMapLink}' class='js-map-toggle' data-embed='${rowMapEmbed}' data-embed-alt='${rowMapEmbedAlt}' data-open-label='Map' data-close-label='Hide map' target='_blank' rel='noreferrer'>Map</a><div class='map-frame js-map-frame'></div>`;

      const rowClass = s.type === 'meal' ? 'row-meal' : s.type === 'rest' ? 'row-rest' : s.type === 'activity' ? 'row-activity' : '';
      const rowHasBg = rowClass === 'row-activity' && !!(d.attraction?.img);
      const rowClassFull = `${rowClass}${rowHasBg ? ' has-bg' : ''}`.trim();
      const rowStyle = rowHasBg ? ` style="--row-bg:url('${d.attraction.img}')"` : '';

      return `<tr class='${rowClassFull}'${rowStyle}><td>${s.time}</td><td>${text}<div class='plan-links'>${linkHtml}${mapToggleHtml}</div></td><td>${s.type}</td></tr>`;
    }).join('');

    const planningHtml = meta
      ? `<div class='timing'>
          <p><strong>Attraction cost:</strong> Adult ~CAD $${meta.ticketCADAdult}, Child ~CAD $${meta.ticketCADChild}, Family of 3 ~CAD $${familyTicket}</p>
          <p><strong>Transit (stay area → attraction):</strong> ~${(meta.transitMin / 60).toFixed(1)} hrs</p>
          <p><strong>Average stay:</strong> ~${Math.round(meta.stayMin / 60 * 10) / 10} hrs</p>
          <p><strong>Recommended leave times:</strong> Leave stay area by <strong>${leaveHotel}</strong>; leave attraction by <strong>${leaveAttraction}</strong> to stay on schedule.</p>
        </div>`
      : '';

    const mapQuery = encodeURIComponent(`${attractionName || d.city}, ${baseCity || d.city}`);
    const mapLink = `https://www.bing.com/maps/default.aspx?where1=${mapQuery}&lvl=12&style=r`;
    const mapEmbed = embedFromCity(baseCity);
    const mapEmbedAlt = `https://www.bing.com/maps/default.aspx?where1=${mapQuery}&lvl=12&style=r&FORM=MBEDLD`;

    const mapHtml = `
      <div class='map-wrap'>
        <a href='${mapLink}' class='map-link js-map-toggle' data-embed='${mapEmbed}' data-embed-alt='${mapEmbedAlt}' data-open-label='🗺️ View map for this day' data-close-label='🗺️ Hide map for this day' target='_blank' rel='noreferrer'>🗺️ View map for this day</a>
        <div class='map-frame js-map-frame'></div>
      </div>
    `;

    const attractionHtml = attractionName && !isTravelDay
      ? `<div class='attraction'><img src='${d.attraction?.img || ''}' alt='${attractionName}' /><div><p><strong>Featured attraction:</strong> ${attractionName}</p><p><a href='${attractionUrl}' target='_blank' rel='noreferrer'>Official/reference link</a></p>${planningHtml}${d.notes ? `<p><strong>Transit notes:</strong> ${d.notes}</p>` : ''}${mapHtml}</div></div>`
      : `${d.notes ? `<p><strong>Notes:</strong> ${d.notes}</p>` : ''}${mapHtml}`;

    sec.innerHTML = `<div class='dayhead'><div><h3>Day ${idx + 1} - ${d.date} (${d.weekday})</h3><div class='meta'>City: <strong>${d.city}</strong><br><strong>Suggested stay area:</strong> ${d.stayArea || 'TBD'}</div></div><div class='cost'>Estimated daily cost: CAD $${d.estimatedCostCAD.toLocaleString()}</div></div><table class='schedule'><thead><tr><th style='width:120px'>Time</th><th>Plan</th><th style='width:120px'>Type</th></tr></thead><tbody>${rows}</tbody></table>${attractionHtml}`;

    days.appendChild(sec);
  });

  const mountBingFrame = (container, primary, alt, href) => {
    const token = Date.now();
    container.innerHTML = `<iframe loading="eager" referrerpolicy="strict-origin-when-cross-origin" src="${primary}${primary.includes('?') ? '&' : '?'}_t=${token}" allowfullscreen></iframe><div style="padding:8px 10px;font-size:12px;border-top:1px solid #dce3ef">If blank, trying alternate embed… <a href="${href}" target="_blank" rel="noreferrer">Open Bing Maps</a></div>`;
    const iframe = container.querySelector('iframe');

    const fallback = setTimeout(() => {
      if (!iframe.dataset.loaded && alt) {
        iframe.src = `${alt}${alt.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      }
    }, 2500);

    iframe.addEventListener('load', () => {
      iframe.dataset.loaded = '1';
      clearTimeout(fallback);
    });
  };

  document.querySelectorAll('.js-map-toggle').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const frame = link.parentElement.querySelector('.js-map-frame');
      const embed = link.dataset.embed;
      const embedAlt = link.dataset.embedAlt;
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
        mountBingFrame(frame, embed, embedAlt, href);
        link.textContent = closeLabel;
      }
    });
  });

  document.getElementById('total-cost').textContent = `Estimated total trip cost: CAD $${total.toLocaleString()} (draft estimate)`;
}

init();
