// 1. Imports
// ----------

import $ from "jquery";
import '@vime/core';
import Plyr from 'plyr';
import tippy, {followCursor} from 'tippy.js';
import Swiper, { Navigation, Pagination, EffectFade, Keyboard, Autoplay} from 'swiper';
import Cookies from 'js-cookie';
import Foundation from 'foundation-sites';
import AOS from 'aos';
import Swup from 'swup';
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupGaPlugin from '@swup/ga-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';


$( document ).ready( function() {
  function init() {

// 2. Foundation
// ----------
  
Foundation.Interchange.SPECIAL_QUERIES['medium-retina'] = 'only screen and (min-width: 40em), (min-width: 40em) and (-webkit-min-device-pixel-ratio: 2), (min-width: 40em) and (min--moz-device-pixel-ratio: 2), (min-width: 40em) and (-o-min-device-pixel-ratio: 2/1), (min-width: 40em) and (min-device-pixel-ratio: 2), (min-width: 40em) and (min-resolution: 192dpi), (min-width: 40em) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['large-retina'] = 'only screen and (min-width: 64em), (min-width: 64em) and (-webkit-min-device-pixel-ratio: 2), (min-width: 64em) and (min--moz-device-pixel-ratio: 2), (min-width: 64em) and (-o-min-device-pixel-ratio: 2/1), (min-width: 64em) and (min-device-pixel-ratio: 2), (min-width: 64em) and (min-resolution: 192dpi), (min-width: 64em) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['xlarge-retina'] = 'only screen and (min-width: 75em), (min-width: 75em) and (-webkit-min-device-pixel-ratio: 2), (min-width: 75em) and (min--moz-device-pixel-ratio: 2), (min-width: 75em) and (-o-min-device-pixel-ratio: 2/1), (min-width: 75em) and (min-device-pixel-ratio: 2), (min-width: 75em) and (min-resolution: 192dpi), (min-width: 75em) and (min-resolution: 2dppx)';
Foundation.Interchange.SPECIAL_QUERIES['xxlarge-retina'] = 'only screen and (min-width: 90em), (min-width: 75em) and (-webkit-min-device-pixel-ratio: 2), (min-width: 75em) and (min--moz-device-pixel-ratio: 2), (min-width: 75em) and (-o-min-device-pixel-ratio: 2/1), (min-width: 75em) and (min-device-pixel-ratio: 2), (min-width: 75em) and (min-resolution: 192dpi), (min-width: 75em) and (min-resolution: 2dppx)';
  
$(document).foundation();


$(function() {
  let isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  if (isIOS) {
    $("video.video--background").attr("playsinline", "")
  }

  $("video.video--background source").each(function(i) {
    var sourceFile = $(this).attr("data-src");
    $(this).attr("src", sourceFile);
    var video = this.parentElement;

      setTimeout(function () {
        if (!video.__played) {
         video.load()
        }
      }, 2000)
  });
  handleVideoPlay(mySwiper)
});


$(function() {

  const $videos = $("video.video--background source")


  const index = 0
  const loadOneByOne = () => {
    var $video = $videos.eq(index)
    var sourceFile = $video.attr("data-src");
    $video.attr("src", sourceFile);
    var video = $video.get(0).parentElement;
    video.onload = function () {
      ++index;
      loadOneByOne()
    }
    video.load();
    if (index === 0) {
       video.play()
    }
  }  

  loadOneByOne()
});

// 3. Loading
// ----------


tippy('[data-tippy-content]', {
  placement: 'bottom',
  followCursor: true,
  theme: 'custom',
  flip: false,
  plugins: [followCursor]
})

// 3. Navigation Background
// -------------

$(function () {
  $(document).scroll(function () {
    var $nav = $("nav");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});

// 5. Carousel
// -----------


// https://stackoverflow.com/a/36389263
var getTimeout = function(){var e=setTimeout,b={};setTimeout=function(a,c){var d=e(a,c);b[d]=[Date.now(),c];return d};return function(a){return(a=b[a])?Math.max(a[1]-Date.now()+a[0],0):NaN}}();

// https://curtistimson.co.uk/post/js/default-negative-variables-to-zero-in-javascript/
function sanitisePercentage(i){
  return Math.min(100,Math.max(0,i));
}

// Slider
var percentTime;
var tick;
var progressBar = document.querySelector('.swiper-hero-progress');

// configure Swiper to use modules
Swiper.use([Navigation, Pagination, EffectFade, Keyboard, Autoplay]);

const swiper = new Swiper();
var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
 autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
 effect: 'fade',
 fadeEffect: {
    crossFade: true
  },
  loop: true,
  
  // If we need pagination
  pagination: {
    el: '.swiper-pagination-test',
    type: 'fraction',
    formatFractionCurrent: (number) => '0' + number,
    formatFractionTotal: (number) => '0' + number,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.button-next, .swiper-slide',
    prevEl: '.button-prev',
  },
  keyboard: {
    enabled: true,
  },
  on: {
    slideChange: function() {
          var swiper = this;
      var defaultSlideDelay = swiper.params.autoplay.delay;
      var currentIndex = swiper.realIndex + 1;
      var currentSlide = swiper.slides[currentIndex];
      var currentSlideDelay = currentSlide.getAttribute('data-swiper-autoplay') || defaultSlideDelay;
      
      updateSwiperProgressBar(progressBar, currentSlideDelay);
    }
  }
})

function updateSwiperProgressBar(bar, slideDelay) {

  function startProgressBar() {
    resetProgressBar();
    tick = setInterval(progress, 50);
  }

  function progress() {

    var timeLeft = getTimeout(mySwiper.autoplay.timeout);

    if ( mySwiper.autoplay.running && !mySwiper.autoplay.paused ) {
      percentTime = sanitisePercentage(100 - Math.round(timeLeft / slideDelay * 100));
      bar.style.width = percentTime + '%';

      if (percentTime > 100) {
        resetProgressBar();
      }
    }

    if ( mySwiper.autoplay.paused ) {
      percentTime = 0;
      bar.style.width = 0;
    }

  }

  function resetProgressBar() {
    percentTime = 0;
    bar.style.width = 0;
    clearInterval(tick);
  }

  startProgressBar();

}


/*
var mySwiper = new swiper('.swiper-container', {
  // Optional parameters
  effect: 'fade',
  loop: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-slide',
  },
  autoplay: {
    delay: 5000
  }
})
*/

var currentPlayingVideo = null
var handleVideoPlay = function (slider) {

  var $cSlide = slider.slides[slider.activeIndex] //$("[data-swiper-slide-index='" + slider.activeIndex + "']")
  var $video = $("video", $cSlide)
  
  if ($video.length) {
    if (currentPlayingVideo) {
      currentPlayingVideo.currentTime = 0
      currentPlayingVideo.pause()
    }
    currentPlayingVideo = $video.get(0)
    currentPlayingVideo.play();
    currentPlayingVideo.__played = true
  }
}
mySwiper.on("slideChange", handleVideoPlay)
mySwiper.on("init", handleVideoPlay)

// 4. Plyr
// ----------

const players = Plyr.setup('.js-player', {
  ratio: '16:9',
  controls: ['play', 'progress', 'mute', 'volume', 'pip', 'airplay', 'fullscreen']
});


// 5. Hamburger
// ------------

var $hamburger = $(".hamburger");
  $hamburger.on("click", function(e) {
    $hamburger.toggleClass("is-active");
    // Do something else, like open/close menu
  });


// 6. Viewport Height Fix
// ----------------------

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
const vh = window.innerHeight * 0.01;

// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});


// 7. Animate on Scroll
// --------------------

$(function() {
  AOS.init({ 
   offset: 32,
   easing: 'ease-in-out-quart', 
   duration: 600
   });   
});

$(function() {
window.addEventListener('load', AOS.refresh);
});

// 3. Loading
// ----------

if (!Cookies.get('loading')) {
  $(function() {
    $(".loader").removeClass("hide");
    $(".loader").addClass("loading");
    $('.page--testing').removeClass('testing--hide');
    setTimeout(function(){
     $(".loader").addClass("loaded");
     Cookies.set('loading', 'true');
    }, 2500);
  });

} else { 
  setTimeout(function(){
  $('.page--testing').removeClass('testing--hide');
  }, 500);

}


}

// 8. Page Transitions
// -------------------
const options = {
  animationSelector: '[class*="swup-transition-"]',
  containers: [ '#swup-body', '#swup-header', '#swup-overlay', '#swup-navigation', '#swup-cta', '#swup-footer' ],
  plugins: [
    new SwupPreloadPlugin(),
    new SwupBodyClassPlugin(),
    new SwupGaPlugin(),
    new SwupScrollPlugin({
        doScrollingRightAway: false,
        animateScroll: true,
        scrollFriction: 0.3,
        scrollAcceleration: 0.04
    })
  ]
};

const swup = new Swup( options );

// 9. Run Once
// -----------
init();

swup.on( 'contentReplaced', init );

} );