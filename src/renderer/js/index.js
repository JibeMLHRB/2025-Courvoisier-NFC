


///////////////////

import "../scss/index.scss";


const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));



const products = [
  {
    title: "COURVOISIER EXTRA",
    img: ['Extra_note1.png', 'Extra_note2.png', 'Extra_note3.png', 'Exrtra_Final.png'],
    text: [
      'Like a winter’s delight, with a rich truffle aroma and notes of wild violets in bloom',
      'Decadence follows with deeper notes of port wine and cedar wood',
      'A long, spicy finish leaves pleasing hints of baked fruit cake',
      'Extra cognac is an elegant and rare blend of eaux de vie at the peak of flavour that perfectly marries Grande Champagne and Borderies crus with a touch of Petite Champagne distilled on the lees for complexity, depth and long lingering finish. This extraordinary blend is aged up to 50 years.'
    ]
  },
  {
    title: "L'ESSENCE DE COURVOISIER",
    img: ['ESSENCE_note1.png', 'ESSENCE_note2.png', 'ESSENCE_note3.png', 'ESSENCE_Final.png'],
    text: [
      'This complex Courvoisier cognac opens with exquisite notes of sandalwood and cigar leaves and just a hint of summer blossoms.',
      'What follows is a toffee, marzipan and fresh honey sweetness, sophisticated and indulgent.',
      'Full-bodied yet surprisingly delicate notes of liqourice, dried plum and apricot build up to a decadent, lingering finish.',
      `Our L'Essence de Courvoisier cognac is a blend of old Grande Champagne and Borderies reserves, combined with eaux-de-vie that showcase the House's art of distillation and ageing. This cognac is a true treasure of the House of Courvoisier.`
    ]
  },
  {
    title: "COURVOISIER VS",
    img: ['VS_note1.png', 'VS_note2.png', 'VS_note3.png', 'VS_Final.png'],
    text: [
      'The Bon Bois and the Fins Bois are distilled without lees, elevating the fruit notes of apple, pear, and grapefruit to the forefront.',
      'The spring blossom burst forth from the distinctive house style of Maison Courvoisier.',
      'The Petite Champagne distilled with lees adds complexity and length to our VS cognac, beautifully balanced with a fresh oaky finish.',
      'Courvoisier VS cognac is meticulously blended to defy category conventions. It is an authentic and joyous introduction to the Courvoisier collection.'
    ]
  },
  {
    title: "COURVOISIER VSOP",
    img: ['VSOP_note1.png', 'VSOP_note2.png', 'VSOP_note3.png', 'VSOP_Final.png'],
    text: [
      'The maturity of late stone fruits, drawn from the Borderies, Petite Champagne and Grande Champagne unveil a unique complexity.',
      'Fins Bois allows for a soft summer Jasmine to take the lead in this blend.',
      'Aged up to twelve years in our own proprietary barrels, VSOP cognac’s aging techniques provide hints of gingerbread with a silky finish.',
      'The delicate marriage of 4 crus for a subtly floral, uniquely complex richness. Our VSOP cognac symbolizes the versatile and multi-layered nature of the House of Courvoisier.'
    ]
  },

  {
    title: "COURVOISIER XO",
    img: ['XO_note1.png', 'XO_note2.png', 'XO_note3.png', 'XO_Final.png'],
    text: [
      'The delicate yet rich fruit notes of fig, raisin, plum, and candied orange reveal an exquisitely layered and matured blend.',
      'An autumn bouquet with distinct notes of Iris.',
      'The eaux-de-vie are matured in proprietary barrels using complex aging techniques, for notes of crème brûlée and a long finish.',
      'Courvoisier XO pays homage to the Cognac region with carefully selected eaux-de-vie. The signature style of rich fruit XO tasting notes reveals an exquisitely layered blend with an elegant floral finish.'
    ]
  },
  {
    title: "COURVOISIER XO ROYAL",
    img: ['XOROYAL_note1.png', 'XOROYAL_note2.png', 'XOROYAL_note3.png', 'XOROYAL_Final.png'],
    text: [
      'This deep amber elixir entices with a fine decadent truffle aroma followed with a bouquet of opulent summer blossoms',
      'A rich, full bodied cognac accentuated with toasted hazelnuts, subtle honey and cinnamon notes',
      'A long, powerful finish with notes of honey and cinnamon',
      'Introducing Courvoisier XO Royal cognac, a blend inspired by our historic cognacs that graced the royal courts of Europe. In the early 1900’s, Britain’s King Edward VII even commissioned his own blend, Edward VII Reserve, of which a few bottles can still be found in the Paradis Cellar in Jarnac – the starting point for our Master Blender, Patrice Pinet, to revive the perfect marriage of Fins Bois de Jarnac and Grande Champagne that is XO Royal.'
    ]
  }

]




//console.log(navigator.userAgent.toLowerCase().indexOf('firefox') >= 0)
if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0) {
  document.querySelector('video').setAttribute('src', '../videos/short264.mp4')
}

const languages = [
  "en",
  "fr",
  "it",
  "es",
  "de",
  "ko",
  "ja",
  "zh-hs",
  "zh-ht",
  "ar",
  "bi"
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

console.warn('Language:', lang)

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
        //console.log(element.dataset.lang)
        element.innerHTML = data[element.dataset.lang][lang]
      }

    });
  }

  domChange(data)
}

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

document.querySelector('.lang-cta').addEventListener('click', () => {
  document.querySelector('.language').classList.add('open')
})

document.querySelector('.language .close-footer').addEventListener('click', () => {
  document.querySelector('.language').classList.remove('open')
})



const restart = () => {

  document.querySelector('.content-red').classList.add('off')
  document.querySelector('.step-agegate').classList.add('off')
  document.querySelector('.age-content').classList.remove('active')

  stepProduct.classList.add('off')


  document.querySelector('.preloader').classList.remove('off')
  document.querySelector('footer').classList.add('off')

  setTimeout(() => {
    startTuto()

    document.querySelector('.step-note2').classList.add('off')
    document.querySelector('.step-note3').classList.add('off')
    document.querySelector('.step-note4').classList.add('off')

    noteImg[0].classList.remove('anim')
    noteImg[1].classList.remove('anim')
    noteImg[2].classList.remove('anim')
    noteImg[3].classList.remove('anim')

  }, 1500)
}


let backHome;

if (location.hash.substring(1) != "debug") {
  document.body.addEventListener("touchstart", (e) => {
    clearTimeout(backHome)
    backHome = setTimeout(() => {


      restart()

      if (location.hash.length == 0) {
        setTimeout(() => {
          translate('en')
        }, 1000)
      }


    }, 600000) //1 minute
  })
}


///////////////// XP //////////////////

var AgeGateOK = false;

// STARTS


const videoTuto = document.querySelector('.video-tuto')
const videoAgeGate = document.querySelector('.video-agegate')

const videoNote1 = document.querySelector('.video-note1')
const stepAgeGate = document.querySelector('.step-agegate')
const stepProduct = document.querySelector('.step-product')
const stepTuto = document.querySelector('.step-tuto')

const ctaReplay = document.querySelector('.cta-back')

const noteImg = document.querySelectorAll('.note-img')
const noteText = document.querySelectorAll('.note-text')

const startTuto = () => {
  document.querySelector('.preloader').classList.add('off')
  videoTuto.currentTime = 0
  videoTuto.play()
  window.requestAnimationFrame(animate)
}

const redMsgs = document.querySelectorAll('.red-message')
var nProduct = 0

const feedProduct = (n) => {

  console.log('NPRODUCT ' + n)

  noteImg.forEach((img, index) => {
    img.setAttribute('src', "./images/" + products[n].img[index])
  })


  noteText.forEach((text, index) => {
    text.innerHTML = products[n].text[index]
  })


  document.querySelector('.step-note4 .note-title').innerHTML = products[n].title

}

const startAgeGate = () => {



  document.querySelector('.step-agegate').classList.remove('off')
  document.querySelector('.content-red').classList.remove('off')

  redMsgs[1].classList.remove('active')
  redMsgs[0].classList.add('active')
  document.querySelector('.age-content').classList.remove('active')

  videoAgeGate.currentTime = 0
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



}




const startProduct = () => {
  stepProduct.classList.remove('off')
  document.querySelector('.step-note1').classList.remove('off')
  document.querySelector('.step-note4').classList.add('off')
  document.querySelector('footer').classList.add('off')

  //videoNote1.play()
  videoTuto.pause()


  noteImg[0].classList.add('anim')

  AgeGateOK = true
  document.querySelector('.content-red').classList.add('off')

}



const startNote = (n) => {
  console.log('start note' + n)
  document.querySelector('.step-note' + n).classList.remove('off')
  //document.querySelector('.video-note' + n).currentTime = 0
  //document.querySelector('.video-note' + n).play()
  noteImg[n - 1].classList.add('anim')

  console.log(n - 1)
}


const replay = () => {

  stepProduct.classList.add('off')
  document.querySelector('.age-content').classList.remove('active')

  videoTuto.currentTime = 0
  videoTuto.play()


  setTimeout(() => {

    document.querySelector('.step-note1').classList.add('off')
    document.querySelector('.step-note2').classList.add('off')
    document.querySelector('.step-note3').classList.add('off')
    document.querySelector('.step-note4').classList.add('off')

    noteImg[0].classList.remove('anim')
    noteImg[1].classList.remove('anim')
    noteImg[2].classList.remove('anim')
    noteImg[3].classList.remove('anim')

  }, 500)
}

ctaReplay.addEventListener('click', () => {
  replay()
})


document.querySelector('.cta-yes').addEventListener('click', () => {
  startProduct()
})

document.querySelector('.cta-no').addEventListener('click', () => {
  restart()
})



document.querySelector('header img').addEventListener('click', () => {
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
}, 1000)


const tutoSlides = document.querySelectorAll('.tuto-slide')

const animate = () => {
  var time = videoTuto.currentTime
  console.log()

  tutoSlides[0].classList.remove('active')
  tutoSlides[1].classList.remove('active')
  tutoSlides[2].classList.remove('active')

  if (time > .5 && time < 2.5) {
    tutoSlides[0].classList.add('active')
  }

  if (time > 2.5 && time < 4.5) {
    tutoSlides[1].classList.add('active')
  }

  if (time > 4.5 && time < 6.5) {
    tutoSlides[2].classList.add('active')
  }


  if (videoAgeGate.currentTime > 2.7) {
    redMsgs[0].classList.remove('active')
    redMsgs[1].classList.add('active')
    document.querySelector('.age-content').classList.add('active')
  } else {
    redMsgs[0].classList.add('active')
    redMsgs[1].classList.remove('active')
    document.querySelector('.age-content').classList.remove('active')
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


// save data



