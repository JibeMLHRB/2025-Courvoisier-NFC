import "../scss/index.scss";
import { data } from "./translation_data";


const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));


const getData = (name) => {
  if (localStorage.getItem(name)) {
    stats[name] = JSON.parse(localStorage.getItem(name))
  }
}

const setData = (name) => {
  localStorage.setItem(name, JSON.stringify(stats[name]))
}

var mode = "local"


var stats = {
  device_id: "GTR Demo",
  nVisit: 0,
  ageGate: [0, 0, 0],
  product0: [0, 0, 0, 0, 0],
  product1: [0, 0, 0, 0, 0],
  product2: [0, 0, 0, 0, 0],
  product3: [0, 0, 0, 0, 0],
  product4: [0, 0, 0, 0, 0],
  product5: [0, 0, 0, 0, 0],

}

getData('device_id')
document.querySelector('#device_id').value = stats.device_id



const visitStep = (nProduct, nStep) => {
  stats["product" + nProduct][nStep]++
  setData("product" + nProduct)
}


const newVisit = () => {
  stats.nVisit++
  setData("nVisit")

  console.warn('visit')
}

document.querySelector('#device_id').addEventListener('input', () => {
  stats.device_id = document.querySelector('#device_id').value
  setData('device_id')
})


var keys = Object.keys(stats);

keys.forEach(key => {
  getData(key)
})


//////// DATA TIME  ///////////

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
const ENDPOINT_URL = 'https://gtr.malherbe-paris.tech/api/data.post.php'; // à adapter


const MS_IN_24_HOURS = 24 * 60 * 60 * 1000;//24 * 60 * 60 * 1000
const RETRY_INTERVAL_MS = 10 * 1000; // 10s

function getLastSendTime() {
  const timestamp = localStorage.getItem('lastSendTime');
  console.log('lastSendTime', timestamp)

  return timestamp ? new Date(parseInt(timestamp, 10)) : null;
}

function setLastSendTime(date = new Date()) {
  localStorage.setItem('lastSendTime', date.getTime().toString());
}

function shouldSendData() {
  const lastSendTime = getLastSendTime();

  if (!lastSendTime) return true;
  const now = new Date();

  console.log(now - lastSendTime, MS_IN_24_HOURS)

  return now - lastSendTime >= MS_IN_24_HOURS;
}


function sendData() {
  var raw = JSON.stringify({
    "age_gate": {
      "yes": stats.ageGate[1],
      "no": stats.ageGate[2]
    },
    "device_id": stats.device_id.length > 0 ? stats.device_id : "GTR Demo",
    "number_of_sessions": stats.nVisit,
    "nfc_scans": stats.ageGate[0],
    "qr_code_views": stats['product0'][4] + stats['product1'][4] + stats['product2'][4] + stats['product3'][4] + stats['product4'][4] + stats['product5'][4],
    "extra": {
      "note_1": stats['product0'][0],
      "note_2": stats['product0'][1],
      "note_3": stats['product0'][2],
      "reveal": stats['product0'][3],
      "qr_code_views": stats['product0'][4],
    },
    "essence": {
      "note_1": stats['product1'][0],
      "note_2": stats['product1'][1],
      "note_3": stats['product1'][2],
      "reveal": stats['product1'][3],
      "qr_code_views": stats['product1'][4],
    },
    "vs": {
      "note_1": stats['product2'][0],
      "note_2": stats['product2'][1],
      "note_3": stats['product2'][2],
      "reveal": stats['product2'][3],
      "qr_code_views": stats['product2'][4],
    },
    "vsop": {
      "note_1": stats['product3'][0],
      "note_2": stats['product3'][1],
      "note_3": stats['product3'][2],
      "reveal": stats['product3'][3],
      "qr_code_views": stats['product3'][4],
    },
    "xo": {
      "note_1": stats['product4'][0],
      "note_2": stats['product4'][1],
      "note_3": stats['product4'][2],
      "reveal": stats['product4'][3],
      "qr_code_views": stats['product4'][4],
    },
    "xo_royal": {
      "note_1": stats['product5'][0],
      "note_2": stats['product5'][1],
      "note_3": stats['product5'][2],
      "reveal": stats['product5'][3],
      "qr_code_views": stats['product5'][4],
    }
  });


  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };


  return fetch(ENDPOINT_URL, requestOptions);
}

function attemptToSendDataWithRetry() {
  sendData()
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      console.warn('Data sent successfully');
      setLastSendTime(); // Update last send time only on success
    })
    .catch(err => {
      console.warn('Failed to send data. Retrying in 1 minute...', err);
      //setTimeout(attemptToSendDataWithRetry, RETRY_INTERVAL_MS);
    });
}

function checkData() {
  if (shouldSendData()) {
    attemptToSendDataWithRetry();
  } else {
    console.log('Data already sent in the last 24h. No action taken.', localStorage.getItem('lastSendTime'));
  }
}

// Lancement automatique au chargement de la page

window.addEventListener('load', ()=>{
  console.log('ready')
  sendData();
})

//window.addEventListener('load', checkData);
setInterval(checkData, 30000)

//////////////////

const products = [
  {
    slug: "extra",
    title: "COURVOISIER EXTRA",
    img: ['Extra_note1.png', 'Extra_note2.png', 'Extra_note3.png', 'Exrtra_Final.png'],
    video: ['extra1.mp4', 'extra2.mp4', 'extra3.mp4', 'extra4.mp4'],
    text: {
      "en": [
        'Like a winter’s delight, with a rich truffle aroma and notes of wild violets in bloom',
        'Decadence follows with deeper notes of port wine and cedar wood',
        'A long, spicy finish leaves pleasing hints of baked fruit cake',
        'Extra cognac is an elegant and rare blend of eaux de vie at the peak of flavour that perfectly marries Grande Champagne and Borderies crus with a touch of Petite Champagne distilled on the lees for complexity, depth and long lingering finish. This extraordinary blend is aged up to 50 years.'
      ],
      "zh-hs": [
        '宛如冬日的喜悦，散发着浓郁的松露香气和盛开的野紫罗兰的芬芳',
        '颓废之后，波特酒和雪松木的味道更加浓郁',
        '回味悠长而辛辣，留下令人愉悦的烤水果蛋糕的味道',
        'Extra 干邑是一种优雅而罕见的混合，是生命之水的巅峰之作，完美地将大香槟和博尔德里葡萄酒与在酒糟上蒸馏的小香槟相结合，具有复杂性、深度和持久的回味。这个 extraordinary 这种混合物可以陈化50年。'
      ],
      "zh-ht": [
        '猶如冬日的愉悅，散發著濃郁松露香氣，並帶有盛開野生紫羅蘭的細緻韻味。',
        '隨後是奢華的延續，波特酒與雪松木的深邃韻味交織其中。',
        '悠長的辛香回韻，留下烘烤水果蛋糕的迷人餘味。',
        'Extra 干邑是一款優雅而稀有的精選調和酒，融合了來自大香檳區和邊緣區的卓越酒液，並以少量 小香檳區酒液為基調，經陳年原酒發酵處理，賦予其複雜性、深度和悠長的回韻。這款非凡的調和酒，經過長達 50 年 的精心陳釀，完美呈現頂級風味。'
      ],
    }
  },
  {
    slug: "essence",
    title: "L'ESSENCE DE COURVOISIER",
    img: ['ESSENCE_note1.png', 'ESSENCE_note2.png', 'ESSENCE_note3.png', 'ESSENCE_Final.png'],
    video: ['essence1.mp4', 'essence2.mp4', 'essence3.mp4', 'essence4.mp4'],
    text: {
      "en": [
        'This complex Courvoisier cognac opens with exquisite notes of sandalwood and cigar leaves and just a hint of summer blossoms.',
        'What follows is a toffee, marzipan and fresh honey sweetness, sophisticated and indulgent.',
        'Full-bodied yet surprisingly delicate notes of liqourice, dried plum and apricot build up to a decadent, lingering finish.',
        `Our L'Essence de Courvoisier cognac is a blend of old Grande Champagne and Borderies reserves, combined with eaux-de-vie that showcase the House's art of distillation and ageing. This cognac is a true treasure of the House of Courvoisier.`
      ],
      "zh-hs": [
        '这个综合体  Courvoisier 干邑以精致的檀香和雪茄叶的香气开场，还有一丝夏日的花香。',
        '接下来是太妃糖、杏仁糖和新鲜蜂蜜的甜味，精致而放纵。',
        '酒体饱满，但令人惊讶的是，李、李子和杏子的香气令人回味悠长。',
        `我们的 L'Essence 的 Courvoisier 干邑是老大香槟和博尔德里储备的混合物，结合了生命之水，展示了酒庄的蒸馏和陈酿艺术。这款干邑是皇室的真正宝藏 Courvoisier.`
      ],
      "zh-ht": [
        '這款帶豐富口感的馥華詩干邑，開場便展現精緻的檀木與雪茄葉香氣，並輕輕透出一絲夏日花卉的芬芳。',
        '接下來是太妃糖、杏仁糖和新鮮蜂蜜的甜味，精緻而放縱。',
        '酒體飽滿，但令人驚訝的是，甘草、李子和杏桃的香氣令人回味悠長。',
        `我們的 L'Essence de Courvoisier 干邑匯聚大香檳區與邊緣區的珍稀陳釀調和酒，融合展現馥華詩蒸餾與陳釀藝術的非凡生命之水。這款干邑堪稱馥華詩酒莊的瑰寶，極致珍貴，獨具匠心。`
      ]
    }
  },
  {
    title: "COURVOISIER VS",
    slug: "vs",
    img: ['VS_note1.png', 'VS_note2.png', 'VS_note3.png', 'vs_final.png'],
    video: ['vs1.mp4', 'vs2.mp4', 'vs3.mp4', 'vs4.mp4'],
    text: {
      "en": [
        'The Bon Bois and the Fins Bois are distilled without lees, elevating the fruit notes of apple, pear, and grapefruit to the forefront.',
        'The spring blossom burst forth from the distinctive house style of Maison Courvoisier.',
        'The Petite Champagne distilled with lees adds complexity and length to our VS cognac, beautifully balanced with a fresh oaky finish.',
        'Courvoisier VS cognac is meticulously blended to defy category conventions. It is an authentic and joyous introduction to the Courvoisier collection.'
      ],
      "zh-hs": [
        '邦博伊斯和芬斯·博伊斯经过蒸馏，没有酒糟，将苹果、梨和葡萄柚的果味提升到了最前沿。',
        '春天的花朵从梅森独特的家居风格中绽放  Courvoisier.',
        '用酒糟蒸馏的小香槟为我们的葡萄酒增添了复杂性和持久性  VS 干邑白兰地，完美平衡，回味清新橡木味。',
        'Courvoisier VS 干邑白兰地经过精心混合，打破了品类惯例。这是一个真实而欢乐的介绍 Courvoisier 收藏。'
      ],
      "zh-ht": [
        '良質林區與優質林區採無酒糟蒸餾工藝，凸顯蘋果、西洋梨與葡萄柚的鮮明果香，層次分明，馥郁誘人。',
        '春日花香綻放，完美詮釋馥華詩酒莊獨特的經典風格。',
        '以酒糟蒸餾的小香檳區，為我們的 VS 干邑增添了層次與持久香氣，並與清新橡木餘韻完美平衡。',
        '馥華詩 VS 干邑精心調和，突破傳統桎梏，展現純正且怡人的風味體驗，為您開啟馥華詩珍藏的非凡之旅。'
      ]
    }
  },
  {
    title: "COURVOISIER VSOP",
    slug: "vsop",
    img: ['VSOP_note1.png', 'VSOP_note2.png', 'VSOP_note3.png', 'VSOP_Final.png'],
    video: ['vsop1.mp4', 'vsop2.mp4', 'vsop3.mp4', 'vsop4.mp4'],
    text: {
      "en": [
        'The maturity of late stone fruits, drawn from the Borderies, Petite Champagne and Grande Champagne unveil a unique complexity.',
        'Fins Bois allows for a soft summer Jasmine to take the lead in this blend.',
        'Aged up to twelve years in our own proprietary barrels, VSOP cognac’s aging techniques provide hints of gingerbread with a silky finish.',
        'The delicate marriage of 4 crus for a subtly floral, uniquely complex richness. Our VSOP cognac symbolizes the versatile and multi-layered nature of the House of Courvoisier.'
      ],
      "zh-hs": [
        '成熟的晚石果，从边界，娇小的香槟和大香槟揭示了一个独特的复杂性。',
        '芬斯·博伊斯让柔软的夏季茉莉在这种混合中处于领先地位。',
        '在我们自己的专有桶中陈酿长达12年  VSOP 干邑白兰地的陈酿技术提供了姜饼的味道，回味丝滑。',
        '4种葡萄的精致结合，带来微妙的花香，独特而复杂的丰富感。我们的 VSOP 干邑象征着房子的房子的多功能性和多层次性  Courvoisier.'
      ],
      "zh-ht": [
        '來自邊緣區、小香檳區與大香檳區的晚熟核果風味，淬煉出獨一無二的層次與深度。',
        '優質林區賦予這款調和酒柔和的夏日茉莉香氣。',
        '在獨家橡木桶中熟成長達十二年，VSOP 干邑展現精湛的陳釀工藝，帶來微妙的薑餅香氣與絲滑細緻的餘韻。',
        '四種風土的精緻結合，帶來微妙的花香，獨特而複雜的豐富口感。我們的 VSOP 干邑象徵著馥華詩家族的多元和多層次性的非凡魅力。'
      ]
    }
  },

  {
    title: "COURVOISIER XO",
    slug: "xo",
    img: ['XO_note1.png', 'XO_note2.png', 'XO_note3.png', 'XO_Final.png'],
    video: ['xo1.mp4', 'xo2.mp4', 'xo3.mp4', 'xo4.mp4'],
    text: {
      "en": [
        'The delicate yet rich fruit notes of fig, raisin, plum, and candied orange reveal an exquisitely layered and matured blend.',
        'An autumn bouquet with distinct notes of Iris.',
        'The eaux-de-vie are matured in proprietary barrels using complex aging techniques, for notes of crème brûlée and a long finish.',
        'Courvoisier XO pays homage to the Cognac region with carefully selected eaux-de-vie. The signature style of rich fruit XO tasting notes reveals an exquisitely layered blend with an elegant floral finish.'
      ],
      "zh-hs": [
        '无花果、葡萄干、李子和蜜饯橙的精致而浓郁的果香，展现出一种精致的层次感和成熟的混合。',
        '带有明显鸢尾花香气的秋天花束。',
        '生命之水在专有的木桶中使用复杂的陈酿技术成熟，带有焦糖布丁的味道和悠长的回味。',
        '古瓦西耶 XO 以精心挑选的生命之水向干邑地区致敬。XO 浓郁水果口味的标志性风格揭示了一种精致的分层混合，带有优雅的花香。'
      ],
      "zh-ht": [
        '無比細膩卻豐富的無花果、葡萄乾、李子與糖漬橙的果香，展現出層次分明、成熟醇厚的調和風味。',
        '宛如秋日花束，蘊含獨特的鳶尾花香氣。',
        '這些生命之水在專屬橡木桶中經過獨特的熟成技術，帶來焦糖布丁般的香氣，並擁有悠長的香氣。',
        '馥華詩 XO 以精心挑選的生命之水向干邑區致敬。其突出的豐富果香和 XO 風味，展現出層次分明的調和風味，並以優雅的花香收尾。'
      ]
    }
  },
  {
    title: "COURVOISIER XO ROYAL",
    slug: "xor",
    img: ['XOROYAL_note1.png', 'XOROYAL_note2.png', 'XOROYAL_note3.png', 'XOROYAL_Final.png'],
    video: ['xor1.mp4', 'xor2.mp4', 'xor3.mp4', 'xor4.mp4'],
    text: {
      "en": [
        'This deep amber elixir entices with a fine decadent truffle aroma followed with a bouquet of opulent summer blossoms',
        'A rich, full bodied cognac accentuated with toasted hazelnuts, subtle honey and cinnamon notes',
        'A long, powerful finish with notes of honey and cinnamon',
        'Introducing Courvoisier XO Royal cognac, a blend inspired by our historic cognacs that graced the royal courts of Europe. In the early 1900’s, Britain’s King Edward VII even commissioned his own blend, Edward VII Reserve, of which a few bottles can still be found in the Paradis Cellar in Jarnac – the starting point for our Master Blender, Patrice Pinet, to revive the perfect marriage of Fins Bois de Jarnac and Grande Champagne that is XO Royal.'
      ],
      "zh-hs": [
        '这款深琥珀色的灵丹妙药散发着精致颓废的松露香气，随后是一束华丽的夏季花朵',
        '浓郁醇厚的干邑白兰地，带有烤榛子、微妙的蜂蜜和肉桂味',
        '回味悠长，带有蜂蜜和肉桂的香气',
        '把介绍 Courvoisier XO Royal 干邑，灵感来自我们历史悠久的干邑，为 royal 欧洲法院。在20世纪初，英国国王爱德华七世甚至委托了他自己的混合物爱德华七世珍藏，其中几瓶仍然可以在雅尔纳克的帕拉迪斯酒窖中找到——这是我们的调酒大师帕特里斯比奈复兴翅片森林雅尔纳克和大香槟区完美结合的起点 XO Royal.'
      ],
      "zh-ht": [
        '這款深琥珀色的美酒，首先以細膩奢華的松露香氣令人沉醉，隨後綻放出一束奢華的夏日花卉芬芳。',
        '一款豐盈醇厚的干邑，點綴著烘烤榛果、細膩蜂蜜與肉桂香氣',
        '回味悠長，帶有蜂蜜和肉桂的香氣',
        '呈獻馥華詩 XO Royal 干邑，靈感來自我們歷史悠久的干邑，曾在歐洲皇家宮廷中譽滿寰中。20世紀初，英國愛德華七世國王曾特別委託調製屬於他的專屬佳釀：愛德華七世珍藏，其中數瓶至今仍可在位於雅爾納克的創始人酒窖中發現。這也是我們的首席調酒師 Patrice Pinet 重新詮釋 XO Royal 的起點，將雅爾納克的優質林區與大香檳區的完美融合帶回現世。'
      ]
    }
  }

]


const languages = [
  "en",
  "zh-hs",
  "zh-ht",
]

var lang = "en";

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('l') && languages.indexOf(urlParams.get('l')) > -1) {
  lang = urlParams.get('l')
} else if (languages.indexOf(navigator.language.substring(0, 2)) > -1) {
  lang = navigator.language.substring(0, 2)
}

if (navigator.language.substring(0, 2) == "zh") {

  if (navigator.language == "zh" || navigator.language == "zh-CN") {
    lang = "zh-hs"
  } else {
    lang = "zh-ht"
  }
}



//translate

export const translate = (initLang) => {

  document.body.setAttribute('id', 'lang-' + initLang)

  if (initLang) {
    lang = initLang
  }


  document.body.lang = lang
  document.documentElement.lang = lang

  if (lang == "ar") {
    document.body.dir = "rtl";

  } else {
    document.body.dir = "ltr";
  }



  const domChange = (data) => {
    const elements = document.querySelectorAll('h1,div, span, a, p, input,textarea,label')

    elements.forEach(element => {
      if (element.dataset.lang) {
        //console.log(data[element.dataset.lang][lang])
        element.innerHTML = data[element.dataset.lang][lang]
      }

    });
  }

  domChange(data)
}

console.warn('Language:', lang)
translate(lang)

// #debug

if (location.hash.substring(1) != "debug") {
  //document.addEventListener('contextmenu', event => event.preventDefault());
} else {
  document.body.classList.remove('pointer-none')
}


document.body.addEventListener("keydown", (e) => {
  if (e.code == "Space") {
    document.body.classList.toggle('pointer-none')
  }
});




const restart = () => {

  document.querySelector('.content-red').classList.add('off')

  document.querySelector('.age-content').classList.remove('active')
  document.querySelector('.age-content-title').classList.remove('active')

  stepProduct.classList.add('off')

  document.querySelector('.preloader').classList.add('appear')
  document.querySelector('.preloader').classList.remove('off')
  document.querySelector('footer').classList.add('off')

  setTimeout(() => {
    startTuto()

    if (mode != 'mobile') {
      translate('en')
    }

    videoTuto.currentTime = 0

    document.querySelector('.step-agegate').classList.add('off')
    document.querySelector('.step-note2').classList.add('off')
    document.querySelector('.step-note3').classList.add('off')
    document.querySelector('.step-note4').classList.add('off')
    document.querySelector('.step-qr').classList.add('off')
    document.querySelector('footer').classList.remove('off')

    if (mode == "mobile") {
      document.querySelector('.step-choice').classList.remove('off')
    }

  }, 2500)

  //newVisit()
}


let backHome;

if (location.hash.substring(1) != "debug") {

  document.body.addEventListener("pointerdown", (e) => {
    startTimer()
  })
}


const startTimer = () => {
  clearTimeout(backHome)
  backHome = setTimeout(() => {
    AgeGateOK = false;
    restart()
    if (location.hash.length == 0) {
      setTimeout(() => {
        if (mode != 'mobile') {
          translate('en')
        }

      }, 1000)
    }
  }, 60000) //1 minute
}

///////////////// XP //////////////////

var AgeGateOK = false;

// STARTS


const videoTuto = document.querySelector('.video-tuto')
const videoAgeGate = document.querySelector('.video-agegate')

const stepAgeGate = document.querySelector('.step-agegate')
const stepProduct = document.querySelector('.step-product')

const ctaReplay = document.querySelector('.cta-back')

const noteImg = document.querySelectorAll('.note-img')
const noteVideo = document.querySelectorAll('.video-note')
const noteText = document.querySelectorAll('.note-text')
const main = document.querySelector('main')

const startTuto = () => {
  document.querySelector('.preloader').classList.add('off')
  document.querySelector('.preloader').classList.remove('appear')
  document.querySelector('footer').classList.remove('off')
  videoTuto.currentTime = 0
  videoTuto.play()

  newVisit()
}


const qrCodes = document.querySelectorAll('.qr-code')

const redMsgs = document.querySelectorAll('.red-message')
var nProduct = 0

const feedProduct = (n) => {

  console.log('NPRODUCT ' + n)

  main.removeAttribute("class")
  main.classList.add(products[n].slug)

  noteImg.forEach((img, index) => {
    //img.setAttribute('src', "./images/" + products[n].img[index])
  })

  noteVideo.forEach((video, index) => {
    video.setAttribute('src', "./videos/" + products[n].video[index])
  })

  noteText.forEach((text, index) => {
    //console.log(n, lang, index)
    text.innerHTML = products[n].text[lang][index]
  })


  qrCodes.forEach((qr, index) => {
    if (index == n) {
      qr.classList.add('active')
    } else {
      qr.classList.remove('active')
    }
  })

  document.querySelector('.step-note4 .note-title').innerHTML = products[n].title

}

const startAgeGate = () => {

  startTimer()

  document.querySelector('.step-agegate').classList.remove('off')

  if (mode != "mobile") {
    document.querySelector('.content-red').classList.remove('off')
  }

  document.querySelector('.step-qr').classList.add('off')

  redMsgs[1].classList.remove('active')
  redMsgs[0].classList.add('active')
  document.querySelector('.age-content').classList.remove('active')
  document.querySelector('.age-content-title').classList.remove('active')

  videoAgeGate.currentTime = mode == "mobile" ? 4 : 0
  videoAgeGate.play()
  videoTuto.pause()

  stepProduct.classList.add('off')

  setTimeout(() => {

    document.querySelector('.step-note2').classList.add('off')
    document.querySelector('.step-note3').classList.add('off')
    document.querySelector('.step-note4').classList.add('off')

    noteImg[0].classList.remove('anim')
    noteImg[1].classList.remove('anim')
    noteImg[2].classList.remove('anim')
    noteImg[3].classList.remove('anim')

    feedProduct(nProduct)

  }, 1000)

  console.log("AgeGateOK", AgeGateOK)

  if (AgeGateOK) {
    setTimeout(() => {
      startProduct()
    }, 1800)

    setTimeout(() => {
      //videoAgeGate.pause()
    }, 2800)
  }


  stats.ageGate[0]++
  setData('ageGate')
}




const startProduct = () => {
  stepProduct.classList.remove('off')
  document.querySelector('.step-note1').classList.remove('off')
  document.querySelector('.step-note4').classList.add('off')
  document.querySelector('footer').classList.add('off')

  noteVideo[0].play()
  videoTuto.pause()

  document.querySelector('.content-red').classList.add('off')

  visitStep(nProduct, 0)
}



const startNote = (n) => {
  console.log('start note' + n)
  document.querySelector('.step-note' + n).classList.remove('off')
  document.querySelector('.video-note' + n).currentTime = 0
  document.querySelector('.video-note' + n).play()

  visitStep(nProduct, n - 1)
}


const replay = () => {

  if (mode == "mobile") {
    document.querySelector('.step-choice').classList.remove('off')
  }

  stepProduct.classList.add('off')
  document.querySelector('.age-content').classList.remove('active')
  document.querySelector('.age-content-title').classList.remove('active')


  videoTuto.currentTime = 0
  videoTuto.play()


  setTimeout(() => {


    document.querySelector('.step-note2').classList.add('off')
    document.querySelector('.step-note3').classList.add('off')
    document.querySelector('.step-note4').classList.add('off')
    document.querySelector('.step-qr').classList.add('off')
    document.querySelector('footer').classList.remove('off')

  }, 500)

  //newVisit()
}

ctaReplay.addEventListener('click', () => {
  replay()
})

document.querySelector('.cta-back-end').addEventListener('click', () => {
  replay()
})


document.querySelector('.cta-gift').addEventListener('click', () => {

  if (mode == "mobile") {
    var productName = document.querySelector('.select-box .selected').getAttribute('value')
    window.open('https://test.gtr.courvoisier.com/dev/discover/#' + productName)
    replay()
  }

  document.querySelector('.step-qr').classList.remove('off')
  visitStep(nProduct, 4)
})



document.querySelector('.cta-yes').addEventListener('click', () => {

  document.querySelector('.content-red').classList.add('off')
  AgeGateOK = true
  document.querySelector('.age-content').classList.remove('active')

  setTimeout(() => {
    document.querySelector('.age-content-title').classList.add('active')
  }, 0)

  setTimeout(() => {
    document.querySelector('.age-content-title').classList.remove('active')
  }, 2000)

  setTimeout(() => {
    startProduct()
  }, 3000)

  stats.ageGate[1]++
  setData('ageGate')
})

document.querySelector('.cta-no').addEventListener('click', () => {
  restart()

  stats.ageGate[2]++
  setData('ageGate')
})



document.querySelector('header img').addEventListener('pointerdown', () => {
  restart()
})



const ctaNotes = document.querySelectorAll('.cta-note')

ctaNotes.forEach((cta, index) => {
  cta.addEventListener('click', () => {

    console.warn("index", index)
    //document.querySelector('.video-note'+(index+1)).pause()
    stepAgeGate.classList.add('off')
    videoAgeGate.pause()
    videoAgeGate.currentTime = 0

    startNote(index + 2)

  })
})

//start XP
setTimeout(() => {
  startTuto()
}, 2000)


const tutoSlides = document.querySelectorAll('.tuto-slide')

const animate = () => {
  var time = videoTuto.currentTime

  tutoSlides[0].classList.remove('active')
  tutoSlides[1].classList.remove('active')
  tutoSlides[2].classList.remove('active')

  if (time > 2.5 && time < 5) {
    tutoSlides[0].classList.add('active')
  }

  if (time > 5.5 && time < 8) {
    tutoSlides[1].classList.add('active')
  }

  if (time > 8.5 && time < 11) {
    tutoSlides[2].classList.add('active')
  }


  if (videoAgeGate.currentTime > 3.2) {
    redMsgs[0].classList.remove('active')
    redMsgs[1].classList.add('active')

    if (!AgeGateOK) {
      document.querySelector('.age-content').classList.add('active')
    }

  } else {
    redMsgs[0].classList.add('active')
    redMsgs[1].classList.remove('active')
    document.querySelector('.age-content').classList.remove('active')
    document.querySelector('.age-content-title').classList.remove('active')
  }

  window.requestAnimationFrame(animate)
}
1


//debug

/*
stepTuto.addEventListener('click', () => {
  startAgeGate()
})
  */


window.addEventListener('keydown', (e) => {

  if (e.key > 0 && e.key < 7) {
    nProduct = e.key - 1
    console.log('SCAN PRODUCT', nProduct)

    startAgeGate()
  }


})

//start
window.requestAnimationFrame(animate)


//stat

const statNumbers = document.querySelectorAll('.stats-right')

function copy() {
  navigator.clipboard.writeText(JSON.stringify(stats))
}



const showStat = () => {


  statNumbers[0].innerHTML = stats.nVisit
  statNumbers[1].innerHTML = stats.ageGate[1] + " / " + stats.ageGate[2]
  statNumbers[2].innerHTML = stats['product0'][0] + " / " + stats['product0'][1] + " / " + stats['product0'][2] + " / " + stats['product0'][3]
  statNumbers[3].innerHTML = stats['product1'][0] + " / " + stats['product1'][1] + " / " + stats['product1'][2] + " / " + stats['product1'][3]
  statNumbers[4].innerHTML = stats['product2'][0] + " / " + stats['product2'][1] + " / " + stats['product2'][2] + " / " + stats['product2'][3]
  statNumbers[5].innerHTML = stats['product3'][0] + " / " + stats['product3'][1] + " / " + stats['product3'][2] + " / " + stats['product2'][3]
  statNumbers[6].innerHTML = stats['product4'][0] + " / " + stats['product4'][1] + " / " + stats['product4'][2] + " / " + stats['product3'][3]
  statNumbers[7].innerHTML = stats['product5'][0] + " / " + stats['product5'][1] + " / " + stats['product5'][2] + " / " + stats['product4'][3]

  statNumbers[8].innerHTML = stats.ageGate[0]
  statNumbers[9].innerHTML = stats['product0'][4] + stats['product1'][4] + stats['product2'][4] + stats['product3'][4] + stats['product4'][4] + stats['product5'][4]


  document.querySelector('.stats').classList.add('open')

}

var timerLogo;

document.querySelector('header img').addEventListener('pointerdown', () => {
  if (mode != 'mobile') {
    timerLogo = setTimeout(() => {

      stats.nVisit--
      setData("nVisit")

      showStat()
    }, 2500)
  }
})

document.body.addEventListener('pointerup', () => {
  clearTimeout(timerLogo)
})

document.querySelector('.cta-reset').addEventListener('click', () => {
  document.querySelector('.confirm').classList.add('open')
})

document.querySelector('.cta-conf-no').addEventListener('click', () => {
  document.querySelector('.confirm').classList.remove('open')
})

document.querySelector('.cta-conf-yes').addEventListener('click', () => {
  stats = {
    device_id: document.querySelector('#device_id').value,
    nVisit: 0,
    ageGate: [0, 0, 0],
    product0: [0, 0, 0, 0, 0],
    product1: [0, 0, 0, 0, 0],
    product2: [0, 0, 0, 0, 0],
    product3: [0, 0, 0, 0, 0],
    product4: [0, 0, 0, 0, 0],
    product5: [0, 0, 0, 0, 0],
  }

  console.log(stats)

  setData('nVisit')
  setData('ageGate')
  setData('product0')
  setData('product1')
  setData('product2')
  setData('product3')
  setData('product4')
  setData('product5')

  document.querySelector('.confirm').classList.remove('open')
  showStat()
})


document.querySelector('.close-cta').addEventListener('click', () => {
  document.querySelector('.stats').classList.remove('open')
})

//language

document.querySelector('.lang-cta').addEventListener('pointerup', () => {
  document.querySelector('.language').classList.add('open')

  document.body.addEventListener('pointerdown', () => {
    document.querySelector('.language').classList.remove('open')
  })
})


document.querySelectorAll('.lang-item').forEach(item => {

  item.addEventListener('pointerdown', () => {
    lang = item.dataset.language;
    translate(lang)
  })
})


//mobile

document.querySelector('.choice-select').addEventListener('click', () => {

  document.querySelector('.select-box').classList.add('open')
})


var nScent = 0

var options = document.querySelectorAll('.select-box div')

options.forEach((option, index) => {
  option.addEventListener('click', () => {



    options.forEach((o, i) => {
      if (index == i) {
        o.classList.add('selected')
      } else {
        o.classList.remove('selected')
      }
    })

    nScent = index
    document.querySelector('.select-box').classList.remove('open')
    document.querySelector('.choice-select span').innerHTML = option.innerHTML;
    document.querySelector('.choice-select span').dataset.lang = option.dataset.lang;
  })
})

document.querySelector('.cta-discover').addEventListener('click', () => {
  nProduct = nScent
  document.querySelector('.step-choice').classList.add('off')
  startAgeGate()
})

//tag managmnt

window.api.tagData((_, tagData) => {

  console.log(tagData);
  if (tagData.product) {

    console.warn(tagData.product)
    const tagIndex = Number(tagData.product) - 1;
    console.log(tagIndex)

    nProduct = tagIndex
    startAgeGate()
  }
});
