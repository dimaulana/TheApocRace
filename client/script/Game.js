var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var Img = {};
Img.player = new Image();
Img.player.src = "/client/images/character.png";
var canvas = document.getElementById("game");
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

var player;
var gameStarted;
var backgroundSound;

var gameArea = {
	x: 5000
};

var obstacles = [];
function tile() {
	this.width = 30;
	this.height = 100;
	this.x = Math.random() * (2000 - 10) + 10;
	this.y = canvas.height - this.height;

	this.draw = function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	this.update = function() {
		if (player.x === canvas.width/2)
			this.x -= player.speedX;
	}
}


Player = function(param) {

	var self = {
		//socket: param.socket,
		x: param.pos.x,
		y: param.pos.y,
		speedX: param.speed.x,
		speedY: param.speed.y,
		speedMax: param.speedMax,
		gravity: param.gravity,
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

		self.y += self.speedY;

		// TODO: Collision should do this with the tiles;
		if (self.y < 500) {
			self.y -= self.gravity;
		}


		if (self.x === canvas.width/2) {
			return;
		}

		self.x += self.speedX;

		if (self.x > canvas.width/2) {
			self.x = canvas.width/2;
		}
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
		else if(self.down) {
			//self.speedY = self.speedMax;
		}
		else
			self.speedY = 0;
	}

	self.draw = function(player) {
		ctx.drawImage(Img.player,self.x,self.y);
	}

	return self;
}
//Sound function that helps play sound
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    
    this.sound.setAttribute("storyMode", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
	
	
	
	
	

// Redraw canvas according to the updated positons;
function canvasDraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.draw();
	obstacles.forEach(function(tile) {
		tile.draw();
	});
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
		player = new Player(data);
		player.draw();
		addListener();
		paused = false;
		timeWhenGameStarted = Date.now();
		frameCount = 0;
		score = 0;
    	backgroundSound = new sound('client/sound/background.mp3');
	  	backgroundSound.play();
	  	gameStarted = true;
		// Adding random tiles;
		for (var i = 0; i < 10; i++) {
			obstacles.push(new tile());
		}
	});
}
>>>>>>> Added player movement with respect to other objects

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
			player.left = true;

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

function update() {
	if (paused) return;
	player.update();

	// TODO: Update all the other entities based
	// on the speed of the player
	// Update Tiles;
	obstacles.forEach(function(tile) {
		tile.update();
	});

	canvasDraw();
}

setInterval(update, 30);
