var fs = require('fs');

var EntityManager = require('./EntityManager');
const components = require('./ComponentEnum.js');
require('./DatabaseManager.js');

function GamePlay(param) {
	var self = {}
	self.name = param.level;
	self.file = param.level + '.json';
	self.username = param.username;
	self.socket = param.socket;
	self.entityManager = new EntityManager();
	self.player = "";

	self.assetManager = param.assetManager;

	self.init = function() {
		var levelPack = {};
		levelPack.username = self.username;
		levelPack.name = self.name;
		levelPack.file = self.file;
		levelPack.data = [];

		Database.readFromDatabase({levelName: self.name, user: 'admin'}, function(levelData) {
			self.loadLevelData(levelData.tileMap); // load level data;

			self.entityManager.getEntities().forEach(function(entity) {
				// Get init pack for all the entities;
				levelPack.data.push(entity.getInitPack());
			});

			self.socket.emit('levelPack', levelPack);
		});

		//self.loadLevelData(self.getLevelData(levelPack.name));
	}

	self.spawnPlayer = function(data) {
		self.player = self.entityManager.addEntity("Player");
		self.player.addComponent(components.TRANSFORM, {x: data.x, y: data.y, speedMax: 10});
		self.player.addComponent(components.GRAVITY);
		self.player.addComponent(components.INPUT);
		self.player.addComponent(components.STATS, {hp: 100, score: 0}); // TODO: Get score from db, incase of continuing game;
		self.player.addComponent(components.WEAPON, {loc: self.assetManager.getTexture("Bullet")});
		self.player.addComponent(components.DIMENSION, {w: 40, h: 80});
		self.player.addComponent(components.SPRITE, {loc: self.assetManager.getTexture("Player"),
													jumpLoc: self.assetManager.getTexture("PlayerJump"),
													frame_sets: [[0], [1], [2, 3, 4, 5], [6, 7, 8, 9]]});
	}

	self.spawnEnemy = function(data) {
		var enemy = self.entityManager.addEntity("Enemy");
		enemy.addComponent(components.TRANSFORM, {x: data.x, y: data.y, speedMax: 10});
		enemy.addComponent(components.GRAVITY);
		enemy.addComponent(components.WEAPON, {loc: self.assetManager.getTexture("Bullet")});
		enemy.addComponent(components.DIMENSION, {w: 40, h: 80});
		enemy.addComponent(components.SPRITE, {loc: self.assetManager.getTexture(data.name),
											   jumpLoc: self.assetManager.getTexture("EnemyJump"),
											   frame_sets: [[0], [1], [2, 3, 4, 5], [6, 7, 8, 9]]});

		if (data.ai === "Basic") {
			enemy.addComponent(components.STATS, {hp: 2, score: 10});
		}
		else if (data.ai === "FollowPlayer") {
			enemy.addComponent(components.FOLLOWPLAYER, data.followSpeed);
			enemy.addComponent(components.STATS, {hp: 5, score: 30});
		}
		else if (data.ai === "Patrol") {
			enemy.addComponent(components.PATROL, {pos: data.patrolPos, speed: data.patrolSpeed});
			enemy.addComponent(components.STATS, {hp: 4, score: 50});
		}
	}

	self.spawnTile = function(data) {
		var tile = self.entityManager.addEntity(data.name);
		tile.addComponent(components.TRANSFORM, {x: data.x, y: data.y});
		tile.addComponent(components.DIMENSION, {w: 40, h: 40});

		if (data.name == "Coin") {
			tile.addComponent(components.STATS, {hp: 0, score: 1});
			tile.addComponent(components.SPRITE, {loc: self.assetManager.getTexture(data.name),
													frame_sets: [[0,1,2,3,4,5,6]]});
		}
		else {
			tile.addComponent(components.SPRITE, {loc: self.assetManager.getTexture(data.name)});
		}
	}

	self.loadLevelData = function(levelData){
		var locationsMap = {}
		var loc;

		for (var i = 0; i < levelData.length; i++) {
			// Get all the types checked;
			var type = levelData[i].type;
			var name = levelData[i].name;
			switch(type) {
				case "Character":
					if (name == "Player")
						self.spawnPlayer(levelData[i]);
					else // Other characters are enemies;
						self.spawnEnemy(levelData[i]);
				break;

				case "Tile":
					self.spawnTile(levelData[i]);
				break;

				case "Point":
					var point = self.entityManager.addEntity(name);
					point.addComponent(components.TRANSFORM, {x: levelData[i].x, y: levelData[i].y});
				break;

				case "Background":
					var background = self.entityManager.addEntity(type);
					var frame_sets;
					if (name == "NewYork") frame_sets = [[0], [1], [2]];
					else frame_sets = [[0]];

					background.addComponent(components.SPRITE, {loc: self.assetManager.getTexture(name), frame_sets: frame_sets});
				break;

				case "Sound":
					var sound = self.entityManager.addEntity(type);
					sound.addComponent(components.SPRITE, {loc: self.assetManager.getSound(name)});

				break;

				default:
					console.log("Could not find the asset type: " + type);
					break;
			}
		};
	}

	self.init();  // initialise the GamePlay;

	return self;
}

module.exports = GamePlay;