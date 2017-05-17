(function ($) {

// define variables
var canvas, ctx;
var player, score, stop, ticker;
var ground = [], water = [], enemies = [], environment = [];
// platform variables
var platformWidth = 32;
var platformSpacer = 64;
var platformHeight, platformLength, gapLength;
var playSound;
var platformBase;
var frames = 0;
var enableDebug = true;
var fpsCounter;
var canvasBuffer;

var canUseLocalStorage = 'localStorage' in window && window.localStorage !== null;


/** 游戏舞台 **/
var GameStage = function (props) {
    // props.width = "100%";
    // props.height = "100%";
    var canvasWidth = $("#canvas").width();
    var canvasHeight = $("#canvas").height();

    var width = Math.min(640, canvasWidth);
    // var ratio = 480 / 640;
    var ratio  = canvasHeight / canvasWidth;
    var height = width * ratio;

    var displayWidth  = width;
    var displayHeight = height;

    globalConf.width = width;
    globalConf.height = height;
    globalConf.update();

    console.log(width, height);

    props.width  = width;
    props.height = height;
    props.scaleX = 1;
    props.scaleY = 1;

    $("#canvas").attr("width", width);
    $("#canvas").attr("height", height);

    GameStage.superClass.constructor.call(this, props);

    this._scaleX = 1;
    this._scaleY = 1;
    this.frames = 0;
}

GameStage.prototype.update = function () {

}

Q.inherit(GameStage, Q.Stage);

function gameInit() {
  frames = 0;
  canvas = document.getElementById('canvas');
  // ctx = canvas.getContext('2d');

  /** Quark 舞台 **/
  var container = Q.getDOM("container");

  window.canvas = canvas;
  context = new Quark.CanvasContext({canvas:canvas});
  //context = new Q.DOMContext({canvas:container});

  stage = new GameStage({
    context: context, 
  });

  window.stage = stage;

  /** FPS 统计 **/
  var FPS = 30;
  timer = new Q.Timer(1000/FPS); // FPS
  timer.start();
  window.quark_timer = timer;
   
  /** 事件管理器 **/
  var em = new Q.EventManager();
  var events = Q.supportTouch ? ["touchend"] : ["mousedown","mouseup","mousemove","mouseout"];
  em.registerStage(stage, events, true, true);
  
  stage.em = em;

  function touchEventCallback (event) {
      console.log(event);

      // alert(event.eventX);

      var width  = $("#canvas").width();
      var height = $("#canvas").height();

      // 浏览器只有eventX
      var x = event.eventX;
      var y = event.eventY;

      // alert(x);

      if (x < width / 3) {
        // 左侧1/3
          KEY_STATUS["space"] = true;
          setTimeout(function () { KEY_STATUS["space"] = false; }, 200);
      } else {
          var _x = x / width * globalConf.width;
          var _y = y / height * globalConf.height;
          KEY_STATUS["fireBullet"] = {x: _x, y: _y};
      }
  }

  stage.on("touchend", touchEventCallback);
  stage.on("mouseup",  touchEventCallback);

  // set the sound preference
  if (canUseLocalStorage) {
    playSound = (localStorage.getItem('kandi.playSound') !== "false")

    if (playSound) {
      $('.sound').addClass('sound-on').removeClass('sound-off');
    }
    else {
      $('.sound').addClass('sound-off').removeClass('sound-on');
    }
  }
}

/**
 * Keep track of the spacebar events
 */
var KEY_CODES = {
  32: 'space'
};
var KEY_STATUS = {
    "space": false,
    "fireBullet": undefined
};
window.KEY_STATUS = KEY_STATUS;
for (var code in KEY_CODES) {
  if (KEY_CODES.hasOwnProperty(code)) {
     KEY_STATUS[KEY_CODES[code]] = false;
  }
}
document.onkeydown = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};

/**
 * Show the main menu after loading all assets
 */
function mainMenu() {
  for (var sound in assetLoader.sounds) {
    if (assetLoader.sounds.hasOwnProperty(sound)) {
      assetLoader.sounds[sound].muted = !playSound;
    }
  }

  $('#progress').hide();
  $('#main').show();
  $('#menu').addClass('main');
  $('.sound').show();

  // $("#canvas").attr("width",  window.screen.width);
  // $("#canvas").attr("height", window.screen.height);
}

window.mainMenu = mainMenu;

/**
 * Start the game - reset all variables and entities, spawn ground and water.
 */
function startGame() {
  var background = new BackgroundClass();
  var player     = new PlayerClass();

  stage.removeAllChildren();
  stage.addChild(background);
  stage.addChild(player);
  // animate();

  quark_timer.addListener(stage);   // 舞台刷新
  quark_timer.addListener(Q.Tween); // 动画 

  assetLoader.sounds.gameOver.pause();
  assetLoader.sounds.bg.currentTime = 0;
  assetLoader.sounds.bg.loop = true;
  assetLoader.sounds.bg.play();

  // $(document).on("touchend", function() {
  //   KEY_STATUS["space"] = true;
  //   setTimeout(function () { KEY_STATUS["space"] = false; }, 200);
  // })
}

/**
 * End the game and restart
 */
function gameOver() {
  stop = true;
  $('#score').html(score);
  $('#game-over').show();
  assetLoader.sounds.bg.pause();
  assetLoader.sounds.gameOver.currentTime = 0;
  assetLoader.sounds.gameOver.play();
}

/**
 * Click handlers for the different menu screens
 */
$('.credits').click(function() {
  $('#main').hide();
  $('#credits').show();
  $('#menu').addClass('credits');
});
$('.back').click(function() {
  $('#credits').hide();
  $('#main').show();
  $('#menu').removeClass('credits');
});
$('.sound').click(function() {
  var $this = $(this);
  // sound off
  if ($this.hasClass('sound-on')) {
    $this.removeClass('sound-on').addClass('sound-off');
    playSound = false;
  }
  // sound on
  else {
    $this.removeClass('sound-off').addClass('sound-on');
    playSound = true;
  }

  if (canUseLocalStorage) {
    localStorage.setItem('kandi.playSound', playSound);
  }

  // mute or unmute all sounds
  for (var sound in assetLoader.sounds) {
    if (assetLoader.sounds.hasOwnProperty(sound)) {
      assetLoader.sounds[sound].muted = !playSound;
    }
  }
});
$('.play').click(function() {
  $('#menu').hide();
  startGame();
});
$('.restart').click(function() {
  $('#game-over').hide();
  startGame();
});

$(function () {
  gameInit();
})

assetLoader.downloadAll();
})(jQuery);