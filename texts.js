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
    
    // this.addChild(this.scoreText);
    // this.addChild(this.lifeText);
    // this.addChild(this.killedText);

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

    var width = globalConf.width / 3;
    var offsetX = 50;

    var score = createBitmap(assetLoader.imgs.score, offsetX, 45);
    var life = createBitmap(assetLoader.imgs.life, offsetX + width, 45);
    var kill = createBitmap(assetLoader.imgs.kill, offsetX + width * 2, 45);
    this.addChild(score);
    this.addChild(life);
    this.addChild(kill);

    this.scoreImgContainer = createNumberContainer(score);
    this.lifeImgContainer  = createNumberContainer(life);
    this.killImgContainer  = createNumberContainer(kill);

    window.scoreImgContainer = this.scoreImgContainer;

    this.addChild(this.scoreImgContainer);
    this.addChild(this.lifeImgContainer);
    this.addChild(this.killImgContainer);
}

Q.inherit(TextBoard, Q.DisplayObjectContainer);

function createNumberContainer(prev) {
    var container = new MyContainer();
    container.x = objRight(prev);
    container.y = objTop(prev);
    return container;
}

function createNumber(n, img) {
    if (!img) {
        img = assetLoader.imgs.numbers;
    }
    var width = img.width;
    var height = img.height;
    var partWidth = width / 10;
    var x = (n - 0) * partWidth;
    var bitmap = createBitmap(img, 0, 0, [x, 0, partWidth, height]);
    bitmap.width = partWidth;
    return bitmap;
}

function drawNumber(parent, value, img) {
    value = parseInt(value).toString();
    if (value != parent.numVal) {    
        parent.numVal = value;
        parent.reset();
        for (var i = 0; i < value.length; i++) {
            var c = value.charAt(i);
            parent.addHorizontal(createNumber(c, img));
        }
    }
}

TextBoard.prototype.update = function (timeInfo) {
    // this.scoreText.text = "得分:" + stage.score.toFixed(1);
    // this.lifeText.text  = "剩余生命:" + stage.player.life;
    // this.killedText.text = "击杀数:" + stage.player.killed;

    drawNumber(this.scoreImgContainer, stage.score);
    drawNumber(this.lifeImgContainer, stage.player.life, assetLoader.imgs.numbers_red);
    drawNumber(this.killImgContainer, stage.player.killed);

    if (stage.enableDebug) {    
        this.stageText.text = "stage => width:" + globalConf.width + ",height:" + globalConf.height.toFixed(2);
        this.backdropText.text = "backdrop => width:" + globalConf.backdropWidth.toFixed(2) + ",height:" + globalConf.backdropHeight.toFixed(2);
        this.grassText.text = "text => width:" + globalConf.grassWidth.toFixed(2) + ",height:" + globalConf.grassHeight.toFixed(2);
        this.screenText.text = "width:" + window.screen.width + ",height:" + window.screen.height;
        this.canvasText.text = "canvas:" + $("#canvas").width() + "," + $("#canvas").height();
    }
    return true;
}
