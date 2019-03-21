var EntityManager = require('./EntityManager');
var fs = require('fs');
var AssetManager = require('./AssetManager')

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

		this.init();
	}

	init() {
		this.spawnPlayer();

		this.socket.emit('initPack', this.player.getInitPack());
		// var pack = {
		// 	name: this.name,
		// 	file: this.file,
		// 	data: this.getLevelData(),
		// 	assetLocation: this.getMemoryLocationForAsset(this.getLevelData())
		// }
		var pack = {};
		pack.name = this.name;
		pack.file = this.file;
		pack.data = this.getLevelData();
		if (pack.data !== undefined || pack.data.length > 0) {
			pack.assetLocation = this.getMemoryLocationForAsset(pack.data);
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
		var locationsMap = {}
		var loc;
		var type;
		var assetManager = new AssetManager();
		assetManager.loadAssets();
		for(var i = 0; i < levelData.length; i++){
			type = levelData[i]["type"];
			switch(type){
				case "Tile":
					loc = assetManager.getTexture("Tile");
					locationsMap.Tile = loc;
					break;
				case "Sound":
					loc = assetManager.getSound("StoryMode");
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