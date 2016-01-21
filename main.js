var AM = new AssetManager();
var gameEngine = new GameEngine();


function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Pikachu(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 500, 252, 0.1, 41, true, true);
    this.x = 0;
	this.y = 0;
	this.game = game;
	this.ctx = game.ctx;
}

Pikachu.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 1);
}

Pikachu.prototype.update = function () {
	if (this.game.space) {
		console.log("space pressed");
		var eye = new Eye(gameEngine, AM.getAsset("./img/eye.png"));
		gameEngine.addEntity(eye);
	}
}



function Eye(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 200, 200, 0.1, 5, true, false);
    this.x = 500;
    this.y = Math.random() * 150;
    this.game = game;
    this.ctx = game.ctx;
}

Eye.prototype.draw = function () {
//    console.log("drawing");
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, .5);
}

Eye.prototype.update = function() {
    this.x += -4;
	if(this.x < -50) {
		this.removeFromWorld = true;
	}
}


AM.queueDownload("./img/pikachu.png");
AM.queueDownload("./img/eye.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
	canvas.focus();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Pikachu(gameEngine, AM.getAsset("./img/pikachu.png")));

    console.log("All Done!");
});