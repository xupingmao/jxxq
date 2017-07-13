/** enemies.js
 *  敌人的实现
 *
 **/

function EnemyClass(image, x, bottomY, xCount, yCount) {
    var props = {};
    props.image = image;

    EnemyClass.superClass.constructor.call(this, props);

    // this.rectWidth = image.width;
    // this.rectHeight = image.height;

    xCount = xCount || 1;
    yCount = yCount || 1;

    var rectWidth = image.width / xCount;
    var rectHeight = image.height / yCount;

    this.width = image.width * globalConf.scaleX / xCount;
    this.height = image.height * globalConf.scaleY / yCount;

    this.x = x;
    this.y = bottomY - this.height;

    this.xCount = xCount;
    this.yCount = yCount;
    this.rectWidth = rectWidth;
    this.rectHeight = rectHeight;

    for (var i = 0; i < xCount; i++) {
        var x = rectWidth * i;
        var y = 0;
        var rect = [x, y, rectWidth, rectHeight];
        this.addFrame({rect: rect, interval: 100});
    }

}

Q.inherit(EnemyClass, Q.MovieClip);

EnemyClass.prototype.update = function (timeInfo) {
    this.x -= globalConf.grassSpeed;

    if (!this.hit && Q.hitTestObject(stage.player, this)) {
        stage.addChild(new FogBullet(this.x + this.width/2, this.y+this.height/2));
        assetLoader.sounds.bom_attack.play();
        this.hit = true;
    }

    if (this.x + this.width <= 0) {
        this.parent.removeChild(this);
    }
    return true;
}

/**
 * 每个对象都有 attacked 方法
 * 调用该方法时会自己减少生命值,执行死亡过程等等
 */
EnemyClass.prototype.attacked = function (attackObject) {
    // TODO 暂时实现成一次攻击就死亡
    var xCount = this.xCount;
    var yCount = this.yCount;

    var rectWidth = this.rectWidth;
    var rectHeight = this.rectHeight;

    var interval = 100;

    this.stop();
    for (var i = 0; i < xCount; i++) {
        var x = rectWidth * i;
        var y = 2 * rectHeight;
        var rect = [x, y, rectWidth, rectHeight];
        this.setFrame({rect: rect, interval: interval}, i);
    }
    var self = this;
    this.gotoAndPlay(0);

    setTimeout(function () {
        stage.background.removeEnemy(self);
    }, interval * (xCount-1));
}

/**
 *
 * @param randRoad 道路的位置
 */
function randomEnemy(randRoad) {
    if (Math.random() < 0.5) {
        return new EnemyClass(assetLoader.imgs.enemy_4, randRoad.x + randRoad.width/2, randRoad.y, 4, 4);
    } else {
        return new EnemyClass(assetLoader.imgs.enemy_3, randRoad.x + randRoad.width/2, randRoad.y - globalConf.height/4, 4, 4);
    }
}