/* Game.js starts and sets the game at the front end;

   Contributors: Hussein Parpia, Sahil Anand
*/


// Add Animation class
var script = document.createElement('script');
script.src = 'client/script/Animation.js';
document.head.appendChild(script);


var canvas = document.getElementById("game");
var ctx = document.getElementById("game").getContext("2d");
var display = document.querySelector('#game').getContext("2d");


var player, sprite_sheet, backgroundSound, level;
var obstacles = [];
var paused = true; // When the game has not started, paused is true in order to stop the updates;

var topScore=0; // Later to come from the database taken compared to other players

ctx.font= "40px arcade";

// Dimensions of the player images;
const SPRITE_SIZE = 40;

// To keep track of the player sprite;
sprite_sheet = {
	frame_sets:[[0], [1], [2, 3, 4], [5, 6, 7]] // standing, running right, running left;
};

// TODO: To get from asset manager;
var Img = {};

testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x + rect2.width
	&& rect2.x <= rect1.x +rect1.width
	&& rect1.y <= rect2.y + rect2.height
	&& rect2.y <= rect1.y + rect1.height;
}

function Tile(src, locationX) {
	this.width = 30;
	this.height = 41;
	this.tileImage = new Image();
	this.tileImage.src = imageSource;
	this.x = locationX;
	this.y = canvas.height - this.height;

	this.draw = function() {
		ctx.drawImage(this.tileImage,this.x, this.y);
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
		prevX: param.prevPos.x,
		prevY: param.prevPos.y,
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

		if (self.x === canvas.width/2) {
			return;
		}

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
		}
		else if (self.left && ((self.x - self.speedMax) > 0)) {
			self.speedX = -self.speedMax;
			self.animation.change(sprite_sheet.frame_sets[3], delay);
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

	self.testCollisions = function () {

		obstacles.forEach(function(entity) {

			var playerCX = self.x + self.width * 0.5;
			var entityCX = entity.x + entity.width * 0.5;

			var playerCY = self.y + self.height * 0.5;
			var entityCY = entity.y + entity.height * 0.5;

			var dx =  playerCX - entityCX; // x difference between centers
			var dy = playerCY - entityCY; // y difference between centers
			var aw = (self.width + entity.width) * 0.5;// average width
			var ah = (self.height + entity.height) * 0.5;// average height

			// If either distance is greater than the average dimension there is no collision. //
			if (Math.abs(dx) > aw || Math.abs(dy) > ah) return false;

        	// To determine which region of this rectangle the rect's center
        	// point is in, we have to account for the scale of the this rectangle.
        	// To do that, we divide dx and dy by it's width and height respectively. //
        	if (Math.abs(dx / entity.width) > Math.abs(dy / entity.height)) {
        		if (dx < 0) self.x = entity.x - self.width;// left
        		else self.x = entity.x + self.width; // right

        	} else {

	        	if (dy < 0) self.y = entity.y - self.height; // top
        		else self.y = entity.y + self.height; // bottom
        	}

        	return true;
		});
	}


	// Draw the player based on the current frame;
	self.draw = function() {
		ctx.drawImage(self.image, self.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE*2,
						Math.floor(self.x), Math.floor(self.y), SPRITE_SIZE, SPRITE_SIZE*2);
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

startNewGame = function(){

	socket.on('levelPack', function(data){
		level = new Level(data);
		tiles = data.levelData;
		
		for (var i = 0; i < tiles.length; i++) {
			obstacles.push(new Tile(data.tileFile, tiles[i]['x']));
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
 var leaderButton=false;
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
		// Testing leaderBoard
		else if(event.keyCode === 76) {//l
		leaderButton=!leaderButton;
			  
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

//A function that shows the top scorers
var leaderBoard=function (){
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
var isPaused=function(){

	var canvas = document.getElementById("game");
    var ctx = document.getElementById("game").getContext("2d");
    
	// Move draw to the div paused  using ralative
	ctx.beginPath();
	ctx.fillStyle= "red";
	ctx.fillText('GAME PAUSED' ,500,150);
	//Add buttons

	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(0,0,0,0.01)";
	ctx.rect(100, 50, 1080, 600);
	ctx.stroke();
	ctx.fill();
	
}



function update() {
	if (paused){
		//generatePaused();
		isPaused();
		return;
	} 
	
	if(leaderButton){
	  leaderBoard();
		return;
	} 
	ctx.fillText('SCORE: ' + score,200,50);
	player.update();
	player.testCollisions();
	player.animation.update();
	// TODO: Update all the other entities based
	// on the speed of the player
	// Update Tiles;
	obstacles.forEach(function(tile) {
		tile.update();
	});

	canvasDraw();
}

setInterval(update, 1000/30);
