/** player.js **/


/**
 * The player Class
 */

function PlayerClass(props) {
    PlayerClass.superClass.constructor.call(this, props);
}

Q.inherit(PlayerClass, Q.DisplayObjectContainer);

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
