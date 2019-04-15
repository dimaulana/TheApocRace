/* 	Database Manager

	Initializes the database as well as allows to write, read, modify,
	and delete data to the collections using mongojs;

	Author: Hussein Parpia
*/

// var mongojs = require("mongojs");

var findProcess = require('find-process');
var fs = require('fs');
const mongoose = require('mongoose');
// var environment = require('./server/bin/environment.json');

var environment = fs.readFileSync('server/bin/environment.json');
var jsonObject = JSON.parse(environment);
console.log(jsonObject.name);


var url = jsonObject.name === "dev" ?  "mongodb://localhost/apoRun" : "mongodb+srv://admin:admin@aporun-l1ht9.mongodb.net/apoRun?retryWrites=true";
// var url = 'localhost:27017/apoRun';
var passwordHash = require('password-hash');

//var MongoClient = require('mongodb').MongoClient;
//const collections = ['user', 'asset', 'level', 'inventory', 'leaderboard'];

const assetCollection = [
							{"type": "Texture", "name": "Player", "path": "client/images/playerrun.png"},
							{"type": "Texture", "name": "PlayerJump", "path": "client/images/playerjump.png"},
							{"type": "Texture", "name": "Enemy", "path": "client/images/enemyrun.png"},
							{"type": "Texture", "name": "EnemyJump", "path": "client/images/enemyjump.png"},
							{"type" : "Texture", "name": "Minion", "path": "client/images/minionenemyrun.png"},
							{"type" : "Texture", "name": "MinionJump", "path": "client/images/minionenemyjump.png"},
							{"type" : "Texture", "name": "Boss1", "path": "client/images/boss1.png"},
							{"type" : "Texture", "name": "Boss2", "path": "client/images/boss2.png"},
							{"type": "Texture", "name": "Tile1", "path": "/client/images/tile1.png"},
							{"type": "Texture", "name": "Tile2", "path": "/client/images/tile2.png"},
							{"type": "Texture", "name": "Tile3", "path": "/client/images/tile3.png"},
							{"type": "Texture", "name": "Tile4", "path": "/client/images/tile4.png"},
							{"type": "Texture", "name": "Coin", "path": "/client/images/coins.png"},
							{"type": "Texture", "name": "Health", "path": "/client/images/healthPack.png"},
							{"type": "Texture", "name": "NewYork", "path": "/client/images/NewYork001.png"},
							{"type": "Texture", "name": "LosAngeles", "path": "/client/images/LosAngeles.png"},
							{"type": "Texture", "name": "Florida", "path": "/client/images/Florida.png"},
							{"type": "Texture", "name": "Bullet", "path": "/client/images/bullets.png"},
							{"type": "Texture", "name": "Laser", "path": "/client/images/laser.png"},
							{"type": "Font", "name": "Helvetica", "path": "client/fonts/helvetica.ttf"},
							{"type": "Sound", "name": "StoryMode", "path": "client/sound/background.mp3"}
						];

/* This manages the creation of database schema
   Creates models that are used in our game;
*/

mongoose.connect(url, {useNewUrlParser: true}, function(err){
	if(err){
		console.log("cannot connect to local database using url-", url , "\nPlease ensure you have a mongodb process running.");
	}
});

const db = mongoose.connection;

let Schema = mongoose.Schema;


// User schema;
const userShema = new Schema({
	username: String,
	password: String
});

// Asset schema;
const assetSchema = new Schema({
	type: String,
	name: String,
	path: String
});

// Level Schema;
const levelSchema = new Schema({
	tileMap: Array,
	levelName: String,
	user: String
});

// Leaderboard Schema;
const LeaderboardSchema = new Schema({
	user: String,
	topScore: Number,
})

// Setting up models;
let User = mongoose.model('user', userShema);
let Asset = mongoose.model('asset', assetSchema);
let Level = mongoose.model('level', levelSchema);
let Leaderboard = mongoose.model('leaderboard', LeaderboardSchema);

// TODO: This inserts data multiple times; need fix
//Database manager used to insert assets in our db;
DatabaseManager = function (cb) {
	for (var i = 0; i < assetCollection.length; i++) {
		var asset = new Asset(assetCollection[i]);
		asset.save(function(err, a){
			if (err) throw err;
		})
	};
	cb();
};


// Database functions which handle the writing, reading, deleting and modifying of
// data in the database using mongoose;
Database = {};

//------ User adding and modifying functions --------;
Database.isValidPassword = function(data, cb) {
	User.findOne({username:data.username}, function(err, res) {
		if (res){
			var storedHash = res.password;
			if(passwordHash.verify(data.password, storedHash)){
				cb(true);
			}
			else {
				cb(false);
			}
		}
		else {
			cb(false);
		}
	});
}

Database.isUsernameTaken = function(data, cb) {
	User.findOne({username:data.username}, function(err, res) {
		if (res)
			cb(true);
		else
			cb(false);
	});
}

Database.addUser = function(data, cb) {
	var user = new User({username: data.username, password: data.hashedPassword});
	user.save(function(err) {
		if(err) throw err;
		cb();
	});
}


Database.updatePassword = function(data, cb) {
	var hashedPassword = passwordHash.generate(data.password);
	User.findOneAndUpdate(
		{ username: data.username},
		{ $set: {password: hashedPassword }},
		{new: true},
		function(err, res) {
			// check if the password has been updated;
			if (res.password === hashedPassword)
				cb(true);
			else
				cb(false);
		});
}

//--------- Asset functions -----------------------------;
Database.getAsset = function(data, cb) {
	Asset.findOne({name: data.name}, function(err, res) {
		if (res)
			cb(res);
		else
			cb();
	});
}

Database.getAllAssets = function(cb) {
	Asset.find(function(err, res) {
		if (res)
			cb(res);
		else
			cb();
	});
}

//--------- Level functions ---------------------------;
Database.writeToDatabase = function(data){
	// Check for user specific level names;
	Level.findOne({levelName: data.levelName, user: data.user}, function(err, res) {
		if (res) {
			// Level exists, then update tileMap;
			Level.findOneAndUpdate(
				{levelName: data.levelName, user: data.user}, // user specific level names;
				{$set: {tileMap: data.tileMap }},
				{new: true},
				function(err, res) {
				// TODO: Check if the level was updated properly;
				});
		}
		else { // Insert new level data;
			var level = new Level({tileMap: data.tileMap, levelName: data.levelName, user: data.user});
			level.save(function(err) {
				if(err) throw err;
			});
		}
	});
}

Database.readFromDatabase = function(data, cb){
	// Get user specific levels;
	Level.findOne({levelName : data.levelName, user: data.user}, function(err, res){
		if(res){
			cb(res);
		}
		else
			cb();
	});
}

// Get the names of user made levels;
Database.getUserLevelNames = function(username, cb){
	Level.find({user: username}, function(err, res){
		if(res){
			var levelNames = new Array();
			for(var i = 0; i < res.length; i++)
			{
				levelNames.push(res[i].levelName);
			}
			// console.log(res);
			cb(levelNames);
		}
		else
			cb();
	});
}

Database.readLevelsForStoryMode = function(cb){
	Level.find({levelName : {$regex: /story/}}, function(err, res){
		if(res)
		{
			var storyLevels = new Array();
			for(var i = 0; i < res.length; i++)
			{
				storyLevels.push(res[i].levelName);
			}
			cb(storyLevels);
		}
		else
			cb();
	});
}

//--------------- Leaderboard functions ----------------------
Database.recordUserScore = function(data) {
	Leaderboard.findOne({user: data.user}, function(err, res) {
		if (res) {
			Leaderboard.findOneAndUpdate(
				{user: data.user},
				{$set: {topScore: data.score}},
				{new: true},
				function(err, res) {
					if (err) throw err;
				}
			)
		}
		else {
			var leader = new Leaderboard({user: data.user, topScore: data.score});
			leader.save(function(err){
				if(err) throw err;
			});
		}
	})
}

Database.getLeaderboards = function(cb) {
	Leaderboard.find(function(err, res){
		if (res)
			cb(res);
		else
			cb();s
	})
}


