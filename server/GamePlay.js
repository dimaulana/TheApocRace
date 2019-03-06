var Asset = require('./Assets');
var EntityManager = require('./EntityManager');

// param should consist of: 
// player username;

// TODO: Change this to a class.
// GamePlay = function(param) {
// 	var self = {
// 		level: param.level,
// 		username: param.user,
// 		socket: param.socket,
// 		entityManager: new EntityManager()
// 	}

// 	self.spawnPlayer = function() {
// 		self.player = self.entityManager.addEntity("player");
// 		self.player.addComponent("Transform");

// 		return self.player;
// 	}

// 	self.init = function() {
// 		this.spawnPlayer();
// 		self.socket.emit('initPack', self.player.getInitPack());
// 	}

// 	return self;

// }

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
	}
};

module.exports = GamePlay;

// var game = new GamePlay({
// 			level:1,
// 			username:'hp',
// 			socket: "",
// 		});
// console.log(game.player);