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

    if (!props.image) {
        props.image = assetLoader.imgs.bullet;
    }

    Bullet.superClass.constructor.call(this,props);
    this.completed = false;
    this.target = null;

    this.width = width;
    this.height = height;

    this.attackTween = undefined;

    if (props.rectWidth) {
        this.myRectWidth = props.rectWidth;
    } else {
        this.myRectWidth = 64;
    }
    if (props.rectHeight) {
        this.myRectHeight = props.rectHeight;
    } else {
        this.myRectHeight = 64;
    }
    
    this.init();
}

Q.inherit(Bullet,Q.MovieClip);

Bullet.prototype.init = function () {
    this.addFrame(
        [
            {rect : [0, 0, this.myRectWidth, this.myRectHeight]},
        ]
    )
}

Bullet.prototype.attack = function (targetX, targetY) {
    var self = this;

    var x1, y1;

    var cx = this.x - this.width/2;
    var cy = this.y - this.height/2;

    var distance = 1000;
    var speed = 2;

    if (targetX == cx) {
        x1 = cx;
        y1 = cy + distance;
    } else {
        // tan(reg) = (targetY-cy) / (targetX-cx)
        var reg = Math.atan((targetY-cy)/(targetX-cx));
        x1 = cx + distance * Math.cos(reg);
        y1 = cy + distance * Math.sin(reg);
    }
    // console.log("Bullet.attack", x1, y1);
    // 创建子弹飞行动画
    var tween = new Q.Tween(this, {x: x1, y: y1}, {time: distance/speed, onComplete: function () {
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
            // stage.background.removeEnemy(target);
            // target.attacked();
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
    // var left = this.x;
    // var right = this.x + this.width;
    // var top = this.y;
    // var bottom = this.y + this.height;

    // if (left >= globalConf.width || right <= 0 || top >= globalConf.height || bottom <= 0) {
    //     this.onComplete();
    //     return false;
    // }

    // console.log("check enemy");
    var enemies = stage.background.enemyList;
    var self = this;
    var x = self.x+self.width/2;
    var y = self.y+self.height/2;
    enemies.forEach(function (enemy, index, p3) {
        // 碰撞并且敌人出现在屏幕中
        if (Q.hitTestPoint(enemy, x, y, false) >= 0 && enemy.x < globalConf.width) {
            console.log("hit enemy " + enemy.id);
            self.explode(enemy);
            enemy.attacked(self);
            return false;
        }
    })
    return true;
}

function FogBullet(cx, cy) {
    var props = {};
    props.image = assetLoader.imgs.bullet;
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

/**
 * 镭射子弹
 */
var LaserBullet = function (props) {
    var width = globalConf.bulletWidth;
    var height = globalConf.bulletHeight;
    props.x = props.cx - width / 2;
    props.y = props.cy - height / 2;

    props.image = assetLoader.imgs.bullet_1;

    LaserBullet.superClass.constructor.call(this,props);
    this.completed = false;
    this.target = null;

    this.width = width * 2;
    this.height = height * 2;

    this.attackTween = undefined;
    this.init();
}

Q.inherit(LaserBullet, Bullet);

function createBullet(cx, cy, targetX, targetY) {
    var rand = Math.random();
    if (true) {
        var rotation = 0;
        if (targetX && targetY) {
            if (targetX == cx) {
                rotation = 0;
            } else if (targetY == cy) {
                rotation = 90;
            } else {
                // tan(x) [-90, 90]
                // sin(x) [-90, 90]
                // cos(x) [0, 180]
                var x = targetX - cx;
                var y = cy - targetY;
                var distance = Math.sqrt(x*x, y*y);
                rotation = Math.acos(y / distance) * 180 / Math.PI;
            }
        }
        return new LaserBullet({cx: cx, cy: cy, 
            rotation: rotation, 
            rectWidth: 30, 
            rectHeight: 44});
    } else {
        return new Bullet({cx: cx, cy: cy});
    }
}