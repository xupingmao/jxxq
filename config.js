/** config.js **/

var globalConf = {};

globalConf.width  = 640;
globalConf.height = 480;

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

globalConf.update = function () {
    var scaleX = globalConf.width / 640;
    var scaleY = globalConf.height / 480;
    globalConf.roadHeight = globalConf.height / 4;
    globalConf.bgWidth = globalConf.height  / 1300 * 3840;
    globalConf.bgHeight = globalConf.height;

    globalConf.grassWidth = 32 * scaleX;
    globalConf.grassHeight = 32 * scaleY;

    globalConf.backdropWidth = 800 * scaleX;
    globalConf.backdropHeight = 480 * scaleY;

    globalConf.skyWidth = 800 * scaleX;
    globalConf.skyHeight = 480 * scaleY;
}

