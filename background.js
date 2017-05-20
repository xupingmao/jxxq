/** background.js **/

function newBitmap (img, width, height) {
    var width  = width || img.width;
    var height = height || img.height;

    // var scaleX = width / globalConf.width;
    // var scaleY = height / globalConf.height;
    return new Quark.Bitmap({
        image : img,
        rect  : [0, 0, width, height],
        scaleX: 1,
        scaleY: 1,
    });
}

function BackgroundImage(img, x, y, width, height, speed) {
    var props    = {};
    props.image  = img;
    
    // props.rectX  = x;
    // props.rectY  = y;
    props.speed  = speed;

    BackgroundImage.superClass.constructor.call(this, props);

    this.rectX = 0;
    this.rectY = 0;
    this.speed      = speed;
    this.rectWidth  = this.image.width;
    this.rectHeight = this.image.height;
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;

    // this.width  = width;
    // this.height = height;
    // this.speed  = 0.2;
}

Q.inherit(BackgroundImage, Q.Bitmap);

BackgroundImage.prototype.update = function (timeInfo) {
    this.x -= this.speed;

    if (this.x + this.width <= 0) {
        this.x = Math.max(this.width, globalConf.width);
    }

    return true;
}


function ScrollableClass() {
    var props = {};
    ScrollableClass.superClass.constructor.call(this, props);
}
Q.inherit(ScrollableClass, Q.DisplayObjectContainer);

ScrollableClass.prototype.update = function (timeInfo) {

    return true;
}

function RoadClass(image, grassCount, x, y) {
    var props = {};
    RoadClass.superClass.constructor.call(this, props);

    this.width = grassCount * globalConf.grassWidth;
    this.grassCount = grassCount;

    var grassHeight = globalConf.grassHeight;

    for (var i = 0; i < this.grassCount; i++) {
        var grass = newBitmap(image);
        grass.width = globalConf.grassWidth;
        grass.height = grassHeight;
        grass.x = i * globalConf.grassWidth;
        this.addChild(grass);
    }

    this.x = x;
    this.y = y;
    this.height = grassHeight;

    this.speed = globalConf.grassSpeed;
}
Q.inherit(RoadClass, Q.DisplayObjectContainer);

RoadClass.prototype.update = function (timeInfo) {
    this.x -= this.speed;
    if (this.x + this.width < 0) {
        this.parent.removeRoad(this);
    }
    return true;
}

WaterClass = function (image, grassCount, x, y) {
    WaterClass.superClass.constructor.call(this, image, grassCount, x, y);
}
Q.inherit(WaterClass, RoadClass);

WaterClass.prototype.update = function (timeInfo) {
    this.x -= this.speed;
    if (this.x + this.width <= 0) {
        this.x = this.width;
        console.log("width=" + this.width);
    }
    return true;
}

// DisplayObject._render会进行转换
// BackgroundImage.prototype.render = function (context) {
//     context.draw(this, this.rectX, this.rectY, this.rectWidth, this.rectHeight, 
//         this.x, this.y, this.width, this.height);
// }

/**
 * Create a parallax background
 */
function BackgroundClass(props) {
    props = props || {};

    this.x = 0;
    this.y = 0;
    BackgroundClass.superClass.constructor.call(this, props);

    this.bg  = new BackgroundImage(assetLoader.imgs.bg, 
        0, 0, globalConf.bgWidth, globalConf.height, 0.1);
    
    this.bg_2  = new BackgroundImage(assetLoader.imgs.bg, 
        globalConf.bgWidth, 0, globalConf.bgWidth, globalConf.height, 0.1);


    this.sky = new BackgroundImage(assetLoader.imgs.sky,
        0, 0, globalConf.skyWidth, globalConf.skyHeight, 0.2);

    this.sky_2 = new BackgroundImage(assetLoader.imgs.sky,
        globalConf.skyWidth, 0, globalConf.skyWidth, globalConf.skyHeight, 0.2);

    // this.sky = newBitmap(assetLoader.imgs.sky);
    // this.sky.speed = 0.2;

    this.backdrop = new BackgroundImage(assetLoader.imgs.backdrop,
        0, globalConf.height - globalConf.backdropHeight, 
        globalConf.backdropWidth, globalConf.backdropHeight, 0.3);

    this.backdrop_2 = new BackgroundImage(assetLoader.imgs.backdrop,
        globalConf.backdropWidth, globalConf.height - globalConf.backdropHeight,
        globalConf.backdropWidth, globalConf.backdropHeight, 0.3);

    this.backdrop2 = new BackgroundImage(assetLoader.imgs.backdrop2,
        0, 0, globalConf.backdrop2Width, globalConf.backdrop2Height, 0.6);

    this.backdrop2_2 = new BackgroundImage(assetLoader.imgs.backdrop2,
        globalConf.backdrop2Width, 0,
        globalConf.backdrop2Width, globalConf.backdrop2Height, 0.6);

    // 最远景
    this.addChild(this.bg);
    this.addChild(this.bg_2);
    this.addChild(this.sky);
    this.addChild(this.sky_2);
    this.addChild(this.backdrop);
    this.addChild(this.backdrop_2);
    this.addChild(this.backdrop2);
    this.addChild(this.backdrop2_2);

    this.addChild(new WaterClass(assetLoader.imgs.water,
        30, 0, globalConf.height - globalConf.grassHeight));
    this.addChild(new WaterClass(assetLoader.imgs.water,
        30, 30 * globalConf.grassWidth, globalConf.height - globalConf.grassHeight));

    // 道路

    this.roadList = [];
    this.addRoad(new RoadClass(assetLoader.imgs.grass,
        20, 0, globalConf.height - globalConf.grassHeight));
}

// 必须先继承，然后再实现其他方法
Q.inherit(BackgroundClass, Q.DisplayObjectContainer);

BackgroundClass.prototype.addRoad = function (road) {
    this.roadList.push(road);
    this.addChild(road);
    console.log("add road " + road);
}

BackgroundClass.prototype.removeRoad = function (road) {
    this.removeChild(road);
    var index = this.roadList.indexOf(road);
    this.roadList.splice(index, 1);
    console.log(road + " removed");
}

BackgroundClass.prototype.addRandRoad = function () {
    var x = globalConf.width;
    var maxY = globalConf.height - globalConf.grassHeight;
    var randHeight = rand(maxY - globalConf.playerHeight, maxY);
    this.addRoad(new RoadClass(assetLoader.imgs.grass, rand(10,20), x, randHeight));
}

BackgroundClass.prototype.update = function (timeInfo) {
    if (this.roadList.length == 0) {
        this.addRandRoad();
    } else if (this.roadList.length == 1){
        // 创建新的随机road
        var lastRoad = this.roadList[this.roadList.length-1];
        var endRange = globalConf.width - lastRoad.x - lastRoad.width;
        if (endRange >= globalConf.maxStepWidth) {
            this.addRandRoad();
            console.log("rand overflow")
        }
    }
    return true;
}

BackgroundClass.prototype.getY = function (target) {
    // TODO 判断道路的位置
    for (var i = 0; i < this.roadList.length; i++) {
        var road = this.roadList[i];
        if ( checkInXRange(road, target) ) {
            return road.y;
        }
    }
    return  globalConf.height;
}

// BackgroundClass.prototype.update = function (timeInfo) {
    // this.sky.x -= this.sky.speed;

    // if (this.sky.x + assetLoader.imgs.sky.width <= 0) {
    //     this.sky.x = 0;
    // }

    // this.backdrop.x -= this.backdrop.speed;
    // if (this.backdrop.x + assetLoader.imgs.backdrop.width <= 0) {
    //     this.backdrop.x = 0;
    // }
// }


// 参考Bitmap
function SkyClass (props) {
    props = props || {};

    this.x = 0;
    this.y = 0;
    SkyClass.superClass.constructor.call(this, props);

}

Q.inherit(SkyClass, Q.DisplayObject);

SkyClass.prototype.getDrawable = function (ctx) {
    return assetLoader.imgs.sky;
}

SkyClass.prototype.render = function (ctx) {
    if (! assetLoader.imgs.sky) {
        return;
    }
    var width  = assetLoader.imgs.sky.width;
    var height = assetLoader.imgs.sky.height;

    this.x -= 0.5;
    ctx.draw(this, this.x, this.y, width, height);

    if (this.x + assetLoader.imgs.sky.width <= 0)
      this.x = 0;
}
