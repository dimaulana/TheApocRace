/* Game.js starts and sets the game at the front end;

   Contributors: Hussein Parpia, Sahil Anand,Victor Mutandwa
*/

// Get canvas element
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var display = document.querySelector('#game').getContext("2d");

ctx.font = "30px arcade";

// Variables declaration and initialising;
var player, backgroundSound, level;
var entityManager = new EntityManager();
var paused = false;
var gameStarted = false;
var spriteBox = false;

var score = {
	x: canvas.width - 200,
	y: 40,
	text: "SCORE: ",
	int: 0,
	topScore: 0 // Later to come from the database taken compared to other players
}

var username = {
	text: "Player: ",
	x: 20,
	y: 40,
	name: "",
}

var viewport = new Viewport(0, 0, 1280, 720); // The viewport of the game;


function spawnBullet(entity) {
	// Check weaponClock;
	if (entity.properties.weaponClock < entity.properties.weaponInterval) return;
	entity.properties.weaponClock = 0; // Restart weaponClock;

	var bulletsToSpawn = 0;
	if (entity.properties.weaponName == "normal") {
		bulletsToSpawn = 1;
	}

	var param = {};
	param.tag = "Bullet";
	param.pos = {
		x: entity.properties.pos.x + 18,
		y: entity.properties.pos.y + 20
	}
	param.clock = 0;
	param.width = 10;
	param.height = 10;
	param.prevPos = param.pos;
	param.lifespan = 20;
	param.speed = {
		x: 30,
		y: 0
	};
	param.scale = {
		x: 1.0,
		y: 1.0
	};
	if (entity.properties.scale.x == -1.0) param.scale.x = -1.0;
	param.alive = true;

	param.fileLocation = entity.properties.weaponFile;
	for (var i = 0; i < bulletsToSpawn; i++) {
		entityManager.addEntity(param);
	}
}

function updatePlayer() {
	// Update speed;
	if (player.properties.right) {
		player.properties.speed.x = player.properties.speedMax;
		player.changeAnimation(2);
		player.properties.scale.x = 1.0;
	} else if (player.properties.left) {
		player.properties.speed.x = -player.properties.speedMax;
		player.changeAnimation(3);
		player.properties.scale.x = -1.0;
	} else {
		player.properties.speed.x = 0;
		player.changeAnimation((player.properties.scale.x == -1.0) ? 1 : 0);
	}

	if (player.properties.jump && player.properties.state != "jumping") {
		player.properties.speed.y = -player.properties.speedMax * 12;
		player.properties.state = "jumping";
	} else {
		player.properties.speed.y = 0;
	}

	// Update position;
	player.properties.prevPos.x = player.properties.pos.x;
	player.properties.prevPos.y = player.properties.pos.y;

	player.properties.pos.x += player.properties.speed.x;
	player.properties.pos.y += player.properties.speed.y;

	player.properties.pos.y -= player.properties.gravity;

	player.properties.weaponClock++; // Update weaponClock;

	// Update player animation;
	player.animation.update();
}

function updateEntities() {
	// First update entityManager;
	entityManager.update();

	// Update Player;
	updatePlayer();

	entityManager.getEntities().forEach(function (entity) {
		if (entity.tag == "Bullet") {
			entity.properties.clock++;
			if (entity.properties.clock > entity.properties.lifespan) {
				entity.properties.alive = false;
			} else {
				entity.properties.prevPos = entity.properties.pos;
				entity.properties.pos.x += (entity.properties.scale.x == -1.0) ? -entity.properties.speed.x : entity.properties.speed.x;
				// TODO: Invert the image?
			}
		}

		// TODO: Implement enemy movement here;
	});
}

// Function to handle collisions;
function getOverlap(a, b) {
	var delta = {
		x: Math.abs((a.properties.pos.x + a.properties.width / 2) - (b.properties.pos.x + b.properties.width / 2)),
		y: Math.abs((a.properties.pos.y + a.properties.height / 2) - (b.properties.pos.y + b.properties.height / 2))
	}

	var halfSizeA = {
		x: a.properties.width / 2,
		y: a.properties.height / 2
	};
	var halfSizeB = {
		x: b.properties.width / 2,
		y: b.properties.height / 2
	};

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {
		x: overlapX,
		y: overlapY
	};
}

function getPrevOverlap(a, b) {

	var delta = {
		x: Math.abs((a.properties.prevPos.x + a.properties.width / 2) - (b.properties.prevPos.x + b.properties.width / 2)),
		y: Math.abs((a.properties.prevPos.y + a.properties.height / 2) - (b.properties.prevPos.y + b.properties.height / 2))
	}

	var halfSizeA = {
		x: a.properties.width / 2,
		y: a.properties.height / 2
	};
	var halfSizeB = {
		x: b.properties.width / 2,
		y: b.properties.height / 2
	};

	var overlapX = halfSizeA.x + halfSizeB.x - delta.x;
	var overlapY = halfSizeA.y + halfSizeB.y - delta.y;

	return {
		x: overlapX,
		y: overlapY
	};
}

var testCollisions = function () {

	// Collison of player with tiles;
	entityManager.getEntities().forEach(function (entity) {

		// TODO:
		// Collision of bullets with player, enemies and tiles;
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
				} else if (((player.properties.pos.y - player.properties.prevPos.y) < 0)) {
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
				} else if ((player.properties.pos.x - player.properties.prevPos.x) < 0) {
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

	// Change background animation;
	var background = entityManager.getEntityByTag("Background");
	if (background) { // Check if background exists;
		// if (player.properties.pos.x >= 200 && player.properties.pos.x < 400) {
		// 	background.changeAnimation(1);
		// }
		// else if (player.properties.pos.x >= 400) {
		// 	background.changeAnimation(2);
		// }
		// else {
		// 	background.changeAnimation(0);
		// }

		//background.animation.update();
		if (player.properties.speed.x > 0 && player.properties.pos.x > canvas.width / 2) background.frame++
		else if (player.properties.speed.x < 0) {
			background.frame--
			if (background.frame < 0) background.frame = 0;
		}
		ctx.drawImage(background.image, background.frame, 0, 1280, 720, 0, 0, 1280, 720);
		// ctx.drawImage(background.image, viewport.x, 0, 1280, 720, 0, 0, 1280, 720);
	} // Else just draw default background;

	// Updating the score;
	ctx.fillStyle = "white";
	ctx.fillText(score.text + score.int, score.x, score.y);

	ctx.fillText(username.text + username.name, username.x, username.y);
	ctx.fillText('HP: ' + 0, 20, 70);


	// Draw player;
	/** Not using for now;
	ctx.drawImage(player.image, player.animation.frame * player.properties.width, 0, player.properties.width, player.properties.height,
					Math.floor(player.properties.pos.x - viewport.x), Math.floor(player.properties.pos.y - viewport.y), player.properties.width, player.properties.height);
	if (spriteBox)
		ctx.strokeRect(Math.floor(player.properties.pos.x - viewport.x), Math.floor(player.properties.pos.y - viewport.y), player.properties.width, player.properties.height);

	display.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
	**/

	// Draw tiles and other entities;
	entityManager.getEntities().forEach(function (e) {
		switch (e.tag) {
			case "Tile1":
			case "Tile2":
			case "Tile3":
			case "Bullet":
				ctx.drawImage(e.image, e.properties.pos.x - viewport.x, e.properties.pos.y - viewport.y,
					e.properties.width, e.properties.height);

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
			spawnBullet(player);
			break;

		case 80: // p key
			paused = !paused;
			break;

		case 66: // i key for spriteBox which can be used for collisions
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

startNewGame = function () {
	socket.emit('storyMode', {});

	socket.on('levelPack', function (data) {
		username.name = data.username;
		level = new Level(data);
		level.loadLevel();

		entityManager.update(); // Call update for intialization;

		player = entityManager.getEntityByTag("Player");

		if (backgroundSound) backgroundSound.play();

		addListener();
		gameStarted = true;
		timeWhenGameStarted = Date.now();
		frameCount = 0;
		// backgroundSound = new sound('client/sound/background.mp3');
		//backgroundSound.play();
	});

	$(".star").addClass("off");
	$('#game').show();
	$('.paused').hide();

}

var leaderButton = false;

//A function that shows the top scorers
var leaderBoard = function () {
	//TODO: loop on all scores and find the highest scrore
	// Then rank accoring to scores
	var rank = 0
	var maxRank = 10; // number of player

	ctx.font = "50px arcade";
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillText('LEADERBOARD:', 480, 150);
	ctx.fillText('Rank    Player    Score    Level', 130, 240);
	ctx.fillStyle = "rgba(0,0,0,0.01)";
	ctx.strokeStyle = "blue";
	ctx.rect(70, 50, 1150, 650);
	ctx.fill();
	ctx.stroke();

	if (score.int > score.topScore) {
		//TODO: Get player name,score,level and rank them
	}
}

//Function that opens pause canvas
var isPaused = function () {
	// Move draw to the div paused  using ralative
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.fillText('GAME PAUSED', 500, 150);
	//Add buttons

	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(0,0,0,0.01)";
	ctx.rect(100, 50, 1080, 600);
	ctx.stroke();
	ctx.fill();

}

function update() {
	if (!gameStarted) return; // Stop updates if game is not being played;

	if (paused) {
		isPaused();
		return;
	}

	if (leaderButton) {
		leaderBoard();
		return;
	}

	updateEntities();

	testCollisions();

	viewport.update("Player", player); // Update the viewport relative to player before drawing on canvas;

	canvasDraw();
}

setInterval(update, 1000 / 30);