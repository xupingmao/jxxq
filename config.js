/** config.js **/

var globalConf = {};

// globalConf.width  = 640 * 1.5;
// globalConf.height = 480 * 1.5;
globalConf.width = 3840 / 4;
globalConf.height = 1300 / 2;

globalConf.playerWidth = 32;
globalConf.playerHeight = 64;

globalConf.bgWidth  = 640 * 3840 / 1300;
globalConf.bgHeight = 480;

globalConf.skyWidth  = 800;
globalConf.skyHeight = 480;
globalConf.skyY      = 0;

globalConf.backdropWidth  = 800;
globalConf.backdropHeight = 480;

globalConf.backdrop2Width  = 800;
globalConf.backdrop2Height = 480;

globalConf.grassWidth = 32;
globalConf.grassHeight = 32;

globalConf.roadHeight = 100;
globalConf.roadBoxWidth = 16;
globalConf.roadBoxHeight = 16;

globalConf.bulletWidth = 16;
globalConf.bulletHeight = 16;

globalConf.grassSpeed = 20;
globalConf.gravity = 5;
// 前景速度
globalConf.foregroundSpeed = 4;

globalConf.update = function () {
    // 实际大小 1920 * 1080
    // scale = 显示大小 / 实际大小
    // var scaleX = globalConf.width / 640;
    // var scaleY = globalConf.height / 480;

    // var scaleY = globalConf.height / 1300 ;
    var scaleY = 1;
    var scaleX = scaleY;
    // 最外层的stage缩放即可

    globalConf.largeUnitWidth = scaleX * 256;
    globalConf.largeUnitHeight = scaleY * 256;
    globalConf.middleUnitWidth = scaleX * 128;
    globalConf.middleUnitHeight = scaleY * 128;

    globalConf.enemyWidth = 300 * scaleX;
    globalConf.enemyHeight = 230 * scaleY;

    globalConf.scaleX = scaleX;
    globalConf.scaleY = scaleY;

    globalConf.height = parseInt(globalConf.height);
    globalConf.width  = parseInt(globalConf.width);

    globalConf.roadHeight = assetLoader.imgs.head.height;
    globalConf.bgWidth = globalConf.height  / 1300 * 3840;
    globalConf.bgHeight = globalConf.height;

    // 64 * 32
    // globalConf.playerHeight = assetLoader.imgs.avatar_normal.width / 4  * scaleX;
    // globalConf.playerWidth = assetLoader.imgs.avatar_normal.height / 4  * scaleY;
    globalConf.playerHeight = 205 * scaleY / 2;
    globalConf.playerWidth =  130 * scaleX / 2;

    // 1222 x 287
    globalConf.grassWidth = 1222 * scaleX;
    globalConf.grassHeight = 287 * scaleY;

    globalConf.backdropWidth = 800 * scaleX * 2;
    globalConf.backdropHeight = 480 * scaleY * 2;

    globalConf.backdrop2Width = 800 * scaleX * 2;
    globalConf.backdrop2Height = 480 * scaleY * 2;

    globalConf.skyWidth = 800 * scaleX * 2;
    globalConf.skyHeight = 480 * scaleY * 2;

    globalConf.canvasWidth = $("#canvas").width();
    globalConf.canvasHeight = $("#canvas").height();

    globalConf.roadSpeed = 0.1;
    globalConf.roadY = globalConf.height - globalConf.roadHeight;

    if (window.stage.level == "hard") {
        globalConf.maxStepWidth = 256;
    } else {
        globalConf.maxStepWidth = 0; // 最大跳跃距离
    }
    globalConf.grassSpeed = 10;
    globalConf.gravity = globalConf.gravity * scaleX;
}

