var mongojs = require("mongojs");
// NOTE: Our db run for now is apoRun
var db = mongojs('localhost:27017/apoRun', ['account', 'progress']);

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

//PORT from the server host 
serv.listen(process.env.PORT || 8080);
console.log('Server started');

var DEBUG = true;

var SOCKET_LIST = {};

var isValidPassword = function(data, cb) {
	db.account.find({username:data.username, password:data.password}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

var isUsernameTaken = function(data, cb) {
	db.account.find({username:data.username}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

var addUser = function(data, cb) {
	db.account.insert({username:data.username, password:data.password}, function(err) {
		cb();
	});
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket) {
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	socket.on('signIn',function(data) {
		isValidPassword(data, function(res) {
			if (res) {
				//Player.onConnect(socket);
				socket.emit('signInResponse', {success:true});
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

	})
});

// Update player and bullet
setInterval(function() {
},1000/25);