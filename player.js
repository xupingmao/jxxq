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
    this.x = globalConf.width / 4;
    this.y = globalConf.roadY - this.height;
    this.originY = this.y;

    this.dx = 0;
    this.dy = 0;
    this.jumpDy = 5;

    this.isJumping  = false;
    this.isSecondJumping = false;
    this.isFalling  = false;
    this.roadHeight = globalConf.roadHeight;
    this.speed = 0.5 / 30;
    this.life = 5;
    this.killed = 0;
}

Q.inherit(PlayerClass, Q.Bitmap);

PlayerClass.prototype.update = function (timeInfo) {
    // console.log(timeInfo);
    var player = this;
    var jumpCounter = this.jumpCounter;
    var bottom = this.y + this.height;
    // 地板的y值
    var roadY   = globalConf.roadY;
    var groundY = stage.background.getY(this);
    stage.score += this.speed;

    // jump if not currently jumping or falling
    if (KEY_STATUS.space && !player.isJumping && bottom <= roadY) {
        this.isJumping   = true;
        this.dy = -globalConf.gravity * 8;  // 8帧后落下
        // vt = 1/2 * a * t ^ 2
        // v  = 1/2 * a * t
        // t  = 15  半秒左右
        assetLoader.sounds.jump.play();
        KEY_STATUS.space = false;
    } else if (KEY_STATUS.space && player.isJumping && !player.isSecondJumping) {
        // 第二次跳跃
        // alert("Yes!");
        this.dy = -globalConf.gravity * 8; // 再加速4帧
        assetLoader.sounds.jump.play();
        player.isSecondJumping = true;
    }

    this.y += this.dy;
    var footY = this.y + this.height;
    if (footY < groundY) {
        this.dy += globalConf.gravity;
        // jumpCounter--;
    } else {
        // 掉到道路下面了
        if (!stage.enableDebug && bottom > roadY) {
            this.die();
            return false;
        }
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
    // var bullet = new Bullet({cx: cx, cy: cy});
    var bullet = createBullet(cx, cy, targetX, targetY);

    var width = targetX - cx;
    var height = targetY - cy;
    bullet.attack(targetX, targetY);
    // console.log(targetX, targetY);
    stage.actorLayer.addChild(bullet);

    assetLoader.sounds.bullet_attack.play();
}

PlayerClass.prototype.attacked = function (atkObj) {
    console.log("attacked");
    this.life--;
    if (this.life <= 0) {
        this.die();
    }
}

PlayerClass.prototype.die = function () {
    if (stage.enableDebug) {
        return;
    }
    stage.paused = true;
    stage.gameOver();
}