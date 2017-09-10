/**
 各种文字展示
 */


function TextBoard() {
    var props = {};
    TextBoard.superClass.constructor.call(this, props);

    var font = "25px arial";

    this.scoreText = new Q.Text({x: 20, y: 80, color:"red", font: font});
    this.lifeText  = new Q.Text({x: 20, y: 120, color:"red", font: font});
    this.killedText = new Q.Text({x: 20, y: 160, color:"red", font: font});
    
    this.addChild(this.scoreText);
    this.addChild(this.lifeText);
    this.addChild(this.killedText);

    if (stage.enableDebug) {    
        this.stageText = new Q.Text({x: globalConf.width - 200, y:30, color:"red"});
        this.backdropText = new Q.Text({x: globalConf.width - 200, y: 50, color:"red"});
        this.grassText = new Q.Text({x: globalConf.width - 200, y: 70, color:"red"});
        this.screenText = new Q.Text({x: globalConf.width - 200, y: 90, color:"red"});
        this.canvasText = new Q.Text({x: globalConf.width - 200, y: 110, color:"red"});

        this.addChild(this.stageText);
        this.addChild(this.backdropText);
        this.addChild(this.grassText);
        this.addChild(this.screenText);
        this.addChild(this.canvasText);
    }
}

Q.inherit(TextBoard, Q.DisplayObjectContainer);


TextBoard.prototype.update = function (timeInfo) {
    this.scoreText.text = "得分:" + stage.score.toFixed(1);
    this.lifeText.text  = "剩余生命:" + stage.player.life;
    this.killedText.text = "击杀数:" + stage.player.killed;

    if (stage.enableDebug) {    
        this.stageText.text = "stage => width:" + globalConf.width + ",height:" + globalConf.height.toFixed(2);
        this.backdropText.text = "backdrop => width:" + globalConf.backdropWidth.toFixed(2) + ",height:" + globalConf.backdropHeight.toFixed(2);
        this.grassText.text = "text => width:" + globalConf.grassWidth.toFixed(2) + ",height:" + globalConf.grassHeight.toFixed(2);
        this.screenText.text = "width:" + window.screen.width + ",height:" + window.screen.height;
        this.canvasText.text = "canvas:" + $("#canvas").width() + "," + $("#canvas").height();
    }
    return true;
}
