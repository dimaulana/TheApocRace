// Game.js starts and sets the game at the front end;
// Contributors: Hussein Parpia, Sahil Anand

var canvas = document.getElementById("game");
var ctx = document.getElementById("game").getContext("2d");
var display = document.querySelector('#game').getContext("2d");


var player, sprite_sheet, backgroundSound, level;
var obstacles = [];
var paused = true; // When the game has not started, paused is true in order to stop the updates;

// Dimensions of the player images;
const SPRITE_SIZE = 90;
const SPRITE_HEIGHT = 119;

// TODO: Hussein - Move to its own script file
function Animation(frame_set, delay) {

    this.count = 0;
    this.delay = delay; // The number of game cycles to wait until the next frame change.
    this.frame = 0;
    this.frame_index = 0;
    this.frame_set = frame_set;

    this.change = function(frame_set, delay = 15) {
    	if (this.frame_set != frame_set) {
    		this.count = 0;
    		this.delay = delay;
    		this.frame_index = 0;
    		this.frame_set = frame_set;
    		this.frame = this.frame_set[this.frame_index];
    	}
    }

    this.update = function() {
    	this.count ++;

		if (this.count >= this.delay) { // If enough cycles have passed, we change the frame.
    		this.count = 0; // Reset count;
    		this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
    		this.frame = this.frame_set[this.frame_index]; // Update current frame;
    	}
    }
}

// To keep track of the player sprite;
sprite_sheet = {
	frame_sets:[[0], [1, 2, 3], [4, 5, 6]] // standing, running right, running left;
};

// TODO: To get from asset manager;
var Img = {};

testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x + rect2.width
	&& rect2.x <= rect1.x +rect1.width
	&& rect1.y <= rect2.y + rect2.height
	&& rect2.y <= rect1.y + rect1.height;
}

function tile(locationX) {
	this.width = 30;
	this.height = Img.tile.height;
	this.x = locationX;
	this.y = canvas.height - this.height;

	this.draw = function() {
		ctx.drawImage(Img.tile,this.x, this.y);
	}

	this.update = function() {
		if (player.x === canvas.width/2)
			this.x -= player.speedX;
	}
}

Player = function(param) {
	var self = {
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
		gravity: param.gravity,
		right: false,
		left: false,
		up:  false,
		down: false,
		state: "stand",
		animation:new Animation(),
		image: new Image(),
		fileLocation: param.fileLocation
	}

	self.update = function(){
		self.updateSpeed();
		/*
		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);

		}*/
		self.x += self.speedX;
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
		var delay = 5;

		if (self.right) {
			self.speedX = self.speedMax;
			self.animation.change(sprite_sheet.frame_sets[1], delay);
			self.state = "run";
		}
		else if (self.left && ((self.x - self.speedMax) > 0)) {
			self.speedX = -self.speedMax;
			self.animation.change(sprite_sheet.frame_sets[2], delay);
			self.state = "run";
		}
		else {
			self.speedX = 0;
			self.animation.change(sprite_sheet.frame_sets[0], delay);
			self.state = "stand";
		}

		if(self.up && self.state != "jump") {
			self.up = false;
			// TODO: Get a better jump speed;
			self.speedY = -self.speedMax*6;
			self.state = "jump";
		}
		else{
			self.speedY = 0;
			self.state = "stand";
		}
	}

	// Draw the player based on the current frame;
	self.draw = function() {
		ctx.drawImage(self.image, self.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_HEIGHT, Math.floor(self.x), Math.floor(self.y), SPRITE_SIZE, SPRITE_HEIGHT);
		display.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
	}

	return self;
}

Level = function(data){
	var self = {
		levelName: data.levelName,
		fileLocation: data.fileLocation,
		levelData: data.levelData,
		tileFile: data.tileFile 
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

socket.on('levelPack', function(data){
	level = new Level(data);
	Img.tile = new Image();
	Img.tile.src = level.tileFile;
	tiles = data.levelData;
	
	for (var i = 0; i < tiles.length; i++) {
		obstacles.push(new tile(tiles[i]['x']));
	}
});

startNewGame = function(){
	$(".star").hide();
	$('#game').show();

	socket.emit('storyMode', {});
	socket.on('initPack', function(data) {
		player = new Player(data);
		// Set player image;
		player.image.src = player.fileLocation;
		player.draw();

		addListener();
		paused = false;
		timeWhenGameStarted = Date.now();
		frameCount = 0;
		score = 0;
		// backgroundSound = new sound('client/sound/background.mp3');
		// backgroundSound.play();

		// TODO: This is for testing the movements
		// Replace with tiles from the actual file level;
		// Adding random tiles;
		
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
	player.animation.update();

	// TODO: Update all the other entities based
	// on the speed of the player
	// Update Tiles;
	obstacles.forEach(function(tile) {
		tile.update();
	});

	canvasDraw();
}

setInterval(update, 30);
