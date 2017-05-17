/** player.js **/


/**
 * The player Class
 */

function PlayerClass() {
    var img = assetLoader.imgs.avatar_normal;
    var props = {};

    props.image = img;
    // props.width  = img.width;
    // props.height = img.height;
    PlayerClass.superClass.constructor.call(this, props);

    this.image       = assetLoader.imgs.avatar_normal;
    this.jumpCounter = 0;


    this.rectX  = 0;
    this.rectY  = 0;
    this.rectWidth  = img.width / 4;
    this.rectHeight = img.height / 4;

    this.width  = 32;
    this.height = 64;
    this.x = 100;
    this.y = globalConf.height - this.height - globalConf.roadHeight;
    this.originY = this.y;

    this.dx = 0;
    this.dy = 0;
    this.jumpDy = 5;

    this.isJumping  = false;
    this.isFalling  = false;
    this.gravity    = 5;
    this.roadHeight = globalConf.roadHeight;
}

Q.inherit(PlayerClass, Q.Bitmap);

PlayerClass.prototype.update = function (timeInfo) {
    var player = this;
    var jumpCounter = this.jumpCounter;

    // return;

    // jump if not currently jumping or falling
    if (KEY_STATUS.space && !player.isJumping) {
        this.isJumping   = true;
        // this.jumpCounter = 12;
        this.dy          = -30;
        this.originY     = this.y;
        // vt = 1/2 * a * t ^ 2
        // v  = 1/2 * a * t
        // t  = 15  半秒左右
        assetLoader.sounds.jump.play();
    }

    // jump higher if the space bar is continually pressed
    // else if (KEY_STATUS.space && jumpCounter) {
    //     player.dy = player.jumpDy;
    //     this.isJumping = true;
    // } 

    // else {
    //     player.dy = 0;
    // }

    // this.x += this.dx;
    // this.y += this.dy;

    // add gravity
    // if (this.isFalling || this.isJumping) {
    //   this.dy += this.gravity;
    // }

    // this.dy += this.gravity;
    this.y += this.dy;

    if (this.y < this.originY) {    
        this.dy += this.gravity;
        jumpCounter--;
    } else {
        // 触到地板
        this.dy = 0;
        this.y  = this.originY;
        this.isJumping = false;
    }

    // change animation if falling
    if (player.dy > 0) {
      player.anim = player.fallAnim;
    }
    // change animation is jumping
    else if (player.dy < 0) {
      player.anim = player.jumpAnim;
    }
    else {
      player.anim = player.walkAnim;
    }

    this.jumpCounter = jumpCounter;

    if (KEY_STATUS["fireBullet"]) {
        var event = KEY_STATUS["fireBullet"];
        KEY_STATUS["fireBullet"] = undefined;
        this.fireBullet(event.x, event.y);
    }

    return true;
}

PlayerClass.prototype.fireBullet = function (targetX, targetY) {
    var cx = this.x + this.width / 2;
    var cy = this.y + this.height / 2;
    var bullet = new Bullet({cx: cx, cy: cy});
    bullet.attack(targetX, targetY);
    console.log(targetX, targetY);
    stage.addChild(bullet);

    assetLoader.sounds.bullet_attack.play();
}

/**
 * The player object
 */
var playerConstructor = function(player) {
  // add properties directly to the player imported object
  player.width     = 60;
  player.height    = 96;
  // 玩家速度
  // player.speed     = 6;
  player.speed     = 1;

  // jumping
  player.gravity   = 1;
  player.dy        = 0;
  player.jumpDy    = -10;
  player.isFalling = false;
  player.isJumping = false;

  // spritesheets
  // 这个时候还是string,真是坑爹==
  player.sheet     = new SpriteSheet(assetLoader.imgs.avatar_normal);
  player.walkAnim  = new Animation(player.sheet, 4, 0, 15);
  player.jumpAnim  = new Animation(player.sheet, 4, 15, 15);
  player.fallAnim  = new Animation(player.sheet, 4, 11, 11);
  player.anim      = player.walkAnim;

  Vector.call(player, 0, 0, 0, player.dy);

  var jumpCounter = 0;  // how long the jump button can be pressed down

  /**
   * Update the player's position and animation
   */
  player.update = function() {

    // jump if not currently jumping or falling
    if (KEY_STATUS.space && player.dy === 0 && !player.isJumping) {
      player.isJumping = true;
      player.dy = player.jumpDy;
      jumpCounter = 12;
      assetLoader.sounds.jump.play();
    }

    // jump higher if the space bar is continually pressed
    if (KEY_STATUS.space && jumpCounter) {
      player.dy = player.jumpDy;
    }

    jumpCounter = Math.max(jumpCounter-1, 0);

    this.advance();

    // add gravity
    if (player.isFalling || player.isJumping) {
      player.dy += player.gravity;
    }

    // change animation if falling
    if (player.dy > 0) {
      player.anim = player.fallAnim;
    }
    // change animation is jumping
    else if (player.dy < 0) {
      player.anim = player.jumpAnim;
    }
    else {
      player.anim = player.walkAnim;
    }

    player.anim.update();

    // game over
    // if (player.y + player.height >= canvas.height) {
    //   gameOver();
    // }
  };

  /**
   * Draw the player at it's current position
   */
  player.draw = function() {
    player.anim.draw(player.x, player.y);
  };

  /**
   * Reset the player's position
   */
  player.reset = function() {
    player.x = 64;
    player.y = 250;
  };

  return player;
};

// var player = playerConstructor(Object.create(Vector.prototype));

/**
 * Sprites are anything drawn to the screen (ground, enemies, etc.)
 * @param {integer} x - Starting x position of the player
 * @param {integer} y - Starting y position of the player
 * @param {string} type - Type of sprite
 */
function Sprite(x, y, type) {
  this.x      = x;
  this.y      = y;
  this.width  = platformWidth;
  this.height = platformWidth;
  this.type   = type;
  Vector.call(this, x, y, 0, 0);

  /**
   * Update the Sprite's position by the player's speed
   */
  this.update = function() {
    this.dx = -player.speed;
    this.advance();
  };

  /**
   * Draw the sprite at it's current position
   */
  this.draw = function() {
    ctx.save();
    ctx.translate(0.5,0.5);
    ctx.drawImage(assetLoader.imgs[this.type], this.x, this.y);
    ctx.restore();
  };
}
// Sprite.prototype = Object.create(Vector.prototype);

/**
 * Get the type of a platform based on platform height
 * @return Type of platform
 */
function getType() {
  var type;
  switch (platformHeight) {
    case 0:
    case 1:
      type = Math.random() > 0.5 ? 'grass1' : 'grass2';
      break;
    case 2:
      type = 'grass';
      break;
    case 3:
      type = 'bridge';
      break;
    case 4:
      type = 'box';
      break;
  }
  if (platformLength === 1 && platformHeight < 3 && rand(0, 3) === 0) {
    type = 'cliff';
  }

  return type;
}
