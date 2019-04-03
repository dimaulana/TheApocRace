/* Game.js starts and sets the game at the front end;

   Contributors: Hussein Parpia, Sahil Anand,Victor Mutandwa
*/

// Get canvas element
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var display = document.querySelector('#game').getContext("2d");

ctx.font = "30px arcade";

// TODO: Make Game.js a class of its own;

// Variables declaration and initialising;
var player, backgroundSound, level, currentLevel, frameCount;
var entityManager = new EntityManager();
var paused = false;
var gameStarted = false;
var spriteBox = false;
var transition = false;
var filesInDirectory = [];

var score = {
	x: canvas.width - 200,
	y: 40,
	text: "SCORE: ",
	int: 0,
	topScore: 0 // Later to come from the database taken compared to other players
}

var coinCount = 0;
var coinImage = new Image();
coinImage.src = "/client/images/singlecoin.png";


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
	param.origin = entity.tag; // Save the shooter;
	param.pos = {
		x: entity.properties.pos.x + 18,
		y: entity.properties.pos.y + 16
	}
	param.prevPos = param.pos;

	param.clock = 0;
	param.width = 20;
	param.height = 20;
	param.lifespan = 25;
	param.speed = {
		x: 30,
		y: 0
	};
	param.frame_sets = [[0], [1], [2, 3], [4,5]]; // Bullet frame set;
	param.scale = {
		x: (entity.properties.scale.x == -1.0) ? -1.0 : 1.0,
		y: 1.0
	};
	param.alive = true;
	param.fileLocation = entity.properties.weaponFile; // Image source;

	for (var i = 0; i < bulletsToSpawn; i++) {
		entityManager.addEntity(param);
	}
}

function updatePlayer() {
	if (player.properties.hp <= 0) {
		// TODO: Implement game over;
		gameStarted = false;
		return;
	}
	// Update speed;
	if (player.properties.right) {
		player.properties.speed.x = player.properties.speedMax;
		player.properties.scale.x = 1.0;
	} else if (player.properties.left) {
		player.properties.speed.x = -player.properties.speedMax;
		player.properties.scale.x = -1.0;
	} else {
		player.properties.speed.x = 0;
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
}

function updateEnemy(enemy) {
	// Check if enemy is out of health;
	if (enemy.properties.hp <= 0) {
		enemy.properties.alive = false;
		score.int += enemy.properties.score;
		return;
	}

	enemy.properties.prevPos.x = enemy.properties.pos.x;
	enemy.properties.prevPos.y = enemy.properties.pos.y;

	enemy.properties.pos.y -= enemy.properties.gravity;

	// TODO: Update enemy based on their AI;

	var index = 0;
	if (enemy.properties.followSpeed != null) { // Follow Player AI
		if (enemy.properties.pos.x + 100 < player.properties.pos.x) {
			//player.properties.pos.x - enemy.properties.pos.x > 100) {
			// Only chase if player he is ahead of the front of player;
			// Leaving a small distance between enemy and player;
			if (enemy.properties.delay >= 10) {
				enemy.properties.delay = 0;
				enemy.properties.pos.x += enemy.properties.followSpeed.x;
				// enemy.changeAnimation({state: "run", index: 2});
				index = 2;
				spawnBullet(enemy);
			}

		} // else don't chase;
		else {
			enemy.properties.pos.x += 0;
			index = 0;
		}
		enemy.properties.delay++;
	}
	else if (enemy.properties.patrolSpeed != null) {
		// TODO: Implement patrol ai;
	}
	else {
		// Basic AI of enemy shooting;
		var lineOfSight = 630; // Half canvas width - some offset 640 - 10;
		// Get direction for shooting;
		var distance = enemy.properties.pos.x - player.properties.pos.x;
		if (distance >= 0 && distance < lineOfSight) {
			enemy.properties.scale.x = -1.0;
			// enemy.changeAnimation({state: "run", index: 1});
			index = 1;
			spawnBullet(enemy);
		}
		else if (distance >= -lineOfSight && distance < 0)
		{
			enemy.properties.scale.x = 1.0;
			//enemy.changeAnimation({state: "run", index: 0});
			index = 0;
			spawnBullet(enemy);
		}
	}
	enemy.properties.weaponClock++; // Update weapon clock;

	enemy.changeAnimation({state: "run", index: index});
	enemy.animation.update();
}

function updateEntities() {
	// First update entityManager;
	entityManager.update();

	updatePlayer(); // Update Player;

	entityManager.getEntities().forEach(function (entity) {
		if (entity.tag == "Bullet") {
			entity.properties.clock++;
			if (entity.properties.clock > entity.properties.lifespan) {
				entity.properties.alive = false;
				entity.changeAnimation({ index: (entity.properties.scale.x == -1.0) ? 3 : 2});
			} else {
				entity.properties.prevPos = entity.properties.pos;
				entity.properties.pos.x += (entity.properties.scale.x == -1.0) ? -entity.properties.speed.x : entity.properties.speed.x;

				entity.changeAnimation({ index: (entity.properties.scale.x == -1.0) ? 1 : 0});
			}
			entity.animation.update();
		}
		else if (entity.tag == "Enemy")
			updateEnemy(entity);
	});
}

function updateAnimation() {

	// Update player animation;
	var param = {};

	if (player.properties.state == "jumping")
		param.state = "jump";
	else
		param.state = "run";

	// Check direction;
	if (player.properties.right)
		param.index = 2;
	else if (player.properties.left)
		param.index = 3;
	else
		param.index = (player.properties.scale.x == -1.0) ? 1 : 0;

	player.changeAnimation(param);

	player.animation.update();

	entityManager.getEntitiesByTag("Coin").forEach(function(c) {
		c.changeAnimation({index: 0});
		c.animation.update();
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

	entityManager.getEntities().forEach(function (entity) {

		// Collision of player with Coins;
		if (entity.tag == "Coin") {
			var currentOverlap = getOverlap(player, entity);
			if (currentOverlap.x > 0 && currentOverlap.y > 0) {
				coinCount += entity.properties.score; // Increment coin count;
				entity.properties.alive = false; 
			}

		}
		else if (entity.tag == "Tile1" || entity.tag == "Tile2" || entity.tag == "Tile3" || entity.tag == "Tile4") {
			// Collision between tiles and player;
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
			// Collision of enemies with tiles;
			var enemyList = entityManager.getEntitiesByTag("Enemy");
			for (var i = 0; i < enemyList.length; i++) {
				var enemy = enemyList[i];
				currentOverlap = getOverlap(enemy, entity);
				prevOverlap = getOverlap(enemy, entity);

				if (currentOverlap.x > 0 && currentOverlap.y > 0) {
					if (prevOverlap.x > 0) {
						// Collision from top or bottom;
						if ((enemy.properties.pos.y - enemy.properties.prevPos.y) > 0) {
							// Collision came from top of tile;
							enemy.properties.speed.y = 0;
							enemy.properties.pos.y -= currentOverlap.y;
							enemy.properties.state = "standing";
						}
						else if (((enemy.properties.pos.y - enemy.properties.prevPos.y) < 0)) {
							// Collision came from bottom of tile;
							enemy.properties.speed.y = 0;
							enemy.properties.pos.y += currentOverlap.y;
						}
					}

					if (prevOverlap.y > 0) {
							// Collision from right or left;
							if ((enemy.properties.pos.x - enemy.properties.prevPos.x) > 0) {
							// Collision from right;
							enemy.properties.speed.x = 0;
							enemy.properties.pos.x += currentOverlap.x;
						} else if ((enemy.properties.pos.x - enemy.properties.prevPos.x) < 0) {
							// Collision from left;
							enemy.properties.speed.x = 0;
							enemy.properties.pos.x -= currentOverlap.x;
						}
					}
				}
			}

		}
		// Collision of bullets with player and enemies;
		else if (entity.tag == "Bullet") {
			if (entity.properties.origin == "Enemy") {
				var currentOverlap = getOverlap(player, entity);
				if (currentOverlap.x > 0 && currentOverlap.y > 0) {
					// Bullet hit the player;
					player.properties.hp--;
					entity.changeAnimation({"index" : (entity.properties.scale.x == -1) ? 3 : 2});
					entity.animation.update();
					entity.properties.alive = false;
				}
			}
			else if (entity.properties.origin == "Player") {
				entityManager.getEntitiesByTag("Enemy").forEach(function(enemy) {
					var currentOverlap = getOverlap(enemy, entity);
					if (currentOverlap.x > 0 && currentOverlap.y > 0) {
						// Bullet hit the enemy;
						enemy.properties.hp--;
						entity.changeAnimation({"index" : (entity.properties.scale.x == -1) ? 3 : 2});
						entity.animation.update();
						entity.properties.alive = false;
					}
				});
			}

		}
	});

	// Collision of player with the canvas
	// (Taking the x and y of canvas to be 0, 0);
	if (player.properties.pos.x < 0) player.properties.pos.x = 0;

	if (player.properties.pos.y < 0) player.properties.pos.y = 0;

	if (player.properties.pos.y > canvas.height) {
		player.properties.alive = false;
		gameStarted = false; // TODO: Call game over;
	}
}


// Redraw canvas according to the updated positons;
function canvasDraw() {
	// Clear the canvas for refresh;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Change background animation;
	var background = entityManager.getEntityByTag("Background");
	if (background) { // Check if background exists;
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
	ctx.fillText(username.text + username.name, username.x, username.y); // Draw players username;

	if (frameCount < 50) {
	ctx.fillText(score.text + score.int, score.x, score.y);

	// Draw coin and update;
	ctx.drawImage(coinImage, score.x, score.y + 10, 40, 40);
	ctx.fillText(": " + coinCount, score.x + 50, score.y + 40);


	if(frameCount < 50){ // Show level name in the beginning;
		ctx.fillText("Level " + currentLevel, 600, 100);
	}

	var endPoint = entityManager.getEntityByTag("End");

	if (player.properties.pos.x >= endPoint.properties.pos.x) {
		endLevel(currentLevel, filesInDirectory);
	}
	
	// Update HP bar;
	ctx.fillText('HP: ', 20, 70);
	ctx.fillStyle = (player.properties.hp < player.properties.hpMax * 0.25) ? 'red' : 'green';
	var w = player.properties.hpMax * player.properties.hp / player.properties.hpMax * 2; // Multiply by 2 to make it a little more visible
	if (w < 0) w = 0
	ctx.fillRect(80, 50, w, 20);

	if(player.properties.hp <= 0){
		entityManager.removeEntity(player);
		gameOver();
		gameStarted = false;
		if(backgroundSound) backgroundSound.stop();

		setTimeout(function(){
				startNewGame(1)
		}, 5000);
	}
	
	var endPoint = entityManager.getEntityByTag("End");
	if (player.properties.pos.x >= endPoint.properties.pos.x) {
			endLevel(currentLevel, filesInDirectory);
	}

	// Draw tiles and all other entities;
	entityManager.getEntities().forEach(function (e) {
		switch (e.tag) {
			case "Tile1":
			case "Tile2":
			case "Tile3":
			case "Tile4":
				ctx.drawImage(e.image, e.properties.pos.x - viewport.x, e.properties.pos.y - viewport.y,
					e.properties.width, e.properties.height);

				if (spriteBox)
					ctx.strokeRect(e.properties.pos.x - viewport.x, e.properties.pos.y - viewport.y,
						e.properties.width, e.properties.height)
				break;

			case "Player":
			case "Enemy":
			case "Bullet":
			case "Coin":
				ctx.drawImage(e.image, e.animation.frame * e.properties.width, 0, e.properties.width, e.properties.height,
					Math.floor(e.properties.pos.x - viewport.x), Math.floor(e.properties.pos.y - viewport.y), e.properties.width, e.properties.height);
				if (spriteBox)
					ctx.strokeRect(Math.floor(e.properties.pos.x - viewport.x), Math.floor(e.properties.pos.y - viewport.y), e.properties.width, e.properties.height);

				display.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
				break;
		}
	});


}

function endLevel(currentLevel, levelsInDirectory) {
	var totalLevels = levelsInDirectory.length;

		ctx.font = "100px arcade";
		ctx.fillStyle = 'white';

	if (currentLevel === totalLevels) {
		ctx.fillText("Game Over", 400, 350);
	} else {
		ctx.fillText("Level " + currentLevel + "\n finished", 300, 350);
	}
	gameStarted = false;
	setTimeout(function () {
		if (++currentLevel <= totalLevels) {
			startNewGame(currentLevel)
		}
	}, 5000);
}

function gameOver(){
		ctx.fillText("Game Over", 400, 350);
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

function clickHandler(event) {
	var buttonX = 700;
	var resumeButtonY = 410;
	var saveButtonY = 478;
	var quitButtonY = 541;
	var buttonW = 160;
	var buttonH = 50;
	
	//Resume button
	if (
		event.x > buttonX &&
		event.x < (buttonX + buttonW) &&
		event.y > (resumeButtonY) &&
		event.y < (resumeButtonY + buttonH)
	) {
		// Executes if  resume button was clicked!
		paused = false;
	}
	///save button save listener
	else if (
		event.x > buttonX &&
		event.x < buttonX + buttonW &&
		event.y > saveButtonY &&
		event.y < saveButtonY + buttonH
	) {
		// Executes if  save button was clicked!
		//TODO:Add SAVE FUNCTION HERE
		console.log("Save");

	}
	//quit button listener
	else if (
		event.x > buttonX &&
		event.x < buttonX + buttonW &&
		event.y > quitButtonY &&
		event.y < quitButtonY + buttonH
	) {
		// Executes if button was clicked!
		paused = false;
		$('.paused').hide();
		gameStarted = false;
		//TODO: FIX HERE :Clear all canvas and previous game history
		$('.star').show();
		$(".interface").html("");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		$('#game').hide();
		generateMenus('playMenu');
	}
}

function addListener() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	canvas.addEventListener("click", clickHandler, false);
}


startNewGame = function (level) {
	// DONE : Properly clear the entity manager
	entityManager.removeAllEntities();
	ctx.font = "30px arcade";

	socket.emit('storyMode', {
		level: level
	});
	socket.on('levelPack', function (data) {
		entityManager.removeEntity(player);
		username.name = data.username;
		level = new Level(data);
		currentLevel = level.levelName;
		level.loadLevel();

		entityManager.update(); // Call update for intialization;
		player = entityManager.getEntityByTag("Player");

		if (!player) {
			alert("Oops, Something went wrong! \nPlease try again");
			generateMenus("playMenu");
			return;
		}

		if (backgroundSound) backgroundSound.play();

		addListener();
		gameStarted = true;
		timeWhenGameStarted = Date.now();
		frameCount = 0;

		$('.star').hide();
		$('#game').show();
		$('.paused').hide();
	});

	socket.on("filesInDirectory", function (data) {
		filesInDirectory = data.files;
	});
}

var leaderButton = false;

//A function that shows the top scorers
var leaderBoard = function () {
	//TODO: loop on all scores and find the highest scrore
	// Then rank accoring to scores
	var rank = 0
	var maxRank = 10; // number of players


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
	ctx.fillText('GAME PAUSED', 550, 150);
	//Add buttons
	var resumeButtonX = 570;
	// var buttonX = 570; 
	var saveButtonX = 570;
	var quitButtonX = 570;
	var resumeButtonY = 300;
	var saveButtonY = 370;
	var quitButtonY = 440;
	var buttonW = 160;
	var buttonH = 50;
	//Setting up in-game buttons

	ctx.fillStyle = "blue";
	//Resume button
	ctx.fillRect(resumeButtonX, resumeButtonY, buttonW, buttonH);
	//Save button
	ctx.fillRect(saveButtonX, saveButtonY, buttonW, buttonH);
	//Quit button
	ctx.fillRect(quitButtonX, quitButtonY, buttonW, buttonH);
	ctx.fillStyle = "yellow";
	ctx.fillText("Resume", 600, 335);
	ctx.fillText("Save", 620, 405);
	ctx.fillText("Quit", 620, 475);

	ctx.strokeStyle = "blue";
	ctx.fillStyle = "rgba(0,0,0,0.01)";
	ctx.rect(100, 50, 1080, 600);
	ctx.stroke();
	ctx.fill();
}

function update() {
	if (!gameStarted) return; // Stop updates if game is not being played;
	frameCount++;
	if (paused) {
		isPaused();
		return;
	}

	if (leaderButton) {
		leaderBoard();
		return;
	}

	updateEntities();
	updateAnimation();

	testCollisions();

	viewport.update("Player", player); // Update the viewport relative to player before drawing on canvas;

	canvasDraw();
}

setInterval(update, 1000 / 30);
