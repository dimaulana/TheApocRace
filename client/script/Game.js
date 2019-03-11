var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var Img = {};
Img.player = new Image();
Img.player.src = "/client/images/character.png";
var ctx = document.getElementById("game").getContext("2d");

var player;

// When the game has not started, paused is true in order to 
// stop the updates;
var paused = true;


testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x + rect2.width
		&& rect2.x <= rect1.x +rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}


Player = function(param) {

	var self = {
		//socket: param.socket,
		x: 200,
		y:200,
		speedX: param.speed.x,
		speedY: param.speed.y,
		speedMax: param.speedMax,
		hp: param.hp,
		score: param.score,
		lives: param.lives,
		width: param.width,
		height: param.height,
		alive: param.alive,
		angle: param.angle,
		right: false,
		left: false,
		up:  false,
		down: false,
		img: 'client/images/character.png',


	}

	self.update = function(){
		self.updateSpeed();
		/*
		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);

		}*/
		self.x += self.speedX;
		self.y += self.speedY;

	}

	self.setViewPortOnPlayer = function(x, y){
		ctx.save();
		console.log("out of canvas");
		ctx.translate(x - ctx.canvas.width/2,0);
		ctx.restore();
	}

	self.updateSpeed = function() {
		if (self.right)
			self.speedX = self.speedMax;

		else if (self.left && ((self.x - self.speedMax) > 0))
			self.speedX = -self.speedMax;

		else
			self.speedX = 0;

		if(self.up)
			self.speedY = -self.speedMax;
		else if(self.down)
			self.speedY = self.speedMax;
		else
			self.speedY = 0;
	}

	self.draw = function(player) {
		ctx.clearRect(0, 0, 1280, 720);
		if(self.x + self.speedMax > 1280){
			self.setViewPortOnPlayer(self.x, self.y);
		}
		ctx.drawImage(Img.player,self.x,self.y);
	}

	return self;
}


// @Sahil: For testing;
var offsetX = 0;
var offsetY = 0;


function getImage(imageName) {
  	var x = document.createElement("IMG");
  	x.setAttribute("src", imageName);
  	x.setAttribute("width", "50");
  	x.setAttribute("height", "50");

  	return x;
}

startNewGame = function(){
	$(".star").hide();
	$('#game').show();

	socket.emit('storyMode', {});

	socket.on('initPack', function(data) {
		player = new Player(data);
		player.draw();
		addListener();
		paused = false;
		timeWhenGameStarted = Date.now();
		frameCount = 0;
		score = 0;

	});
}

function addListener() {
	// Controls WASD works after adding input component
	document.onkeydown = function(event) {
		if(event.keyCode === 68) {	//d
			player.right = true;
			offsetX++;

		}
		else if(event.keyCode === 83) {	//s
			player.down = true;
		}
		else if(event.keyCode === 65) { //a
			player.left = true;
			offsetX--;

		}
		else if(event.keyCode === 87) {// w
			player.up = true;
		}
		
		else if(event.keyCode === 80) {//p
			// TODO: Game Menu;
			paused = !paused;
		}
	 	 
	}

	document.onkeyup = function(event) {
		if(event.keyCode === 68) {	//d
			player.right = false;
		}
		else if(event.keyCode === 83) {	//s
			player.down = false;
		}
		else if(event.keyCode === 65) { //a
			player.left = false;
		}
		else if(event.keyCode === 87) {// w
			player.up = false;
		}
	}
}

setInterval(function() {
	if (paused) return;
	player.update();
	player.draw();
},30);


// @Sahil: For testing;
function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}
