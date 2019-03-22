var fs = require('fs');

var EntityManager = require('./EntityManager');
var AssetManager = require('./AssetManager.js');
const components = require('./ComponentEnum.js');

class GamePlay {
	constructor(param) {
		this.name = param.level;
		this.file = 'level' + param.level + '.json';
		//this.data = this.getLevelData();
		//this.assetLocation = 
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
					loc = this.assetManager.getTexture("Player");
					locationsMap.Player = loc;
				break;

				case "Tile":
					loc = this.assetManager.getTexture("Tile2");
					locationsMap.Tile = loc;
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