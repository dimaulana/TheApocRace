// Game Engine class
// Starts the game server and sets up the necessary files
// and services
//
// Author: Hussein Parpia


// Files and services needed for game
require('./server/DatabaseManager');

var AssetManager = require()
var GamePlay = require('./server/GamePlay');

var mongojs = require("mongojs");
var express = require('express');
var app = express();
var serv = require('http').Server(app);

// Set up the database;
DatabaseManager();




// db handles the read and write to database using mongojs
var collections = ['user', 'asset', 'level', 'inventory', 'leaderboard'];
var db = mongojs('localhost:27017/apoRun', collections);

let assetManager = new AssetManager(db);

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

//PORT from the server host 
serv.listen(process.env.PORT || 8080);
console.log('Server started');

var DEBUG = true;

var SOCKET_LIST = {};


//------ User login functions
var isValidPassword = function(data, cb) {
	db.user.find({username:data.username, password:data.password}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

var isUsernameTaken = function(data, cb) {
	db.user.find({username:data.username}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

var addUser = function(data, cb) {
	db.user.insert({username:data.username, password:data.password}, function(err) {
		cb();
	});
}

var updatePassword = function(data, cb) {

	db.user.findAndModify({
		query: { username: data.username},
		update: { $set: {password: data.password }},
		new: true
	}, function(err, res) {
		// check if the password has been updated;
		if (res.password === data.password)
			cb(true);
		else
			cb(false);
	});
}

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
			assetManager: assetManager;
			level: data.level,
			username: currentUser.name,
			socket: data.socket,
		});
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket) {
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	socket.on('signIn',function(data) {
		isValidPassword(data, function(res) {
			if (res) {
				socket.emit('signInResponse', {success:true});

				// Create User once signed In;
				currentUser = User({
					socketID: socket.id,
					username: data.username,
				});
			}
			else {
				socket.emit('signInResponse', {success:false});
			}
		});
	});

	socket.on('signUp',function(data) {
		isUsernameTaken(data, function(res) {
			if(res){
				socket.emit('signUpResponse', {success:false});
			}
			else {
				addUser(data, function() {
					socket.emit('signUpResponse', {success:true}); 
				});
			}		
		});
	});

	socket.on('resetPassword', function(data) {
		// Check if username is valid;
		isUsernameTaken(data, function(res) {
			if (res) {
				updatePassword(data, function(res) {
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
		var myLevel = 1;

		startGame({
			level: myLevel,
			socket: socket,
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

	socket.on('evalServer',function(data) {
		if (!DEBUG)
			return;
		
		var res = eval(data)
		for (var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('evalAnswer', res);
		}

	});
});

// Update player and bullet
setInterval(function() {
},1000/30);
