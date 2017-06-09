/**
 * 子弹的实现
 * @param props
 * @constructor
 */
var Bullet = function(props){
    var width = globalConf.bulletWidth;
    var height = globalConf.bulletHeight;
    props.x = props.cx - width / 2;
    props.y = props.cy - height / 2;

    props.image = assetLoader.imgs.bullet;

    Bullet.superClass.constructor.call(this,props);
    this.completed = false;
    this.target = null;

    this.width = width;
    this.height = height;

    this.attackTween = undefined;
    this.init();
}

Q.inherit(Bullet,Q.MovieClip);

Bullet.prototype.init = function () {
    this.addFrame(
        [
            {rect : [0, 0, 64, 64]},
        ]
    )
}

Bullet.prototype.attack = function (targetX, targetY) {
    var self = this;

    var x1 = targetX - this.width / 2;
    var y1 = targetY - this.height / 2;
    // console.log("Bullet.attack", x1, y1);
    var tween = new Q.Tween(this, {x: x1, y: y1}, {time: 500, onComplete: function () {
        self.onComplete();
    }});
    tween.start();
    // Q.trace("bullet attack", target);
    this.attackTween = tween;
}

Bullet.prototype.isEnd = function () {
    return this.completed;
}

Bullet.prototype.explode = function (target) {
    this.attackTween.stop();
    this.alpha = 1;
    var self = this;
    var tween = new Q.Tween(this, {width: this.width * 3, height: this.height * 3,
            x: this.x - this.width * 1.5,
            y: this.y - this.height * 1.5,
            alpha:0},
        {time: 100, onComplete: function () {
            stage.background.removeEnemy(target);
            if (self.parent) self.parent.removeChild(self)
        }});
    tween.start();
    assetLoader.sounds.bom_attack.play();
}

Bullet.prototype.onComplete = function () {
    this.completed = true;
    if (this.parent) this.parent.removeChild(this);
}

Bullet.attack = function (fromX, fromY, targetX, targetY) {
    var bullet = new Bullet({cx: fromX, cy: fromY});
    window.stage.addChild(bullet);
    bullet.attack(targetX, targetY);
}

Bullet.prototype.update = function (timeInfo) {
    // TODO 优化检查次数
    var enemies = stage.background.enemyList;
    var self = this;
    enemies.forEach(function (enemy, index, p3) {
        // FIXME 飞行过快导致碰撞检测不准
        // 考虑使用距离检测
        if (Q.hitTestObject(enemy, self)) {
            self.explode(enemy);
            return false;
        }
    })
    return true;
}

function FogBullet(cx, cy) {
    var props = {};
    props.image = assetLoader.imgs.bullet
    FogBullet.superClass.constructor.call(this, props);
    this.width = 64;
    this.height = 64;
    this.x = cx - this.width;
    this.y = cy - this.height;

    this.addFrame([
        {rect: [0, 0, 64, 64]}
    ]);

    var self = this;
    this.alpha = 1;
    var tween = new Q.Tween(this, {width: this.width * 3, height: this.height * 3,
                x: this.x - this.width * 1.5,
                y: this.y - this.height * 1.5,
            alpha:0},
            {time: 500, onComplete: function () {
        self.onComplete();
    }});
    tween.start();
}
Q.inherit(FogBullet, Q.MovieClip);

FogBullet.prototype.onComplete = function () {
    this.parent.removeChild(this);
}