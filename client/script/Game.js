/* Game class starts and sets up the game at the front end;

   Contributors: Hussein Parpia,
   					Sahil Anand,
   					Victor Mutandwa
*/

function Game() {
	var self = {}

	// Get canvas elements;
	self.canvas = document.getElementById("game");
	self.ctx = self.canvas.getContext("2d");
	self.display = document.querySelector('#game').getContext("2d");

	self.player;
	self.level;
	self.frameCount;
	self.backgroundSound;
	self.viewport = new Viewport(0, 0, 1280, 720); // The viewport of the game;
	self.entityManager = new EntityManager();
	self.currentLevel = 0;
	self.spriteBox = false;
	self.paused = false;
	self.gameStarted = false;
	self.filesInDirectory = [];

	self.score = {
		x: self.canvas.width - 200, y: 40,
		text: "SCORE: ",
		int: 0,
		topScore: 0 // Later to come from the database taken compared to other players
	}

	self.username = {
		text: "Player: ",
		x: 20,
		y: 40,
		name: "",
	}

	self.coins = {
		count: 0,
		x: self.canvas.width - 200, y: 50,
		w: 40, h: 40,
		image: new Image()
	}
	self.coins.image.src = "/client/images/singlecoin.png";

window.onload=function(){
document.getElementById("main_audio").play();
}

	self.spawnBullet = function(entity) {
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
			self.entityManager.addEntity(param);
		}
	}

	self.updatePlayer = function() {
		// Check if player is out of health;
		if (self.player.properties.hp <= 0) {
			self.entityManager.removeEntity(player);
			self.gameOver(true);
			return;
		}

		// Update speed;
		if (self.player.properties.right) {
			self.player.properties.speed.x = self.player.properties.speedMax;
			self.player.properties.scale.x = 1.0;
		} else if (self.player.properties.left) {
			self.player.properties.speed.x = -self.player.properties.speedMax;
			self.player.properties.scale.x = -1.0;
		} else {
			self.player.properties.speed.x = 0;
		}

		if (self.player.properties.jump && self.player.properties.state != "jumping") {
			self.player.properties.speed.y = -self.player.properties.speedMax * 16;
			self.player.properties.state = "jumping";
		} else {
			self.player.properties.speed.y = 0;
		}

		// Update position;
		self.player.properties.prevPos.x = self.player.properties.pos.x;
		self.player.properties.prevPos.y = self.player.properties.pos.y;

		self.player.properties.pos.x += self.player.properties.speed.x;
		self.player.properties.pos.y += self.player.properties.speed.y;

		self.player.properties.pos.y -= self.player.properties.gravity;

		self.player.properties.weaponClock++; // Update weaponClock;
	}

	self.updateEnemy = function(enemy) {
		// Check if enemy is out of health;
		if (enemy.properties.hp <= 0) {
			enemy.properties.alive = false;
			self.score.int += enemy.properties.score;
			return;
		}

		enemy.properties.prevPos.x = enemy.properties.pos.x;
		enemy.properties.prevPos.y = enemy.properties.pos.y;

		enemy.properties.pos.y -= enemy.properties.gravity;

		// TODO: Update enemy based on their AI;

		var index = 0;
		if (enemy.properties.followSpeed != null) { // Follow Player AI
			if (enemy.properties.pos.x + 100 < self.player.properties.pos.x) {
				//player.properties.pos.x - enemy.properties.pos.x > 100) {
				// Only chase if player he is ahead of the front of player;
				// Leaving a small distance between enemy and player;
				if (enemy.properties.delay >= 10) {
					enemy.properties.delay = 0;
					enemy.properties.pos.x += enemy.properties.followSpeed.x;
					// enemy.changeAnimation({state: "run", index: 2});
					index = 2;
					self.spawnBullet(enemy);
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
			var distance = enemy.properties.pos.x - self.player.properties.pos.x;
			if (distance >= 0 && distance < lineOfSight) {
				enemy.properties.scale.x = -1.0;
				// enemy.changeAnimation({state: "run", index: 1});
				index = 1;
				self.spawnBullet(enemy);
			}
			else if (distance >= -lineOfSight && distance < 0)
			{
				enemy.properties.scale.x = 1.0;
				//enemy.changeAnimation({state: "run", index: 0});
				index = 0;
				self.spawnBullet(enemy);
			}
		}
		enemy.properties.weaponClock++; // Update weapon clock;

		enemy.changeAnimation({state: "run", index: index});
		enemy.animation.update();
	}

	self.updateEntities = function() {
		// First update entityManager;
		self.entityManager.update();

		self.updatePlayer(); // Update Player;

		self.entityManager.getEntities().forEach(function (entity) {
			if (entity.tag !== "Background")
				if (!self.viewport.inView(entity, 40)) return;

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
				self.updateEnemy(entity);
		});
	}

	self.updateAnimation = function() {
		// Update player animation;
		var param = {};

		if (self.player.properties.state == "jumping")
			param.state = "jump";
		else
			param.state = "run";

		// Check direction;
		if (self.player.properties.right)
			param.index = 2;
		else if (self.player.properties.left)
			param.index = 3;
		else
			param.index = (self.player.properties.scale.x == -1.0) ? 1 : 0;

		self.player.changeAnimation(param);

		self.player.animation.update();

		self.entityManager.getEntitiesByTag("Coin").forEach(function(c) {
			if (!(c.properties.pos.x >= self.viewport.x - 40 && c.properties.pos.x <= self.viewport.x + self.viewport.w + 40)) return;
			c.changeAnimation({index: 0});
			c.animation.update();
		});
	}

	// Function to handle collisions;
	self.getOverlap = function(a, b) {

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

	self.getPrevOverlap = function(a, b) {

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

	self.testCollisions = function () {

		self.entityManager.getEntities().forEach(function (entity) {
			if (entity.tag !== "Background")
				if (!self.viewport.inView(entity, 40)) return;

			// Collision of self.player with Coins;
			if (entity.tag == "Coin") {
				var currentOverlap = self.getOverlap(self.player, entity);
				if (currentOverlap.x > 0 && currentOverlap.y > 0) {
					self.coins.count += entity.properties.score;
					entity.properties.alive = false;
				}
			}
			else if (entity.tag == "Tile1" ||
					 entity.tag == "Tile2" ||
					 entity.tag == "Tile3" ||
					 entity.tag == "Tile4") {

				// Collision between tiles and player;
				var currentOverlap = self.getOverlap(self.player, entity);
				var prevOverlap = self.getPrevOverlap(self.player, entity);

				if (currentOverlap.x > 0 && currentOverlap.y > 0) {
					if (prevOverlap.x > 0) {
						// Collision from top or bottom;
						if ((self.player.properties.pos.y - self.player.properties.prevPos.y) > 0) {
							// Collision came from top of tile;
							self.player.properties.speed.y = 0;
							self.player.properties.pos.y -= currentOverlap.y;
							self.player.properties.state = "standing"; // Jumping ends as he is now on the tile;
						} else if (((self.player.properties.pos.y - self.player.properties.prevPos.y) <= 0)) {
							// Collision came from bottom of tile;
							self.player.properties.speed.y = 0;
							self.player.properties.pos.y += currentOverlap.y;
						}
					}

					if (prevOverlap.y > 0) {
						// Collision from right or left;
						if ((self.player.properties.pos.x - self.player.properties.prevPos.x) > 0) {
							// Collision from left;
							self.player.properties.speed.x = 0;
							self.player.properties.pos.x -= currentOverlap.x;
						} else if ((self.player.properties.pos.x - self.player.properties.prevPos.x) < 0) {
							// Collision from right;
							self.player.properties.speed.x = 0;
							self.player.properties.pos.x += currentOverlap.x;
						}
					}
				}

				// Collision of enemies with tiles;
				var enemyList = self.entityManager.getEntitiesByTag("Enemy");
				for (var i = 0; i < enemyList.length; i++) {
					var enemy = enemyList[i];
					currentOverlap = self.getOverlap(enemy, entity);
					prevOverlap = self.getPrevOverlap(enemy, entity);

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
								// Collision from left;
								enemy.properties.speed.x = 0;
								enemy.properties.pos.x -= currentOverlap.x;
							} else if ((enemy.properties.pos.x - enemy.properties.prevPos.x) < 0) {
								// Collision from right;
								enemy.properties.speed.x = 0;
								enemy.properties.pos.x += currentOverlap.x;
							}
						}
					}
				}

			}

			// Collision of bullets with self.player and enemies;
			else if (entity.tag == "Bullet") {
				if (entity.properties.origin == "Enemy") {
					var currentOverlap = self.getOverlap(self.player, entity);
					if (currentOverlap.x > 0 && currentOverlap.y > 0) {
						// Bullet hit the player;
						self.player.properties.hp--;
						entity.changeAnimation({"index" : (entity.properties.scale.x == -1) ? 3 : 2});
						entity.animation.update();
						entity.properties.alive = false;
					}
				}
				else if (entity.properties.origin == "Player") {
					self.entityManager.getEntitiesByTag("Enemy").forEach(function(enemy) {
						var currentOverlap = self.getOverlap(enemy, entity);
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
		if (self.player.properties.pos.x < 0) self.player.properties.pos.x = 0;

		if (self.player.properties.pos.y < 0) self.player.properties.pos.y = 0;

		if (self.player.properties.pos.y > self.canvas.height) {
			self.player.properties.alive = false;
			self.gameOver(true);
		}
	}

	// Redraw canvas according to the updated positons;
	self.canvasDraw = function() {
		// Clear the canvas for refresh;
		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

		self.ctx.font = "30px arcade"; // Adjust fonts;
		self.ctx.fillStyle = "white"; // Adjust fill style;

		// Change background animation;
		var background = self.entityManager.getEntityByTag("Background");
		if (background) {
			// Check if background exists;
			if (self.player.properties.speed.x > 0 && self.player.properties.pos.x > self.canvas.width / 2)
				background.frame++

			else if (self.player.properties.speed.x < 0) {
				background.frame--
				if (background.frame < 0) background.frame = 0;
			}
			self.ctx.drawImage(background.image, background.frame * 2, 0, 1280, 720, 0, 0, 1280, 720);
			// ctx.drawImage(background.image, viewport.x, 0, 1280, 720, 0, 0, 1280, 720);
		} // Else just draw default background;

		if(self.frameCount < 50){ // Show level name in the beginning;
			self.ctx.fillText("Level " + self.currentLevel, 600, 100);
		}

		// Draw players username;
		self.ctx.fillText(self.username.text + self.username.name, self.username.x, self.username.y);

		// Updating the score;
		self.ctx.fillText(self.score.text + self.score.int, self.score.x, self.score.y);

		// Draw coin and update;
		self.ctx.drawImage(self.coins.image, self.coins.x, self.coins.y, self.coins.w, self.coins.h);
		self.ctx.fillText(": " + self.coins.count, self.coins.x + 40, self.coins.y + 30);

		// Update HP bar;
		self.ctx.fillText('HP: ', 20, 70);
		self.ctx.fillStyle = (self.player.properties.hp < self.player.properties.hpMax * 0.25) ? 'red' : 'green';
		var w = self.player.properties.hpMax * self.player.properties.hp / self.player.properties.hpMax * 2; // Multiply by 2 to make it a little more visible
		if (w < 0) w = 0
			self.ctx.fillRect(80, 50, w, 20);


		// Check if game has ended;
		var endPoint = self.entityManager.getEntityByTag("End");
		if (self.player.properties.pos.x >= endPoint.properties.pos.x - 40) {
			self.endLevel();
		}

		// Draw tiles and all other entities;
		self.entityManager.getEntities().forEach(function (e) {
			switch (e.tag) {
				case "Tile1":
				case "Tile2":
				case "Tile3":
				case "Tile4":
					if (!self.viewport.inView(e, 40)) return;

					self.ctx.drawImage(e.image, e.properties.pos.x - self.viewport.x, e.properties.pos.y - self.viewport.y,
						e.properties.width, e.properties.height);

					if (self.spriteBox)
						self.ctx.strokeRect(e.properties.pos.x - self.viewport.x, e.properties.pos.y - self.viewport.y,
							e.properties.width, e.properties.height)
				break;

				case "Player":
					// Always drawing player;
					self.ctx.drawImage(e.image, e.animation.frame * e.properties.width, 0, e.properties.width, e.properties.height,
						Math.floor(e.properties.pos.x - self.viewport.x), Math.floor(e.properties.pos.y - self.viewport.y), e.properties.width, e.properties.height);

					if (self.spriteBox)
						self.ctx.strokeRect(Math.floor(e.properties.pos.x - self.viewport.x), Math.floor(e.properties.pos.y - self.viewport.y), e.properties.width, e.properties.height);

					self.display.drawImage(self.ctx.canvas, 0, 0, self.ctx.canvas.width, self.ctx.canvas.height, 0, 0, self.display.canvas.width, self.display.canvas.height);
				break;

				case "Enemy":
				case "Bullet":
				case "Coin":
					if (!self.viewport.inView(e, 40)) return;

					self.ctx.drawImage(e.image, e.animation.frame * e.properties.width, 0, e.properties.width, e.properties.height,
						Math.floor(e.properties.pos.x - self.viewport.x), Math.floor(e.properties.pos.y - self.viewport.y), e.properties.width, e.properties.height);

					if (self.spriteBox)
						self.ctx.strokeRect(Math.floor(e.properties.pos.x - self.viewport.x), Math.floor(e.properties.pos.y - self.viewport.y), e.properties.width, e.properties.height);

					self.display.drawImage(self.ctx.canvas, 0, 0, self.ctx.canvas.width, self.ctx.canvas.height, 0, 0, self.display.canvas.width, self.display.canvas.height);
				break;
			}
		});
	}


	self.keyDownHandler = function(e) {
		switch (e.keyCode) {
			case 27: // ESC key for getting back to the menu;
				// TODO:
				// Quit game;
				// Save progress;
				self.paused = false;
				$('.paused').hide();
				self.gameStarted = false;
				//TODO: FIX HERE :Clear all canvas and previous game history
				$('.star').show();
				$(".interface").html("");
				self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
				$('#game').hide();
				generateMenus('playMenu');
			break;

			case 68: // d key
				self.player.properties.right = true;
			break;

			case 65: // a key
				self.player.properties.left = true;
			break;

			case 87: // w key
				self.player.properties.jump = true;
			break;

			case 83: // s key
				self.player.properties.shoot = true;
				self.spawnBullet(self.player);
			break;

			case 80: // p key
				self.paused = !self.paused;
			break;

			case 66: // b key for spriteBox which can be used for collisions
				self.spriteBox = !self.spriteBox;
			break;
		}
	}

	self.keyUpHandler = function(e) {
		switch (e.keyCode) {
			case 68: // d key
				self.player.properties.right = false;
			break;

			case 65: // a key
				self.player.properties.left = false;
			break;

			case 87: // w key
				self.player.properties.jump = false;
			break;

			case 83: // s key
				self.player.properties.shoot = false;
			break;
		}
	}

	function clickHandler(event) {
		var buttonX = 700;
		var buttonXR=700;
		var resumeButtonY = 410;
		var saveButtonY = 478;
		var quitButtonY = 541;
		var buttonW = 160;
		var buttonH = 50;

		//Resume button
		if (
			event.x > buttonXR &&
			event.x < (buttonXR + buttonW) &&
			event.y > (resumeButtonY) &&
			event.y < (resumeButtonY + buttonH)
		) {
			// Executes if  resume button was clicked!
			paused = false;
			console.log(" Resume POSITION Clicked");
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
			self.paused = false;
			$('.paused').hide();
			self.gameStarted = false;
			//TODO: FIX HERE :Clear all canvas and previous game history
			$('.star').show();
			$(".interface").html("");
			self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
			$('#game').hide();
			generateMenus('playMenu');
		}
	}

	self.addListener = function() {
		document.addEventListener("keydown", self.keyDownHandler, false);
		document.addEventListener("keyup", self.keyUpHandler, false);
		self.canvas.addEventListener("click", clickHandler, false);
	}

	self.endLevel = function() {
		var totalLevels = self.filesInDirectory.length;

		self.ctx.font = "100px arcade";
		self.ctx.fillStyle = 'white';

		if (self.currentLevel === totalLevels) {
			self.gameOver(false);
		} else {
			self.ctx.fillText("Level " + self.currentLevel + "\n finished", 300, 350);
		}
		self.gameStarted = false;

		setTimeout(function () {
			if (++self.currentLevel <= totalLevels) {
				self.startNewGame(self.currentLevel)
			}
		}, 5000);
	}

	// Print game over and restart game if needed;
	self.gameOver = function(repeat) {
		self.ctx.fillText("Game Over", 400, 350);

		if (repeat) {
			setTimeout(function() {
						self.startNewGame(1)
						}, 5000);
		}
	}

	/** IS IT NEEDED HERE?
	self.leaderButton = false;
	//A function that shows the top scorers
	self.leaderBoard = function () {
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
	**/

	self.quitGame = function(){
		$('.star').show();
		$('#game').hide();
		$('.paused').hide();
		paused=false;
		gameStarted=false;
		generateMenus("playMenu");


	}

	self.isPaused = function() {
		// TODO:
		// Move draw to the div paused  using ralative
		self.ctx.beginPath();
		self.ctx.fillStyle = "red";
		self.ctx.fillText('GAME PAUSED', 550, 150);
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

		self.ctx.fillStyle = "blue";
		//Resume button
		self.ctx.fillRect(resumeButtonX, resumeButtonY, buttonW, buttonH);
		console.log(" Resume POSITION HERE");
		//Save button
		self.ctx.fillRect(saveButtonX, saveButtonY, buttonW, buttonH);
		//Quit button
		self.ctx.fillRect(quitButtonX, quitButtonY, buttonW, buttonH);
		self.ctx.fillStyle = "yellow";
		self.ctx.fillText("Resume", 600, 335);
		self.ctx.fillText("Save", 620, 405);
		self.ctx.fillText("Quit", 620, 475);

		self.ctx.strokeStyle = "blue";
		self.ctx.fillStyle = "rgba(0,0,0,0.01)";
		self.ctx.rect(100, 50, 1080, 600);
		self.ctx.stroke();
		self.ctx.fill();
	}

	self.loadLevel = function(data) {
		self.currentLevel = data.name;

		var levelData = data.data;
		for (var i = 0; i < levelData.length; i++) {

    		if (levelData[i].tag == "Sound") {
					self.backgroundSound = new Sound(levelData[i].fileLocation);
					document.getElementById("main_audio").pause();
    			self.backgroundSound.play();
    			continue;
    		}
    		//var e = new Entity(self.levelData[i]);
    		self.entityManager.addEntity(levelData[i]);
    		self.entityManager.update(); // Call update for initialisation;
    	}

	}

	self.startNewGame = function(level) {
		self.entityManager.removeAllEntities(); // Clear all entities if any;

		if (!level) {
			console.log("WARNING: LEVEL NOT SUPPLIED, PLAYING LEVEL 1")
			level = 1;
		}

		socket.emit('storyMode', {level: level});

		socket.on('levelPack', function(data) {
			// Explicitly removing player;
			if (!self.player)
				self.entityManager.removeEntity(self.player);

			self.username.name = data.username;
			self.loadLevel(data);

			// Get new player object;
			self.player = self.entityManager.getEntityByTag("Player");

			if (!self.player) {
				alert("Oops, Something went wrong! \nPlease try again");
				generateMenus("playMenu");
				return;
			}

			self.addListener(); // Add user buttons listener;

			self.gameStarted = true;
			self.frameCount = 0;

			$('.star').hide();
			$('#game').show();
			$('.paused').hide();

		});

		socket.on("filesInDirectory", function (data) {
			self.filesInDirectory = data.files;
		});
	}

	self.update = function() {
		// Stop updates if game is not being played;
		if (!self.gameStarted) return;

		self.frameCount++; // Increment frame count;

		if (self.paused) {
			self.isPaused();
			return;
		}

		self.updateEntities();
		self.updateAnimation();

		self.testCollisions();

		// Update viewport with respect to player;
		self.viewport.update("Player", self.player);

		self.canvasDraw();
	}

	return self;
}


// Load a new game given a level;
var game;
function loadGame(level) {

	game = new Game();
	game.startNewGame(level);

	setInterval(game.update, 1000/30);
}