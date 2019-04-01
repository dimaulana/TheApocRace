var fs = require('fs');

var EntityManager = require('./EntityManager');
const components = require('./ComponentEnum.js');

class GamePlay {
	constructor(param) {
		this.name = param.level;
		this.file = 'level' + param.level + '.json';
		this.username = param.username;
		this.socket = param.socket;
		this.entityManager = new EntityManager();
		this.player = "";

		this.assetManager = param.assetManager;

		this.init();
	}

	init() {
		var levelPack = {};
		levelPack.username = this.username;
		levelPack.name = this.name;
		levelPack.file = this.file;
		levelPack.data = [];

		this.loadLevelData(this.getLevelData());

		this.entityManager.getEntities().forEach(function(entity) {
			// Get init pack for all the entities;
			levelPack.data.push(entity.getInitPack());
		});
		this.socket.emit('levelPack', levelPack);
	}

	spawnPlayer(data) {
		this.player = this.entityManager.addEntity("Player");
		this.player.addComponent(components.TRANSFORM, {x: data.x, y: data.y, speedMax: 10});
		this.player.addComponent(components.GRAVITY);
		this.player.addComponent(components.INPUT);
		this.player.addComponent(components.STATS);
		this.player.addComponent(components.WEAPON, {loc: this.assetManager.getTexture("Bullet")});
		this.player.addComponent(components.DIMENSION, {w: 40, h: 80});
		this.player.addComponent(components.SPRITE, {loc: this.assetManager.getTexture("Player"), 
													jumpLoc: this.assetManager.getTexture("PlayerJump"),
													frame_sets: [[0], [1], [2, 3, 4, 5], [6, 7, 8, 9]]});
	}

	spawnEnemy(data) {
		var enemy = this.entityManager.addEntity(data.name);
		enemy.addComponent(components.TRANSFORM, {x: data.x, y: data.y, speedMax: 10});
		enemy.addComponent(components.GRAVITY);
		enemy.addComponent(components.STATS);
		enemy.addComponent(components.WEAPON, {loc: this.assetManager.getTexture("Bullet")});
		enemy.addComponent(components.DIMENSION, {w: 40, h: 80});
		enemy.addComponent(components.SPRITE, {loc: this.assetManager.getTexture("Enemy"),
											   jumpLoc: this.assetManager.getTexture("EnemyJump"),
											   frame_sets: data.frame_sets});

		if (data.ai === "Basic") {
			// Do nothing??
		}
		else if (data.ai === "FollowPlayer") {
			enemy.addComponent(components.FOLLOWPLAYER, data.followSpeed);
		}
		else if (data.ai === "Patrol") {
			enemy.addComponent(components.PATROL, {pos: data.patrolPos, speed: data.patrolSpeed});
		}
	}

	spawnTile(data) {
		var tile = this.entityManager.addEntity(data.name);
		tile.addComponent(components.TRANSFORM, {x: data.x, y: data.y});
		tile.addComponent(components.DIMENSION, {w: 40, h: 40});
		tile.addComponent(components.SPRITE, {loc: this.assetManager.getTexture(data.name)});
	}

	getLevelData(){
		let rawdata = fs.readFileSync('server/bin/' + this.file);
		let json = JSON.parse(rawdata);
		return json;  
	}

	loadLevelData(levelData){
		var locationsMap = {}
		var loc;
		var type, name;

		for (var i = 0; i < levelData.length; i++) {
			// Get all the types checked;
			type = levelData[i].type;
			name = levelData[i].name;
			switch(type) {
				case "Character":
					if (name == "Player")
						this.spawnPlayer(levelData[i]);
					else // Other characters are enemies;
						this.spawnEnemy(levelData[i]);
				break;

				case "Tile":
					this.spawnTile(levelData[i]);
				break;

				case "Background":
					var background = this.entityManager.addEntity(type);
					var frame_sets;
					if (name == "NewYork") frame_sets = [[0], [1], [2]];
					else frame_sets = [[0]];

					background.addComponent(components.SPRITE, {loc: this.assetManager.getTexture(name), frame_sets: frame_sets});
				break;

				case "Sound":
					var sound = this.entityManager.addEntity(type);
					sound.addComponent(components.SPRITE, {loc: this.assetManager.getSound(name)});

 				break;

				default:
					console.log("Could not find the asset type: " + type);
					break;
			}
		};
	}
};

module.exports = GamePlay;