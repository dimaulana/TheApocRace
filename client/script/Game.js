/* Game.js starts and sets the game at the front end;

   Contributors: Hussein Parpia, Sahil Anand
*/


// Add Animation class
var script = document.createElement('script');
script.src = 'client/script/Animation.js';
document.head.appendChild(script);


var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var display = document.querySelector('#game').getContext("2d");

ctx.font= "40px arcade";

// Dimensions of the player images;
const SPRITE_SIZE = 40;

var player, sprite_sheet, backgroundSound, level;
var obstacles = [];
var paused = true; // When the game has not started, paused is true in order to stop the updates;

var topScore = 0; // Later to come from the database taken compared to other players

// To keep track of the player sprite;
sprite_sheet = {
	frame_sets:[[0], [1], [2, 3, 4], [5, 6, 7]] // standing, running right, running left;
};

// Tile object takes the tile image source and location {x: , y: } of the tile;
function Tile(imageSource, location) {
	this.tileImage = new Image();
	this.tileImage.src = imageSource;

	this.width = 30;
	this.height = 41;

	this.x = location.x;
	this.y = location.y;

	this.prevX = 0;
	this.prevY = this.y;

	this.draw = function() {
		ctx.drawImage(this.tileImage,this.x, this.y);
	}

	this.update = function() {
		this.prevX = this.x;
		if (player.x === canvas.width/2)
			this.x -= player.speedX;
	}
}

Player = function(param) {
	var self = {
		x: param.pos.x,
		y: param.pos.y,
		prevX: param.prevPos.x,
		prevY: param.prevPos.y,
		speedX: param.speed.x,
		speedY: param.speed.y,
		speedMax: param.speedMax,
		scaleX: param.scale.x,
		scaleY: param.scale.y,
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
		jump: false,
		state: "stand",
		animation: new Animation(),
		image: new Image(),
		fileLocation: param.fileLocation
	}

	self.update = function() {
		self.prevX = self.x;
		self.prevY = self.y;

		self.updateSpeed();

		self.x += self.speedX;
		self.y += self.speedY;
		// TODO: Collision should do this with the tiles;
		self.y -= self.gravity;

		// if (self.x === canvas.width/2) {
		// 	return;
		// }

		if (self.x > canvas.width/2) {
			self.x = canvas.width/2;
		}
	}


	self.updateSpeed = function() {
		var delay = 5;

		if (self.right) {
			self.speedX = self.speedMax;
			self.animation.change(sprite_sheet.frame_sets[2], delay);
			self.state = "run";
			self.scaleX = 1.0;
		}
		else if (self.left) {
			self.speedX = -self.speedMax;
			self.animation.change(sprite_sheet.frame_sets[3], delay);
			self.state = "run";
			self.scaleX = -1.0;
		}
		else {

			self.speedX = 0;
			// If scale is -1 choose the opposite facing sprite;
			self.animation.change(sprite_sheet.frame_sets[(self.scaleX == -1.0) ? 1 : 0], delay);
			self.state = "stand";
		}

		if(self.jump && self.state != "jump") {
			// self.up = false;
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
		ctx.drawImage(self.image, self.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE*2,
						Math.floor(self.x), Math.floor(self.y), SPRITE_SIZE, SPRITE_SIZE*2);
		display.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
	}

	return self;
}

function getOverlap(a, b) {
	var delta = { x: Math.abs(a.x - b.x),
				  y: Math.abs(a.y - b.y)
				}

	var halfSizeA = { x: a.width / 2, y: a.height / 2 };
	var halfSizeB = { x: b.width / 2, y: b.height / 2 };

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {x: overlapX, y: overlapY};
}

function getPrevOverlap(a, b) {
	var delta = { x: Math.abs(a.prevX - b.prevX),
				  y: Math.abs(a.prevY - b.prevY)
				}

	var halfSizeA = { x: a.width / 2, y: a.height / 2 };
	var halfSizeB = { x: b.width / 2, y: b.height / 2 };

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {x: overlapX, y: overlapY};
}

var testCollisions = function () {

 	obstacles.forEach(function(entity) {

  		var currentOverlap = getOverlap(player, entity);
  		var prevOverlap = getPrevOverlap(player, entity);

  		if (currentOverlap.x > 0 && currentOverlap.y > 0) {

  			if (prevOverlap.x > 0) {
  				// Collision from top or bottom;
  				if ((player.y - player.prevY) > 0) {
  					// Collision came from top;
  					player.state = "stand";
  					player.speedY = 0;
  					player.y -= currentOverlap.y;
  				}
  				else if (((player.y - player.prevY) > 0)) {
  					// Collision came from bottom of tile;
  					player.speedY = 0;
  					player.y += currentOverlap.y;
  				}
  			}

  			if (prevOverlap.y > 0) {
  				// Collision from right or left;
  				if ((player.x - player.prevX) > 0) {
  					// Collision from right;
  					player.speedX = 0;
  					player.x += currentOverlap.x;
  				}
  				else if ((player.x - player.prevX) < 0) {
  					// Collision from left;
  					player.speedX = 0;
  					player.x -= currentOverlap.x;
  				}
  			}
  		}
    });
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
	// Updating the score;
	ctx.fillText('SCORE: ' + score, 200, 50);
	player.draw();
	obstacles.forEach(function(tile) {
		tile.draw();
	});
}

function keyDownHandler(e) {
	switch (e.keyCode) {
		case 68: // d key
			player.right = true;
		break;

		case 65: // a key
			player.left = true;
		break;

		case 87: // w key
			player.jump = true;
		break;

		case 83: // s key
			// TODO: Use this for attack?
			player.down = true;
		break;

		case 80: // p key
			paused = !paused;
		break;

	}
}

function keyUpHandler(e) {
	switch (e.keyCode) {
		case 68: // d key
			player.right = false;
		break;

		case 65: // a key
			player.left = false;
		break;

		case 87: // w key
			player.jump = false;
		break;

		case 83: // s key
			// TODO: Use this for attack?
			player.down = false;
		break;
	}
}

function addListener() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
}

startNewGame = function(){

	socket.on('levelPack', function(data){
		level = new Level(data);
		tiles = data.levelData;

		for (var i = 0; i < tiles.length; i++) {
			obstacles.push(new Tile(data.tileFile, { x: tiles[i]['x'], y: tiles[i]['y'] } ));
		}
	});

	$(".star").hide();
	$('#game').show();
	$('.paused').hide();

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
var leaderButton = false;
//A function that shows the top scorers
var leaderBoard = function (){
	//TODO: loop on all scores and find the highest scrore
	// Then rank accoring to scores
	var rank=0
	var maxRank=10;// number of player

	ctx.font= "50px arcade";
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillText('LEADERBOARD:' ,480,150);
	ctx.fillText('Rank    Player    Score    Level' ,130,240);
	ctx.fillStyle = "rgba(0,0,0,0.01)";
	ctx.strokeStyle = "blue";
	ctx.rect(70, 50, 1150, 650);
	ctx.fill();
	ctx.stroke();

	if(score > topScore){
		//TODO: Get player name,score,level and rank them

	}
}

//Function that opens pause canvas
var isPaused = function(){
	// Move draw to the div paused  using ralative
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.fillText('GAME PAUSED' ,500, 150);
	//Add buttons

	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(0,0,0,0.01)";
	ctx.rect(100, 50, 1080, 600);
	ctx.stroke();
	ctx.fill();

}

function update() {
	if (paused) {
		//generatePaused();
		isPaused();
		return;
	}

	if(leaderButton){
	  leaderBoard();
		return;
	}

	player.update();

	// TODO: Update all the other entities based
	// on the speed of the player
	// Update Tiles;
	obstacles.forEach(function(tile) {
		tile.update();
	});

	testCollisions();
	player.animation.update();

	canvasDraw();
}

setInterval(update, 1000/30);
