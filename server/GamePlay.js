var Asset = require('./Assets');
var EntityManager = require('./EntityManager');

class GamePlay {
	constructor(param) {
		this.level = param.level;
		this.username = param.user;
		this.socket = param.socket;
		this.entityManager = new EntityManager();
		this.player = "";

		this.init();
	}

	init() {
		this.spawnPlayer();
		this.socket.emit('initPack', this.player.getInitPack());

	}

	spawnPlayer() {
		this.player = this.entityManager.addEntity("player");
		this.player.addComponent("Transform");
		this.player.addComponent("Input");
		this.player.addComponent("Stats");
		this.player.addComponent("Dimension");

		// All the components;
	}
};

module.exports = GamePlay;

// var game = new GamePlay({
// 			level:1,
// 			username:'hp',
// 			socket: "",
// 		});
// console.log(game.player);
