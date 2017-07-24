/**
 各种文字展示
 */


function TextBoard() {
    var props = {};
    TextBoard.superClass.constructor.call(this, props);

    this.scoreText = new Q.Text({x: globalConf.width - 80, y: 10, color:"green"});
    this.stageText = new Q.Text({x: globalConf.width - 200, y:30, color:"green"});
    this.backdropText = new Q.Text({x: globalConf.width - 200, y: 50, color:"green"});
    this.grassText = new Q.Text({x: globalConf.width - 200, y: 70, color:"green"});
    this.screenText = new Q.Text({x: globalConf.width - 200, y: 90, color:"red"});
    this.canvasText = new Q.Text({x: globalConf.width - 200, y: 110, color:"red"});
    this.addChild(this.scoreText);
    this.addChild(this.stageText);
    this.addChild(this.backdropText);
    this.addChild(this.grassText);
    this.addChild(this.screenText);
    this.addChild(this.canvasText);
}

Q.inherit(TextBoard, Q.DisplayObjectContainer);


TextBoard.prototype.update = function (timeInfo) {
    this.scoreText.text = "得分:" + parseInt(stage.score / 30);
    this.stageText.text = "stage => width:" + globalConf.width + ",height:" + globalConf.height.toFixed(2);
    this.backdropText.text = "backdrop => width:" + globalConf.backdropWidth.toFixed(2) + ",height:" + globalConf.backdropHeight.toFixed(2);
    this.grassText.text = "text => width:" + globalConf.grassWidth.toFixed(2) + ",height:" + globalConf.grassHeight.toFixed(2);
    this.screenText.text = "width:" + window.screen.width + ",height:" + window.screen.height;
    this.canvasText.text = "canvas:" + $("#canvas").width() + "," + $("#canvas").height();
    return true;
}
