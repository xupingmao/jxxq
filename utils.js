/**
 * 扩展方法
 */

Array.prototype.remove = Array.prototype.remove || function (object) {
    var index = this.indexOf(object);
    this.splice(index, 1);
}

Array.prototype.last = function () {
  return this[this.length-1];
}

/**
 * Fps 计数器
 */
function FpsCounter() {
  this.fps = 0;
  this.frames = 0;
  this.lastTime = new Date();
}

FpsCounter.prototype.count = function () {
  this.frames++;

  if (this.frames >= 20) {
    this.fps = parseInt(this.frames / (new Date() - this.lastTime) * 1000);
    this.lastTime = new Date();
    this.frames = 0;
  }
}

FpsCounter.prototype.getFps = function () {
  return this.fps;
}



/**
 * canvas缓存
 */

function CanvasBuffer() {
  var canvasBuffer = document.createElement("canvas");
  canvasBuffer.width = canvas.width;
  canvasBuffer.height = canvas.height;
  var contextBuffer = canvasBuffer.getContext("2d");

  this.context = contextBuffer;
  this.canvas = canvasBuffer;
}


/**
 * Get a random number between range
 * @param {integer}
 * @param {integer}
 */
function rand(low, high) {
  return Math.floor( Math.random() * (high - low + 1) + low );
}

/**
 * Bound a number between range
 * @param {integer} num - Number to bound
 * @param {integer}
 * @param {integer}
 */
function bound(num, low, high) {
  return Math.max( Math.min(num, high), low);
}


/**
 * 检测X坐标是否在容器范围内
 * @param rangeObj
 * @param target
 * @returns {boolean}
 */
function checkInXRange(rangeObj, target) {
    var x = target.x;
    return x >= rangeObj.x && x <= (rangeObj.x + rangeObj.width);
}

function distanceOf(x, y, x1, y1) {
  return Math.sqrt((x1-x)*(x1-x) + (y1-y)*(y1-y));
}

function pickRandom(array) {
  var length = array.length;
  var index = parseInt(Math.random() * length);
  if (index == length) {
    index -= 1;
  }
  return array[index];
}

window._pickOneIndex = 0;
function pickOne(array) {
  window._pickOneIndex ++;
  if (window._pickOneIndex >= array.length) {
    window._pickOneIndex = 0;
  } 
  return array[window._pickOneIndex];
}


function createBitmap(img) {
    var width = img.width;
    var height = img.height;
    var bitmap = new Quark.Bitmap({
        image: img,
        width: width,
        height: height,
        rect : [0, 0, width, height]
    });
    return bitmap;
}

function createMovieClip(image, cols, rows, rowIndex, interval) {
    var movieClip = new Q.MovieClip({
    image: image,
    useFrames: true,
    interval: interval,
    x:0,
    y:0
  });
    var rectWidth = image.width / cols;
    var rectHeight = image.height / rows;
    for (var i = 0; i < cols; i++) {
        var x = rectWidth * i;
        var y = rowIndex * rectHeight;
        var rect = [x, y, rectWidth, rectHeight];
        movieClip.addFrame({rect: rect, interval: interval});
    }
    return movieClip;
}

function reverseMovieClip(movieClip) {
    movieClip._frames.reverse();
}

function setMovieClipStop(movieClip, index) {
    movieClip._frames[index].stop = true;
}


function joinBitmaps(parent, array, x, y, direction) {
    var left = 0;
    var top = 0;

    var width = 0;
    var height = 0;
    
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        item.x = left;
        item.y = top;
        parent.addChild(item);

        left += item.width;
        width += item.width;
        height = item.height;
    }
    parent.x = x;
    parent.y = y;
    parent.width = width;
    parent.height = height;
}
