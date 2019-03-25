var fs = require('fs');

var EntityManager = require('./EntityManager');
const components = require('./ComponentEnum.js');

class GamePlay {
	constructor(param) {
		this.name = param.level;
		this.file = 'level' + param.level + '.json';
		this.username = param.user;
		this.socket = param.socket;
		this.entityManager = new EntityManager();
		this.player = "";

		this.assetManager = param.assetManager;

		this.init();
	}

	init() {
		this.spawnPlayer();
		var playerPack = this.player.getInitPack();

		// Get the player image location;
		playerPack.fileLocation = this.getMemoryLocationForAsset([{"type": "Player"}]).Player;

		this.socket.emit('initPack', playerPack);

		var levelPack = {};
		levelPack.name = this.name;
		levelPack.file = this.file;
		levelPack.data = this.getLevelData();

		if (levelPack.data !== undefined || levelPack.data.length > 0) {
			levelPack.assetLocation = this.getMemoryLocationForAsset(levelPack.data);
		}

		this.socket.emit('levelPack', levelPack);
	}

	spawnPlayer() {
		this.player = this.entityManager.addEntity("player");
		this.player.addComponent(components.TRANSFORM);
		this.player.addComponent(components.INPUT);
		this.player.addComponent(components.STATS);
		this.player.addComponent(components.DIMENSION);

		// All the components;
	}

	getLevelData(){
		let rawdata = fs.readFileSync('server/bin/' + this.file);  
		let json = JSON.parse(rawdata); 
		return json;
	}

	getMemoryLocationForAsset(levelData){
		var locationsMap = {}
		var loc;
		var type;

		for(var i = 0; i < levelData.length; i++){
			type = levelData[i]["type"];
			// Get all the types checked;
			switch(type) {
				case "Player":
				case "Tile1":
				case "Tile2":
				case "Tile3":
				case "NY1":
				case "NY2":
				case "NY3":
				case "LA1":
				case "LA2":
				case "LA3":
					loc = this.assetManager.getTexture(type);
					locationsMap[type] = loc;
				break;

				case "Sound":
					loc = this.assetManager.getSound("StoryMode");
					locationsMap.Sound = loc;
 				break;

				default:
					console.log("Could not find the asset type: " + type);
					break;		
			}
		}
		return locationsMap;
	}
};

module.exports = GamePlay;