/** enemies.js **/

function EnemyClass(image, x, bottomY) {
    var props = {};
    props.image = image;

    EnemyClass.superClass.constructor.call(this, props);

    this.rectWidth = image.width;
    this.rectHeight = image.height;

    this.width = image.width * globalConf.scaleX;
    this.height = image.height * globalConf.scaleY;

    this.x = x;
    this.y = bottomY - image.height * globalConf.scaleY;
}

Q.inherit(EnemyClass, Q.Bitmap);

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