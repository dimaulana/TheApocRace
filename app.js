//var mongojs = require("mongojs");
//var db = mongojs('localhost:27017/myGame', ['account', 'progress']);

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

var isValidPassword = function(data, cb) {
	// TODO: Make use of db
	return cb(true);
	db.account.find({username:data.username, password:data.password}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

var isUsernameTaken = function(data, cb) {
	return cb(false);
	db.account.find({username:data.username}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

var addUser = function(data, cb) {
	return cb();
	db.account.insert({username:data.username, password:data.password}, function(err) {
		cb();
	});
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection',function(socket) {
	console.log("Connected");
});

setInterval(function() {
},1000/25);