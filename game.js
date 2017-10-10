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
    var enableDebug = ("true" === Q.getUrlParams().debug);
    var fpsCounter;
    var canvasBuffer;

    var canUseLocalStorage = 'localStorage' in window && window.localStorage !== null;

    function resizeStage() {
        var canvasWidth = $("#canvas").width();
        var canvasHeight = $("#canvas").height();
        console.log(canvasWidth, canvasHeight);

        var height = Math.min(1300, canvasHeight);
        // var ratio = 480 / 640;
        var width = height * canvasWidth / canvasHeight;
        
        var displayWidth = width;
        var displayHeight = height;

        if (window.stage
                && canvasWidth != globalConf.canvasWidth
                && canvasHeight != globalConf.canvasHeight) {
            stage.width = width;
            stage.height = height;
            // alert(window.orientation);
        }

        return {"width": width, "height": height, 
            "canvasHeight": canvasHeight, "canvasWidth": canvasWidth};
    }

    /** 游戏舞台 **/
    var GameStage = function (props) {
        // props.width = "100%";
        // props.height = "100%";

        var params = Q.getUrlParams();
        this.enableDebug = params.enableDebug;
        this.level = params.level;

        window.stage = this;

        var rect = resizeStage();
        console.log(rect);
        var width = rect.width;
        var height = rect.height;
        var ctxWidth = rect.canvasWidth;
        var ctxHeight = rect.canvasHeight;

        console.log(width, height);

        // width, height 是canvas的宽高，这里是为了获取canvas的长宽比
        // 1920 * 1300 是希望展示的大小,以高度为准，水平多余的砍掉或者不足的补充
        // quarkjs通过css style来缩放stage

        props.width = 650 * width / height;
        props.height = 650;

        var scale = height / props.height;

        globalConf.width = props.width;
        globalConf.height = props.height;

        globalConf.update();

        // props.width = width;
        // props.height = height;

        // props.width =   rect.width / scale;
        // props.height =  rect.height / scale;

        props.scaleX = scale;
        props.scaleY = scale;

        $("#canvas").attr("width", props.width);
        $("#canvas").attr("height", props.height);

        GameStage.superClass.constructor.call(this, props);
        this.frames = 0;
        this.score = 0;
    }

    GameStage.prototype.update = function (timeInfo) {
        return true;
    }

    Q.inherit(GameStage, Q.Stage);

    function setJumpState() {
        // if (KEY_STATUS["space"] == true) {
        //     KEY_STATUS["secondSpace"] = true;
        //     setTimeout(function () {
        //         KEY_STATUS["secondSpace"] = false;
        //     }, 200);
        // }
        KEY_STATUS["space"] = true;
        setTimeout(function () {
            KEY_STATUS["space"] = false;
        }, 50);
    }

    function soundInit() {
        if (canUseLocalStorage) {
            playSound = (localStorage.getItem('kandi.playSound') === "true")

            if (playSound) {
                $('.sound').addClass('sound-on').removeClass('sound-off');
            }
            else {
                $('.sound').addClass('sound-off').removeClass('sound-on');
            }
        }
    }

    function gameInit() {
        frames = 0;
        canvas = document.getElementById('canvas');
        // ctx = canvas.getContext('2d');

        /** Quark 舞台 **/
        var container = Q.getDOM("container");

        window.canvas = canvas;
        context = new Quark.CanvasContext({canvas: canvas});
        //context = new Q.DOMContext({canvas:container});

        stage = new GameStage({
            context: context,
        });

        window.stage = stage;

        /** FPS 统计 **/
        var FPS = 30;
        timer = new Q.Timer(1000 / FPS); // FPS
        timer.start();
        window.quark_timer = timer;

        /** 事件管理器 **/
        var em = new Q.EventManager();
        var events = Q.supportTouch ? ["touchstart"] : ["mousedown", "mouseup", "mousemove", "mouseout"];
        em.registerStage(stage, events, true, true);

        stage.em = em;

        function touchEventCallback(event) {
            // console.log(event);
            // alert(event.eventX);

            var width = globalConf.width;
            var height = globalConf.height;

            // 浏览器只有eventX
            var x = event.eventX;
            var y = event.eventY;

            if (x < width / 3) {
                // 左侧1/3
                // 第二次跳跃
                setJumpState();
            } else {
                KEY_STATUS["fireBullet"] = {x: x, y: y};
            }
        }

        stage.on("touchstart", touchEventCallback);
        stage.on("mousedown", touchEventCallback);

        if (enableDebug) {        
            // 调试矩形区域
            Q.toggleDebugRect(stage);
        }

        // set the sound preference
        soundInit();
    }

    /**
     * Keep track of the spacebar events
     */
    var KEY_CODES = {
        32: 'space'
    };
    var KEY_STATUS = {
        "space": false,
        "secondSpace": false,
        "fireBullet": undefined
    };
    window.KEY_STATUS = KEY_STATUS;
    for (var code in KEY_CODES) {
        if (KEY_CODES.hasOwnProperty(code)) {
            KEY_STATUS[KEY_CODES[code]] = false;
        }
    }
    document.onkeydown = function (e) {
        setJumpState();
    };
    document.onkeyup = function (e) {
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        // console.log(keyCode);
        if (keyCode == 13) {
            // Enter键切换暂定状态
            if (window.quark_timer.paused) {
                window.quark_timer.resume();
            } else {
                window.quark_timer.pause();
            }
        }
        // if (KEY_CODES[keyCode]) {
        //     e.preventDefault();
        //     KEY_STATUS[KEY_CODES[keyCode]] = false;
        // }
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
     * 全屏
     * @param element
     */
    function fullScreen(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.webkitRequestFullScreen ) {
            element.webkitRequestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
    }

    /**
     * Start the game - reset all variables and entities, spawn ground and water.
     */
    function startGame() {
        var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
        if (orientation) {
            // alert(orientation.type);
            // orientation.type = "landscape-secondary";
            // orientation.lock("landscape");
            console.log(orientation.type);
        }

        screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

        if (screen.lockOrientationUniversal && screen.lockOrientationUniversal("landscape-primary")) {
          // orientation was locked
        } else {
          // orientation lock failed
        }

        gameInit();
        // fullScreen(document.getElementById("canvas"));
        var background = new BackgroundClass();
        var player = new PlayerClass();
        var textBoard = new TextBoard();

        stage.removeAllChildren();
        stage.addChild(background);
        background.addPlayer(player);
        stage.addChild(textBoard);

        stage.background = background;
        stage.player = player;
        stage.gameOver = gameOver;

        quark_timer.addListener(stage);   // 舞台刷新
        quark_timer.addListener(Q.Tween); // 动画

        assetLoader.sounds.gameOver.pause();
        assetLoader.sounds.bg.currentTime = 0;
        assetLoader.sounds.bg.loop = true;
        assetLoader.sounds.bg.play();

        // 为了方便调试
        window.background = background;

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
        $('#score').html(stage.score.toFixed(1));
        $('#game-over').show();
        assetLoader.pauseSounds();
        assetLoader.sounds.gameOver.currentTime = 0;
        assetLoader.sounds.gameOver.play();
    }

    /**
     * Click handlers for the different menu screens
     */
    $('.credits').click(function () {
        $('#main').hide();
        $('#credits').show();
        $('#menu').addClass('credits');
    });
    $('.back').click(function () {
        $('#credits').hide();
        $('#main').show();
        $('#menu').removeClass('credits');
    });
    $('.sound').click(function () {
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
    $('.play').click(function () {
        $('#menu').hide();
        startGame();
    });
    $('.restart').click(function () {
        $('#game-over').hide();
        startGame();
    });

    $(document).ready(function () {
        // 适配移动端旋转
        // 事件监听无效
        // $(document).on("orientationchange", resizeStage);
        // $(document).on("resize", resizeStage);
        // 只能定时检测了
        // TODO 所有元素都要重绘，先hold住
        // setInterval(resizeStage, 1000);
        // canvas没加载完
        // TODO 检测为横屏
        // setTimeout(gameInit, 1000);
        // gameInit();
        soundInit();
    })

    assetLoader.downloadAll();
})(jQuery);