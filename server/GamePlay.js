var EntityManager = require('./EntityManager');
var fs = require('fs');
var AssetManager = require('./AssetManager')

class GamePlay {
	constructor(param) {
		this.name = param.level;
		this.file = 'level' + param.level + '.json';
		this.data = this.getLevelData();
		// console.log(this.data);
		this.assetLocation = this.getMemoryLocationForAsset(this.data);
		this.username = param.user;
		this.socket = param.socket;
		this.entityManager = new EntityManager();
		this.player = "";

		this.init();
	}

	init() {
		this.spawnPlayer();
		this.socket.emit('initPack', this.player.getInitPack());
		var pack = {
			name: this.name,
			file: this.file,
			data: this.data,
			assetLocation: this.assetLocation
		}
		this.socket.emit('levelPack', pack);
	}

	spawnPlayer() {
		this.player = this.entityManager.addEntity("player");
		this.player.addComponent("Transform");
		this.player.addComponent("Input");
		this.player.addComponent("Stats");
		this.player.addComponent("Dimension");

		// All the components;
	}

	getLevelData(){
		let rawdata = fs.readFileSync('server/bin/level1.json');  
		let json = JSON.parse(rawdata); 
		return json;
	}

	getMemoryLocationForAsset(levelData){
		var loc;
		var type;
		var manager = new AssetManager();
		manager.loadAssets();
		for(var i = 0; i < levelData.length; i++){
			type = levelData[i]["type"];
			// console.log(levelData[31]);
			// console.log(levelData.length);
			// console.log(type);
			switch(type){
				case "Tile":
					loc = manager.getTexture("Tile");
					break;
				case "Sound":
					console.log("here");
					loc = manager.getSound("StoryMode");
					break;
				default:
					console.log("Could not find the asset type: " + type);
					break;		
			}
		}
		return loc;
	}
};

module.exports = GamePlay;