/** config.js **/

var globalConf = {};

globalConf.width  = 640 * 1.5;
globalConf.height = 480 * 1.5;

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

globalConf.grassSpeed = 8;
globalConf.maxStepWidth = globalConf.grassWidth * 3; // 最大跳跃距离


globalConf.update = function () {
    // scale = 显示大小 / 实际大小
    // var scaleX = globalConf.width / 640;
    // var scaleY = globalConf.height / 480;

    var scaleX = globalConf.width / 3840;
    var scaleY = scaleX;

    globalConf.scaleX = scaleX;
    globalConf.scaleY = scaleY;

    globalConf.roadHeight = globalConf.height / 4;
    globalConf.bgWidth = globalConf.height  / 1300 * 3840;
    globalConf.bgHeight = globalConf.height;

    // 64 * 32
    // globalConf.playerHeight = assetLoader.imgs.avatar_normal.width / 4  * scaleX;
    // globalConf.playerWidth = assetLoader.imgs.avatar_normal.height / 4  * scaleY;
    globalConf.playerHeight = 64;
    globalConf.playerWidth = 32;

    // 1222 x 287
    globalConf.grassWidth = 1222 * scaleX;
    globalConf.grassHeight = 287 * scaleY;

    globalConf.backdropWidth = 800 * scaleX * 2;
    globalConf.backdropHeight = 480 * scaleY * 2;

    globalConf.backdrop2Width = 800 * scaleX * 2;
    globalConf.backdrop2Height = 480 * scaleY * 2;

    globalConf.skyWidth = 800 * scaleX;
    globalConf.skyHeight = 480 * scaleY;

    globalConf.canvasWidth = $("#canvas").width();
    globalConf.canvasHeight = $("#canvas").height();
}

