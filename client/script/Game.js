var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var Img = {};
Img.player = new Image();
Img.player.src = "/client/images/character.png";
var ctx = document.getElementById("game").getContext("2d");

testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x + rect2.width 
		&& rect2.x <= rect1.x +rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

var player;
var gameStarted;

Player = function(param) {

	var self = {
		//socket: param.socket,
		x: param.pos.x,
		y: param.pos.y,
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
		keyLeft: false,
		up:  false,
		down: false,
		img: 'client/images/character.png',


	}

	self.update = function(){
		self.updateSpeed();
		self.setViewPortOnPlayer();
		/*
		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);

		}*/
		self.x+=self.speedX;
		self.y+=self.speedY;
	}

	self.setViewPortOnPlayer = function(){
		var playerPosition = self.pos;
		var gameCanvas = document.getElementById("game");
		gameCanvas.scrollTop = playerPosition.x;
    	gameCanvas.scrollLeft = playerPosition.y;
		console.log("player position: ",playerPosition);
	}

	self.updateSpeed = function() {
		if(self.right)
			self.speedX = self.speedMax;
		else if(self.keyLeft)
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
		//var x = self.x-self.width/2;
		//var y = self.y-self.height/2;
		ctx.drawImage(Img.player,self.x,self.y);
	}

	return self;
}



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
		console.log(data);
		player = new Player(data);
		player.draw();
		addListener();
		gameStarted = true;
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
		}
		else if(event.keyCode === 83) {	//s
			player.down = true;
		}
		else if(event.keyCode === 65) { //a
			player.keyLeft = true;
		}
		else if(event.keyCode === 87) {// w
			player.up = true;
		}
		/*
		else if(event.keyCode === 80) //p
		paused = !paused;
	 	 */
	}

	document.onkeyup = function(event) {
		if(event.keyCode === 68) {	//d
			player.right = false;
		}
		else if(event.keyCode === 83) {	//s
			player.down = false;
		}
		else if(event.keyCode === 65) { //a
			player.keyLeft = false;
		}
		else if(event.keyCode === 87) {// w
			player.up = false;
		}
	}
}

setInterval(function() {
	if (!gameStarted) return;
	player.update();
	player.draw();

},30);






