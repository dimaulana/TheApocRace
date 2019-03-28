/* Game.js starts and sets the game at the front end;

   Contributors: Hussein Parpia, Sahil Anand
*/

// Get canvas element
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var display = document.querySelector('#game').getContext("2d");

ctx.font= "30px arcade";

// Variable declaration and initialising;
var player, sprite_sheet, backgroundSound, level, viewport;
var entityManager = new EntityManager();
var bulletList = []
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

// DEPRACATED:
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
		timer: param.timer,
		angle: param.angle,
		scale: 1
	}

	self.img.src = self.fileLocation;

	if(player.scaleX < 0){
		self.speedX = -10;
		self.scale = -1;
	}

	self.update = function(){
		if(self.timer++ > 40)
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

function updatePlayer() {
	// Update speed;
	if (player.properties.right) {
		player.properties.speed.x = player.properties.speedMax;
		player.changeAnimation(2);
		player.properties.scale.x = 1.0;
	}
	else if (player.properties.left) {
		player.properties.speed.x = -player.properties.speedMax;
		player.changeAnimation(3);
		player.properties.scale.x = -1.0;
	}
	else {
		player.properties.speed.x = 0;
		player.changeAnimation((player.properties.scale.x == -1.0) ? 1 : 0);
	}

	if (player.properties.jump && player.properties.state != "jumping") {
		player.properties.speed.y = -player.properties.speedMax * 12;
		player.properties.state = "jumping";
	}
	else {
		player.properties.speed.y = 0;
	}

	// Update position;
	player.properties.prevPos.x = player.properties.pos.x;
	player.properties.prevPos.y = player.properties.pos.y;

	player.properties.pos.x += player.properties.speed.x;
	player.properties.pos.y += player.properties.speed.y;

	player.properties.pos.y -= player.properties.gravity;

	if(player.properties.shoot){
		//self.shootBullet(self.mouseAngle);
		// TODO: Spawn bullet;
	}

	// Update player animation;
	player.animation.update();
}

function updateEntities() {
	// Update Player first:
	updatePlayer();
}

// Function to handle collisions;
function getOverlap(a, b) {
	var delta = { x: Math.abs((a.properties.pos.x + a.properties.width/2) - (b.properties.pos.x + b.properties.width/2)),
				  y: Math.abs((a.properties.pos.y + a.properties.height/2) - (b.properties.pos.y + b.properties.height/2))
				}

	var halfSizeA = { x: a.properties.width / 2, y: a.properties.height / 2 };
	var halfSizeB = { x: b.properties.width / 2, y: b.properties.height / 2 };

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {x: overlapX, y: overlapY};
}

function getPrevOverlap(a, b) {

	var delta = { x: Math.abs((a.properties.prevPos.x + a.properties.width/2) - (b.properties.prevPos.x + b.properties.width/2)),
				  y: Math.abs((a.properties.prevPos.y + a.properties.height/2) - (b.properties.prevPos.y + b.properties.height/2))
				}

	var halfSizeA = { x: a.properties.width / 2, y: a.properties.height / 2 };
	var halfSizeB = { x: b.properties.width / 2, y: b.properties.height / 2 };

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {x: overlapX, y: overlapY};
}

var testCollisions = function () {

	// Collison of player with tiles;
 	entityManager.getEntities().forEach(function(entity) {

 		if (entity.tag != "Tile1" && entity.tag != "Tile2" && entity.tag != "Tile2") return;

  		var currentOverlap = getOverlap(player, entity);
  		var prevOverlap = getPrevOverlap(player, entity);

  		if (currentOverlap.x > 0 && currentOverlap.y > 0) {
  			if (prevOverlap.x > 0) {
  				// Collision from top or bottom;
  				if ((player.properties.pos.y - player.properties.prevPos.y) > 0) {
  					// Collision came from top of tile;
  					player.properties.speed.y = 0;
  					player.properties.pos.y -= currentOverlap.y;
  					player.properties.state = "standing"; // Jumping ends as he is now on the tile;
  				}
  				else if (((player.properties.pos.y - player.properties.prevPos.y) < 0)) {
  					// Collision came from bottom of tile;
  					player.properties.speed.y = 0;
  					player.properties.pos.y += currentOverlap.y;
  				}
  			}

  			if (prevOverlap.y > 0) {
  				// Collision from right or left;
  				if ((player.properties.pos.x - player.properties.prevPos.x) > 0) {
  					// Collision from right;
  					player.properties.speed.x = 0;
  					player.properties.pos.x += currentOverlap.x;
  				}
  				else if ((player.properties.pos.x - player.properties.prevPos.x) < 0) {
  					// Collision from left;
  					player.properties.speed.x = 0;
  					player.properties.pos.x -= currentOverlap.x;
  				}
  			}
  		}
    });

    // Collision of player with the canvas
    // (Taking the x and y of canvas to be 0, 0);
    if (player.properties.pos.x < 0) player.properties.pos.x = 0;

    if (player.properties.pos.y < 0) player.properties.pos.y = 0;
}


// Redraw canvas according to the updated positons;
function canvasDraw() {
	// Clear the canvas for refresh;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Updating the score;
	ctx.fillStyle= "white";
	ctx.fillText(score.text + score.int, score.x, score.y);
	
	
	ctx.fillText('Player: ' , 20,40);
	ctx.fillText('HP: ' ,20,70);
	
	player.draw();

	// Draw player;
	/** Not using for now;
	ctx.drawImage(player.image, player.animation.frame * player.properties.width, 0, player.properties.width, player.properties.height,
					Math.floor(player.properties.pos.x - viewport.x), Math.floor(player.properties.pos.y - viewport.y), player.properties.width, player.properties.height);
	if (spriteBox)
		ctx.strokeRect(Math.floor(player.properties.pos.x - viewport.x), Math.floor(player.properties.pos.y - viewport.y), player.properties.width, player.properties.height);

	display.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
	**/

	// Draw tiles and other entities;
	entityManager.getEntities().forEach(function(e) {
		switch(e.tag) {
			case "Tile1":
			case "Tile2":
			case "Tile3":
				ctx.drawImage(e.image, e.properties.pos.x - viewport.x, e.properties.pos.y - viewport.y);

				if (spriteBox)
					ctx.strokeRect(e.properties.pos.x - viewport.x, e.properties.pos.y - viewport.y,
									e.properties.width, e.properties.height)
			break;

			case "Player":
			case "Enemy":
				ctx.drawImage(e.image, e.animation.frame * e.properties.width, 0, e.properties.width, e.properties.height,
					Math.floor(e.properties.pos.x - viewport.x), Math.floor(e.properties.pos.y - viewport.y), e.properties.width, e.properties.height);
				if (spriteBox)
					ctx.strokeRect(Math.floor(e.properties.pos.x - viewport.x), Math.floor(e.properties.pos.y - viewport.y), e.properties.width, e.properties.height);

				display.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
			break;
		}
	});


}

function keyDownHandler(e) {
	switch (e.keyCode) {
		case 27: // ESC key for getting back to the menu;
			// TODO:
			// Quit game;
			// Save progress;
		break;

		case 68: // d key
			player.properties.right = true;
		break;

		case 65: // a key
			player.properties.left = true;
		break;

		case 87: // w key
			player.properties.jump = true;
		break;

		case 83: // s key
			player.properties.shoot = true;
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
			player.properties.right = false;
		break;

		case 65: // a key
			player.properties.left = false;
		break;

		case 87: // w key
			player.properties.jump = false;
		break;

		case 83: // s key
			player.properties.shoot = false;
		break;
	}
}

function addListener() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
}

startNewGame = function(){
	socket.emit('storyMode', {});

	socket.on('levelPack', function(data) {
		level = new Level(data);
		level.loadLevel();

		player = entityManager.getEntityByTag("Player");
		if (backgroundSound) backgroundSound.play();
		addListener();
		paused = false;
		gameStarted = true;
		timeWhenGameStarted = Date.now();
		frameCount = 0;
		// backgroundSound = new sound('client/sound/background.mp3');
		//backgroundSound.play();
	});

	$(".star").hide();
	$('#game').show();
	$('.paused').hide();

}

var leaderButton = false;

//A function that shows the top scorers
var leaderBoard = function (){
	//TODO: loop on all scores and find the highest scrore
	// Then rank accoring to scores
	var rank=0
	var maxRank=10;// number of players

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
	if(!gameStarted){
		return;
	}

	if (paused) {
		isPaused();
		return;
	}

	if(leaderButton){
		leaderBoard();
		return;
	}

	updateEntities();

	testCollisions();

	viewport.update("Player", player); // Update the viewport before drawing on canvas;

	canvasDraw();
}

setInterval(update, 1000/30);
