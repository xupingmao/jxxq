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
    props.width = "100%";
    props.height = "100%";

    GameStage.superClass.constructor.call(this, props);
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
  // canvas = Quark.createDOM("canvas",{ id:"canvas", width: 600, height:480});
  // canvas.style.width = "100%";
  // canvas.style.height = "100%";
  // container.appendChild(canvas);

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

  platformBase = canvas.height - platformWidth;  // bottom row of the game
  

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
 * Game loop
 * 游戏主循环
 */
function animate() {
  if (!stop) {
    
    requestAnimFrame( animate );
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // canvasBuffer.context.clearRect(0, 0, canvas.width, canvas.height);

    // var displayContext = ctx;
    // 交换缓冲
    // ctx = canvasBuffer.context;
    background.draw();

    // update entities
    updateWater();
    updateEnvironment();
    updatePlayer();
    // stage.update();
    updateGround();
    updateEnemies();

    // draw the score
    ctx.fillText('得分: ' + score + 'm', canvas.width - 140, 30);
    if (enableDebug) {
      fpsCounter.count();
      ctx.fillText('FPS:' + fpsCounter.getFps(), canvas.width - 140, 60);
    }

    // spawn a new Sprite
    if (ticker % Math.floor(platformWidth / player.speed) === 0) {
      spawnSprites();
    }

    // increase player speed only when player is jumping
    if (ticker > (Math.floor(platformWidth / player.speed) * player.speed * 20) && player.dy !== 0) {
      player.speed = bound(++player.speed, 0, 15);
      player.walkAnim.frameSpeed = Math.floor(platformWidth / player.speed) - 1;

      // reset ticker
      ticker = 0;

      // spawn a platform to fill in gap created by increasing player speed
      if (gapLength === 0) {
        var type = getType();
        ground.push(new Sprite(
          canvas.width + platformWidth % player.speed,
          platformBase - platformHeight * platformSpacer,
          type
        ));
        platformLength--;
      }
    }

    ticker++;

    // displayContext.clearRect(0, 0, canvas.width, canvas.height);
    // 渲染图形
    // displayContext.drawImage(canvasBuffer.canvas, 0, 0);
    // ctx = displayContext;
  }
}

/**
 * Keep track of the spacebar events
 */
var KEY_CODES = {
  32: 'space'
};
var KEY_STATUS = {};
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

$(document).on("touchend", function() {
  KEY_STATUS["space"] = true;
  setTimeout(function () { KEY_STATUS["space"] = false; }, 200);
})

/**
 * Request Animation Polyfill
 */
var requestAnimFrame = (function(){
  // return  function(callback, element){
  //           // 动画的帧率
  //           window.setTimeout(callback, 1000 / 1);
  //         };

  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            // 动画的帧率
            window.setTimeout(callback, 1000 / 60);
          };
})();

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
  // stage.addChild(player);
  // animate();

  quark_timer.addListener(stage);   // 舞台刷新
  quark_timer.addListener(Q.Tween); // 动画 

  assetLoader.sounds.gameOver.pause();
  assetLoader.sounds.bg.currentTime = 0;
  assetLoader.sounds.bg.loop = true;
  assetLoader.sounds.bg.play();
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