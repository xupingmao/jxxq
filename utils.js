
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

