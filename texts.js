/**
 各种文字展示
 */


function TextBoard() {
    var props = {};
    TextBoard.superClass.constructor.call(this, props);

    this.scoreText = new Q.Text({x: globalConf.width - 80, y: 10});
    this.stageText = new Q.Text({x: globalConf.width - 200, y:30});
    this.backdropText = new Q.Text({x: globalConf.width - 200, y: 50});
    this.grassText = new Q.Text({x: globalConf.width - 200, y: 70});
    this.addChild(this.scoreText);
    this.addChild(this.stageText);
    this.addChild(this.backdropText);
    this.addChild(this.grassText);
}

Q.inherit(TextBoard, Q.DisplayObjectContainer);


TextBoard.prototype.update = function (timeInfo) {
    this.scoreText.text = "得分:" + parseInt(stage.score / 30);
    this.stageText.text = "stage => width:" + globalConf.width + ",height:" + globalConf.height.toFixed(2);
    this.backdropText.text = "backdrop => width:" + globalConf.backdropWidth + ",height:" + globalConf.backdropHeight.toFixed(2);
    this.grassText.text = "text => width:" + globalConf.grassWidth + ",height:" + globalConf.grassHeight.toFixed(2);
    return true;
}
