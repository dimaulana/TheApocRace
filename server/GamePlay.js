var EntityManager = require('./EntityManager');
var fs = require('fs');
var AssetManager = require('./AssetManager')

class GamePlay {
	constructor(param) {
		this.level = {
			levelName: param.level, 
			fileLocation: 'level' + param.level + '.json',
			levelData: this.getLevelData(),
			tileFile: this.getMemoryLocationForTile() 
		};
		this.username = param.user;
		this.socket = param.socket;
		this.entityManager = new EntityManager();
		this.player = "";

		this.init();
	}

	init() {
		this.spawnPlayer();
		this.socket.emit('initPack', this.player.getInitPack());
		this.socket.emit('levelPack', this.level);
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

	getMemoryLocationForTile(){
		var manager = new AssetManager();
		manager.loadAssets();
		return manager.getTexture("Tile");
	}
};

module.exports = GamePlay;