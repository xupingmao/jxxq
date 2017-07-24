/** enemies.js
 *  敌人的实现
 *
 **/

function EnemyClass(image, x, bottomY, xCount, yCount, startY) {
    var props = {};
    props.image = image;
    startY = startY || 0;

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
        var y = startY;
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

var towerUpdate = function (timeInfo) {
    this.x -= globalConf.grassSpeed;
    console.log("tower update");
    if (this.currentFrame == 3) {
        this.stop();
    }
    if (this.x + this.width <= 0) {
        this.parent.removeChild(this);
    }
    return true;
}

function createTower(randRoad) {
    var tower = new EnemyClass(assetLoader.imgs.enemy_5, randRoad.x + randRoad.width/2, randRoad.y, 4, 1);

    tower.update = towerUpdate; 
    tower.width  = globalConf.middleUnitWidth;
    tower.height = globalConf.middleUnitHeight;

    console.log("Add tower", tower);
    return tower;
}

function createBunker(randRoad) {
    var bunker = new EnemyClass(assetLoader.imgs.enemy_4, randRoad.x + randRoad.width/2, randRoad.y, 4, 4);
    bunker.width = globalConf.enemyWidth;
    bunker.height = globalConf.enemyHeight;
    return bunker;
}

function createPlane(randRoad) {
    var plane = new EnemyClass(assetLoader.imgs.enemy_3, randRoad.x + randRoad.width/2, randRoad.y - globalConf.height/4, 4, 4);

    plane.width = globalConf.enemyWidth;
    plane.height = globalConf.enemyHeight;
    return plane;
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
    var value = Math.random();
    if (value < 0.3) {
        return createBunker(randRoad);
    } else if (value >= 0.3 && value <= 0.7) {
        return createTower(randRoad);
    } else {
        return createPlane(randRoad);
    }
}