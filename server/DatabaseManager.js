/* 	Database Manager

	Initializes the database as well as allows to write, read, modify,
	and delete data to the collections using mongojs;

	Author: Hussein Parpia
*/


/**  -------------- DEPRACATED --------------------------

// var mongojs = require("mongojs");
// var url = 'localhost:27017/apoRun';
// var MongoClient = require('mongodb').MongoClient;
const collections = ['user', 'asset', 'level', 'inventory', 'leaderboard'];

const assetCollection = [
							{"type": "Texture", "name": "Player", "path": "client/images/playerrun.png"},
							{"type": "Texture", "name": "PlayerJump", "path": "client/images/playerjump.png"},
							{"type": "Texture", "name": "Enemy", "path": "client/images/enemyrun.png"},
							{"type": "Texture", "name": "EnemyJump", "path": "client/images/enemyjump.png"},
							{"type" : "Texture", "name": "Minion", "path": "client/images/minionenemyrun.png"},
							{"type" : "Texture", "name": "MinionJump", "path": "client/images/minionenemyjump.png"},
							{"type": "Texture", "name": "Tile1", "path": "/client/images/tile1.png"},
							{"type": "Texture", "name": "Tile2", "path": "/client/images/tile2.png"},
							{"type": "Texture", "name": "Tile3", "path": "/client/images/tile3.png"},
							{"type": "Texture", "name": "Tile4", "path": "/client/images/tile4.png"},
							{"type": "Texture", "name": "Coin", "path": "/client/images/coins.png"},
							{"type": "Texture", "name": "NY1", "path": "/client/images/newyork1.png"},
							{"type": "Texture", "name": "NY2", "path": "/client/images/newyork2.png"},
							{"type": "Texture", "name": "NY3", "path": "/client/images/newyork3.png"},
							{"type": "Texture", "name": "LA1", "path": "/client/images/losAngeles1.png"},
							{"type": "Texture", "name": "LA2", "path": "/client/images/losAngeles2.png"},
							{"type": "Texture", "name": "LA3", "path": "/client/images/losAngeles3.png"},
							{"type": "Texture", "name": "NewYork", "path": "/client/images/NewYork001.png"},
							{"type": "Texture", "name": "LosAngeles", "path": "/client/images/LosAngeles.png"},
							{"type": "Texture", "name": "Bullet", "path": "/client/images/bullets.png"},
							{"type": "Font", "name": "Helvetica", "path": "client/fonts/helvetica.ttf"},
							{"type": "Sound", "name": "StoryMode", "path": "client/sound/background.mp3"}
						];

//Database manager used to insert assets in our db;
DatabaseManager = function () {
	console.log('Connection successful');
	for (var i = 0; i < assetCollection.length; i++) {
		var asset = new Asset(assetCollection[i]);
		asset.save(function(err, a){
			if (err) throw err;
		})
	};
};
-----------------------------------------------------------------------
*/

const mongoose = require('mongoose');
const url = "mongodb+srv://admin:admin@aporun-l1ht9.mongodb.net/apoRun?retryWrites=true";
var passwordHash = require('password-hash');


/* This manages the creation of database schema
   Creates models that are used in our game;
*/
mongoose.connect(url, {useNewUrlParser: true});
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

let User = mongoose.model('user', userShema);
let Asset = mongoose.model('asset', assetSchema);
let Level = mongoose.model('level', levelSchema);



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
	Level.findOne({levelName: data.levelName}, function(err, res){
		if (res) {
			// Level exists, then update tileMap;
			Level.findOneAndUpdate(
				{levelName: data.levelName},
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

Database.readFromDatabase = function(levelName, cb){
	Level.findOne({levelName : levelName}, function(err, res){
		if(res)
			cb(res);
		else
			cb();
	});
}

Database.readLevelBasedOnUser = function(username, cb){
	db.level.find({user: username}, function(err, res){
		if(res){
			var levelNames = new Array();
			for(var i = 0; i < res.length; i++)
			{
				levelNames.push(res[i].levelName);
			}
			console.log(levelNames);
			cb(levelNames);
		}
		else
			cb();
	});
}


