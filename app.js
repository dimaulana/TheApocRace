/* 	Game Engine class
	Starts the game server and sets up the necessary files
	and services

	Author: Hussein Parpia
*/


// Files and services needed for game
require('./server/DatabaseManager');
var AssetManager = require('./server/AssetManager.js');
var GamePlay = require('./server/GamePlay');
var LevelEditor = require('./server/LevelEditor');
var fs = require ('fs');
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

// Initialize the database;
DatabaseManager();

//PORT from the server host 
serv.listen(process.env.PORT || 8080);
console.log('Server started');

var DEBUG = true;

var SOCKET_LIST = {};

// Set up asset manager and load assets from the database;
// Doing this here in order to avoid waiting for the database call
// to load the data;
var assetManager = new AssetManager();
assetManager.loadAssets();

// Saves the user information to be used throughout the game engine
var User = function(data) {
	var self = {
		//id: data.userID,
		name: data.username,
		socketID: data.socketID
	}

	return self;
}

var currentUser;


// Initializes the GamePlay object with the required data;
var startGame = function(data) {
	var game = new GamePlay({
			level: data.level,
			username: currentUser.name,
			socket: data.socket,
			assetManager: assetManager
		});
	//game.init();
}

var newLevelEditor = function(data){
	var levelEditor = new LevelEditor(data);
	levelEditor.readLevel();

	data.socket.on('saveNewLevel', function(data){
		data.user = currentUser.name;
		levelEditor.writeToDatabase(data);
	});
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket) {
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	socket.on('signIn',function(data) {
		Database.isValidPassword(data, function(res) {
			if (res) {
				socket.emit('signInResponse', {success: true});

				// Create User once signed In;
				currentUser = User({
					socketID: socket.id,
					username: data.username,
				});
			}
			else {
				socket.emit('signInResponse', {success: false});
			}
		});
	});

	socket.on('signUp',function(data) {
		Database.isUsernameTaken(data, function(res) {
			if(res){
				socket.emit('signUpResponse', {success:false});
			}
			else {
				var passwordHash = require('password-hash');
				var hashedPassword = passwordHash.generate(data.password);
				data.hashedPassword = hashedPassword;
				Database.addUser(data, function() {
					socket.emit('signUpResponse', {success:true}); 
				});
			}		
		});
	});

	socket.on('resetPassword', function(data) {
		// Check if username is valid;
		Database.isUsernameTaken(data, function(res) {
			if (res) {
				Database.updatePassword(data, function(res) {
					if (res) {
						socket.emit('resetPassResponse', {success:true});
					}
					else {
						socket.emit('resetPassResponse', {success:false});
					}
				});
			}
			else {
				socket.emit('resetPassResponse', {success:false});
			}
		});
	});

	socket.on('storyMode', function(data) {
		// Create player and other entities

		// TODO: Get level for story mode;
		//var myLevel = getLevelStoppedPreviously();
		var myLevel = data.level;

		startGame({
			level: myLevel,
			socket: socket,
		});

		fs.readdir('./server/levels/', function (err, files) {
			if (err) {
				return console.log('Unable to scan directory: ' + err);
			} 
			var pack = {files: files}
			socket.emit("filesInDirectory", pack);
		});

	});

	socket.on('playLevel', function(data) {
		startGame({
			level: data.level,
			socket: socket,
		});
	});

	
	socket.on('disconnect',function() {
		delete SOCKET_LIST[socket.id];
		//Player.onDisconnect(socket);
	});

	socket.on('sendMsgToServer',function(data) {
		var playerName = ("" + socket.id).slice(2,7);
		for (var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
		}

	});

	socket.on('loadLevel', function(levelName){
		newLevelEditor({levelName: levelName, socket: socket});
	});

	socket.on('evalServer',function(data) {
		if (!DEBUG)
			return;
		
		var res = eval(data)
		for (var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('evalAnswer', res);
		}

	});
});

// Update the game engine;
setInterval(function() {
},1000/30);
