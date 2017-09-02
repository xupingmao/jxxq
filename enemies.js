/** enemies.js
 *  敌人的实现
 *
 **/

function EnemyClass(props) {
    EnemyClass.superClass.constructor.call(this, props);
    // this.rectWidth = image.width;
    // this.rectHeight = image.height;

    // left, right, top, bottom

    var image = props.image;
    var x = props.x;
    var bottom = props.bottom;
    var xCount = props.xCount || 1;
    var yCount = props.yCount || 1;
    var startY = startY || 0;
    if (props.forwardFrameIndex) {
        this.forwardFrameIndex = props.forwardFrameIndex;
    } else {
        this.forwardFrameIndex = startY;
    }

    // 相对地板移动速度
    var forwadSpeed = props.forwadSpeed || 0;
    this.dieFrameIndex = props.dieFrameIndex || 0;
    this.forwadSpeed = globalConf.grassSpeed + forwadSpeed;


    var rectWidth = image.width / xCount;
    var rectHeight = image.height / yCount;

    this.width = image.width * globalConf.scaleX / xCount;
    this.height = image.height * globalConf.scaleY / yCount;

    this.x = x;
    this.y = bottom - this.height;

    this.xCount = xCount;
    this.yCount = yCount;
    this.rectWidth = rectWidth;
    this.rectHeight = rectHeight;
    this.dead = false;

    for (var i = 0; i < xCount; i++) {
        var x = rectWidth * i;
        var y = this.forwardFrameIndex * this.height;
        var rect = [x, y, rectWidth, rectHeight];
        this.addFrame({rect: rect, interval: 100});
    }
}

Q.inherit(EnemyClass, Q.MovieClip);

EnemyClass.prototype.update = function (timeInfo) {
    this.x -= this.forwadSpeed;

    if (!this.hit && Q.hitTestObject(stage.player, this)) {
        stage.addChild(new FogBullet(this.x + this.width/2, this.y+this.height/2));
        assetLoader.sounds.bom_attack.play();
        this.hit = true;
    }

    if (this.x + this.width <= 0) {
        stage.background.removeEnemy(this);
    }
    return true;
}

/**
 * 每个对象都有 attacked 方法
 * 调用该方法时会自己减少生命值,执行死亡过程等等
 */
EnemyClass.prototype.attacked = function (attackObject) {
    if (this.dead) {
        return;
    }
    this.dead = true;
    // TODO 暂时实现成一次攻击就死亡
    var xCount = this.xCount;
    var yCount = this.yCount;

    var rectWidth = this.rectWidth;
    var rectHeight = this.rectHeight;

    var interval = 100;

    this.stop();
    for (var i = 0; i < xCount; i++) {
        var x = rectWidth * i;
        var y = this.dieFrameIndex * rectHeight;
        var rect = [x, y, rectWidth, rectHeight];
        this.setFrame({rect: rect, interval: interval}, i);
    }
    var self = this;
    this.gotoAndPlay(0);

    setTimeout(function () {
        stage.background.removeEnemy(self);
    }, interval * (xCount-1));
}


var towerUpdate = function (timeInfo) {
    this.x -= globalConf.grassSpeed;
    // console.log("tower update");
    if (this.currentFrame == 3) {
        this.stop();
    }
    if (this.x + this.width <= 0) {
        stage.background.removeEnemy(this);
    }
    return true;
}

function createTower(randRoad) {
    var props = {};
    props.image = assetLoader.imgs.enemy_5;
    props.x = randRoad.x;
    props.bottom = randRoad.y;
    props.xCount = 4;
    props.yCount = 1;

    var tower = new EnemyClass(props);
    tower.update = towerUpdate; 
    tower.width  = globalConf.middleUnitWidth;
    tower.height = globalConf.middleUnitHeight;
    tower.name = "Tower";

    console.log("Add tower", tower);
    return tower;
}

function createBunker(randRoad) {
    var props = {};
    props.image = assetLoader.imgs.enemy_4;
    props.x = randRoad.x + randRoad.width/2;
    props.xCount = 8;
    props.yCount = 3;
    props.bottom = randRoad.y;

    // var bunker = new EnemyClass(assetLoader.imgs.enemy_4, randRoad.x + randRoad.width/2, randRoad.y, 4, 4);
    var bunker = new EnemyClass(props);
    bunker.width = globalConf.enemyWidth;
    bunker.height = globalConf.enemyHeight;
    bunker.name = "Bunker";
    bunker.dieFrameIndex = 2;
    return bunker;
}

function createPlane(randRoad) {
    var props = {};
    props.image = assetLoader.imgs.enemy_3;
    props.x = randRoad.x + randRoad.width/2;
    props.bottom = randRoad.y - globalConf.height/4;
    props.xCount = 8;
    props.yCount = 2;

    var plane = new EnemyClass(props);

    plane.width = globalConf.enemyWidth;
    plane.height = globalConf.enemyHeight;
    plane.name = "Plane";
    plane.dieFrameIndex = 1;
    return plane;
}

// 三管炮
function createSanguanpao(randRoad) {
    var props = {};
    props.image = assetLoader.imgs.enemy_6;
    props.x = randRoad.x + randRoad.width/2;
    props.xCount = 8;
    props.yCount = 4;
    props.bottom = randRoad.y;
    props.forwardFrameIndex = 0;
    props.dieFrameIndex = 3;

    var enemy = new EnemyClass(props);
    enemy.name = "三管炮";
    return enemy;
}

// 蜘蛛精
function createZhizhujing(randRoad) {
    // 运动，缩回，开火，爆炸
    var props = {};
    props.image = assetLoader.imgs.enemy_7;
    props.x = randRoad.x + randRoad.width/2;
    props.xCount = 8;
    props.yCount = 4;
    props.bottom = randRoad.y;
    props.forwardFrameIndex = 0;
    props.dieFrameIndex = 3;
    props.forwadSpeed = 3;

    var enemy = new EnemyClass(props);
    enemy.name = "蜘蛛精";
    return enemy;
}

// 小滚轮
function createXiaogunlun(randRoad) {
    // 运动，直射，扫射，爆炸
    var props = {};
    props.image = assetLoader.imgs.enemy_8;
    props.x = randRoad.x + randRoad.width/2;
    props.xCount = 8;
    props.yCount = 4;
    props.bottom = randRoad.y;
    props.forwardFrameIndex = 0;
    props.dieFrameIndex = 3;
    props.forwadSpeed = 5;

    var enemy = new EnemyClass(props);
    enemy.name = "小滚轮";
    return enemy;
}

// 雷达
function createLeida(randRoad) {
    // 下蹲起立，爆炸
    var props = {};
    props.image = assetLoader.imgs.enemy_9;
    props.x = randRoad.x + randRoad.width/2;
    props.xCount = 8;
    props.yCount = 2;
    props.bottom = randRoad.y;
    props.forwardFrameIndex = 0;
    props.dieFrameIndex = 1;

    var enemy = new EnemyClass(props);
    enemy.name = "雷达";
    return enemy;
}

/**
 *
 * @param randRoad 道路的位置
 */
function randomEnemy(randRoad) {
    // var value = Math.random();
    var randomCreator = pickOne([createBunker, createLeida, createXiaogunlun, createZhizhujing, createPlane, createSanguanpao]);
    return randomCreator(randRoad);
}