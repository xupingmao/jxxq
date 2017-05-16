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
        this.x = this.width;
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
        0, 100, globalConf.skyWidth, globalConf.skyHeight, 0.2);

    // this.sky = newBitmap(assetLoader.imgs.sky);
    // this.sky.speed = 0.2;

    this.backdrop = new BackgroundImage(assetLoader.imgs.backdrop,
        0, globalConf.height - globalConf.backdropHeight, 
        globalConf.backdropWidth, globalConf.backdropHeight, 0.4);

    this.backdrop2 = new BackgroundImage(assetLoader.imgs.backdrop2,
        0, 0, globalConf.backdrop2Width, globalConf.backdrop2Height, 0.6);

    this.backdrop2_2 = new BackgroundImage(assetLoader.imgs.backdrop2,
        globalConf.backdrop2Width, 0, globalConf.backdrop2Width, globalConf.backdrop2Height, 0.6);

    // 最远景
    this.addChild(this.bg);
    this.addChild(this.sky);
    this.addChild(this.backdrop);
    this.addChild(this.backdrop2);
    this.addChild(this.backdrop2_2);
    // this.addChild(new SkyClass());
}

// 必须先继承，然后再实现其他方法
Q.inherit(BackgroundClass, Q.DisplayObjectContainer);

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

// BackgroundClass.prototype.render = function (ctx) {
//     this.x -= 0.5;
//     ctx.draw(this, this.x, this.y, canvas.width, canvas.height);
//     console.log("render background");

    // // Pan background
    // sky.x -= sky.speed;
    // backdrop.x -= backdrop.speed;
    // backdrop2.x -= backdrop2.speed;

    // // draw images side by side to loop
    // ctx.drawImage(assetLoader.imgs.sky, sky.x, sky.y);
    // ctx.drawImage(assetLoader.imgs.sky, sky.x + canvas.width, sky.y);

    // ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x, backdrop.y);
    // ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x + canvas.width, backdrop.y);

    // ctx.drawImage(assetLoader.imgs.backdrop2, backdrop2.x, backdrop2.y);
    // ctx.drawImage(assetLoader.imgs.backdrop2, backdrop2.x + canvas.width, backdrop2.y);

    // // If the image scrolled off the screen, reset
    // if (sky.x + assetLoader.imgs.sky.width <= 0)
    //   sky.x = 0;
    // if (backdrop.x + assetLoader.imgs.backdrop.width <= 0)
    //   backdrop.x = 0;
    // if (backdrop2.x + assetLoader.imgs.backdrop2.width <= 0)
    //   backdrop2.x = 0;
// }

// BackgroundClass.prototype.getDrawable = function (context) {
//     return assetLoader.imgs.bg;
// }

/**
 * Update all water position and draw.
 */
function updateWater() {
  // animate water
  for (var i = 0; i < water.length; i++) {
    water[i].update();
    water[i].draw();
  }

  // remove water that has gone off screen
  if (water[0] && water[0].x < -platformWidth) {
    var w = water.splice(0, 1)[0];
    w.x = water[water.length-1].x + platformWidth;
    water.push(w);
  }
}

/**
 * Update all environment position and draw.
 */
function updateEnvironment() {
  // animate environment
  for (var i = 0; i < environment.length; i++) {
    environment[i].update();
    environment[i].draw();
  }

  // remove environment that have gone off screen
  if (environment[0] && environment[0].x < -platformWidth) {
    environment.splice(0, 1);
  }
}
