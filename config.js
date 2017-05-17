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

globalConf.roadHeight = 100;

globalConf.bulletWidth = 16;
globalConf.bulletHeight = 16;

globalConf.update = function () {
    globalConf.roadHeight = globalConf.height / 4;
    globalConf.bgWidth = globalConf.height  / 1300 * 3840;
    globalConf.bgHeight = globalConf.height;
    
}

