/**
 * 幸运箱子
 */


function LuckyBox() {
    var props = {};
    var x = globalConf.width;
    var y = globalConf.height / 2;
    props.image = assetLoader.imgs.box_1;
    props.x = x;
    props.y = y;
    props.width = props.image.width;
    props.height = props.image.height;
    LuckyBox.superClass.constructor.call(this,props);
    this.addFrame({rect: [0, 0, 32, 32]});
    console.log("Add Box");
}

Q.inherit(LuckyBox, Q.MovieClip);

LuckyBox.prototype.update = function (timeInfo) {
    if (this.x < 0 && this.parent) {
        this.parent.removeChild(this);
        console.log("Remove Box");
        return false;
    }
    this.x -= globalConf.grassSpeed;
    return true;
}

function createRandomBox() {
    return new LuckyBox();
}