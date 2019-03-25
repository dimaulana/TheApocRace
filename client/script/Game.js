
// Game.js starts and sets the game at the front end;
// Contributors: Hussein Parpia, Sahil Anand,Victor Mutandwa
/* Game.js starts and sets the game at the front end;

   Contributors: Hussein Parpia, Sahil Anand
*/

// Load Animation class
var script = document.createElement('script');
script.src = 'client/script/Animation.js';
document.head.appendChild(script);

var bulletList = []
// Get canvas element
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var display = document.querySelector('#game').getContext("2d");

ctx.font= "30px arcade";

// Dimensions of the player images;
const SPRITE_SIZE = 40;

var player, sprite_sheet, backgroundSound, level, viewport;
var obstacles = [];
var stars = [];
var paused = true; // When the game has not started, paused is true in order to stop the updates;
var spriteBox = false;

var score = {
	x: canvas.width - 200, y: 40,
	text: "SCORE: ", int: 0,
	topScore: 0 // Later to come from the database taken compared to other players
}

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

viewport = new Viewport(0, 0, 1280, 720); // The viewport of the game;

// TODO: Add it to player object, To keep track of the player sprite;
sprite_sheet = {
	frame_sets:[[0], [1], [2, 3, 4], [5, 6, 7]] // standing, running right, running left;
};

Bullet = function(param){
	var self = {
		x: param.x,
		y: param.y,
		id: Math.floor(Math.random() * (100000 - 0)) + 0,
		speedX: 10,
		speedY: 10,
		lifespan: param.lifespan,
		toRemove: false,
		img: new Image(),
		fileLocation: param.img,
		tag: param.tag,
		timer: param.timer
	}

	self.img.src = self.fileLocation;

	self.update = function(){
		if(self.timer++ > 20)
			self.toRemove = true;

		for (var i in bulletList)
		{
				var bullet = bulletList[i];
				if(bullet.toRemove && bullet.tag === "bullet")
				{
						delete bulletList[i];
				}
		}	
		self.x += self.speedX;
	}
	self.getInitPack = function(){
		return {
			id:1,
			x:120,
			y:32,
			map:self.map,
		};
	}
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,		
		};
	}
	self.draw = function() {
			ctx.drawImage(self.img ,self.x, self.y, 10, 10);
	}

	return self;
}

Player = function(param) {
	var self = {
		x: param.pos.x,
		y: param.pos.y,
		prev_x: param.prevPos.x,
		prev_y: param.prevPos.y,
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
		pressingAttack:false,
		state: "stand",
		animation: new Animation(),
		image: new Image(),
		fileLocation: param.fileLocation
	}

	self.update = function() {
		self.updateSpeed();

		self.prev_x = self.x;
		self.prev_y = self.y;

		self.x += self.speedX;
		self.y += self.speedY;

		self.y -= self.gravity;

		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		}
	}


	self.updateSpeed = function() {
		var delay = 5;

		if (self.right) {
			self.speedX = self.speedMax;
			self.animation.change(sprite_sheet.frame_sets[2], delay);
			self.state = "run";
			self.scaleX = 1.0;
			score.int++;
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
		ctx.drawImage(self.image, self.animation.frame * SPRITE_SIZE, 0, this.width, this.height,
						Math.floor(self.x - viewport.x), Math.floor(self.y - viewport.y), SPRITE_SIZE, SPRITE_SIZE*2);
		if (spriteBox)
			ctx.strokeRect(Math.floor(self.x - viewport.x), Math.floor(self.y - viewport.y), SPRITE_SIZE, SPRITE_SIZE*2);

		display.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
	}

	self.shootBullet = function(angle){
		var bullet = new Bullet({
			tag: "bullet",
			angle: 0,
			x: self.x + 25 - viewport.x,
			y: self.y + 18 - viewport.y,
			img: 'client/images/bullet.png',
			timer: 0
		});

		var sound = new Sound('client/sound/gun_shot.wav');
    sound.play();
		bulletList.push(bullet);
	}

	return self;
}

// Function to handle collisions;
function getOverlap(a, b) {
	var delta = { x: Math.abs((a.x + a.width/2) - (b.x + b.width/2)),
				  y: Math.abs((a.y + a.height/2) - (b.y + b.height/2))
				}

	var halfSizeA = { x: a.width / 2, y: a.height / 2 };
	var halfSizeB = { x: b.width / 2, y: b.height / 2 };

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {x: overlapX, y: overlapY};
}

function getPrevOverlap(a, b) {

	var delta = { x: Math.abs((a.prev_x + a.width/2) - (b.prev_x + b.width/2)),
				  y: Math.abs((a.prev_y + a.height/2) - (b.prev_y + b.height/2))
				}

	var halfSizeA = { x: a.width / 2, y: a.height / 2 };
	var halfSizeB = { x: b.width / 2, y: b.height / 2 };

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {x: overlapX, y: overlapY};
}

var testCollisions = function () {

	// Collison of player with tiles;
 	obstacles.forEach(function(entity) {

  		var currentOverlap = getOverlap(player, entity);
  		var prevOverlap = getPrevOverlap(player, entity);

  		if (currentOverlap.x > 0 && currentOverlap.y > 0) {
  			if (prevOverlap.x > 0) {
  				// Collision from top or bottom;
  				if ((player.y - player.prev_y) > 0) {
  					// Collision came from top;
  					player.state = "stand";
  					player.speedY = 0;
  					player.y -= currentOverlap.y;
  				}
  				else if (((player.y - player.prev_y) < 0)) {
  					// Collision came from bottom of tile;
  					player.speedY = 0;
  					player.y += currentOverlap.y;
  				}
  			}

  			if (prevOverlap.y > 0) {
  				// Collision from right or left;
  				if ((player.x - player.prev_x) > 0) {
  					// Collision from right;
  					player.speedX = 0;
  					player.x += currentOverlap.x;
  				}
  				else if ((player.x - player.prev_x) < 0) {
  					// Collision from left;
  					player.speedX = 0;
  					player.x -= currentOverlap.x;
  				}
  			}
  		}
    });

    // Collision of player with the canvas
    // (Taking the x and y of canvas to be 0, 0);
    if (player.x < 0) player.x = 0;

    if (player.y < 0) player.y = 0;
}


// Redraw canvas according to the updated positons;
function canvasDraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Updating the score;
	ctx.fillStyle= "white";
	//ctx.fillText('SCORE: ' + score,scoreX,ScoreY);
	ctx.fillText(score.text + score.int, score.x, score.y);
	player.draw();

	bulletList.forEach(function(bullet){
		bullet.draw();
	});

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
			player.pressingAttack = true;
		break;

		case 80: // p key
			paused = !paused;	
		break;

		case 73: // i key for spriteBox which can be used for collisions
			spriteBox = !spriteBox;
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
			player.pressingAttack = false;
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
		level.loadLevel(data);

	});

	$(".star").hide();
	$('#game').show();
	$('.paused').hide();

	socket.emit('storyMode', {});
	socket.on('initPack', function(data) {
		player = new Player(data);
		player.image.src = player.fileLocation;
		player.draw();

		addListener();
		paused = false;
		timeWhenGameStarted = Date.now();
		frameCount = 0;
		score = 0;
		// backgroundSound = new sound('client/sound/background.mp3');
		//backgroundSound.play();

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

	if(score.int > score.topScore){
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
	player.animation.update();
	// TODO: Update all the other entities based
	// on the speed of the player

	// Update Tiles;
	testCollisions();

	obstacles.forEach(function(tile) {
		tile.update();
	});

	bulletList.forEach(function(bullet){
		bullet.update();
	});

	viewport.update("Player", player); // Update the viewport before drawing on canvas;

	canvasDraw();
}

	

	//resolveCollision();

	


setInterval(update, 1000/30);
