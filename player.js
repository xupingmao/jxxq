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

    this.width  = globalConf.playerWidth;
    this.height = globalConf.playerHeight;
    this.x = 100;
    this.y = globalConf.height - this.height - globalConf.roadHeight;
    this.originY = this.y;

    this.dx = 0;
    this.dy = 0;
    this.jumpDy = 5;

    this.isJumping  = false;
    this.isSecondJumping = false;
    this.isFalling  = false;
    this.gravity    = 5;
    this.roadHeight = globalConf.roadHeight;
    this.speed = 0.5;
    this.groundY = globalConf.height - this.height;
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
        this.dy          = -40;
        // vt = 1/2 * a * t ^ 2
        // v  = 1/2 * a * t
        // t  = 15  半秒左右
        assetLoader.sounds.jump.play();
        KEY_STATUS.space = false;
    } else if (KEY_STATUS.space && player.isJumping && !player.isSecondJumping) {
        // 第二次跳跃
        // alert("Yes!");
        this.dy = -50;
        assetLoader.sounds.jump.play();
        player.isSecondJumping = true;
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

    var groundY = stage.background.getY(this);

    var footY = this.y + this.height;
    if (footY < groundY) {
        this.dy += this.gravity;
        // jumpCounter--;
    } else {
        // 触到地板
        this.dy = 0;
        this.y  = groundY - this.height;
        this.isJumping = false;
        this.isSecondJumping = false;
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

    stage.score += this.speed;
    return true;
}

PlayerClass.prototype.fireBullet = function (targetX, targetY) {
    var cx = this.x + this.width / 2;
    var cy = this.y + this.height / 2;
    var bullet = new Bullet({cx: cx, cy: cy});

    var width = targetX - cx;
    var height = targetY - cy;
    bullet.attack(cx + globalConf.width,
        cy + globalConf.width * height / width);
    console.log(targetX, targetY);
    stage.addChild(bullet);

    assetLoader.sounds.bullet_attack.play();
}
