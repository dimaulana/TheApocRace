/* 	Database Manager
	
	Initializes the database as well as allows to write, read, modify,
	and delete data to the collections using mongojs;

	Author: Hussein Parpia
*/


var mongojs = require("mongojs");
var url = 'localhost:27017/apoRun';
var MongoClient = require('mongodb').MongoClient;

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


/* This function manages the creation of database for a every new user
   Creates collections that are used in our game.
   Also inserts the asset collection to the database;
*/

DatabaseManager = function () {
	this.url = "mongodb://" + url;

	MongoClient.connect(this.url, async function(err, db) {
		if (err) throw err;

		// Create collections
		collections.forEach(async function(col) {
			let res = await db.createCollection(col);
			console.log(res.collectionName, " - Collection created");
		});

		// Inserting the asset collection pre hand to the database;
		await db.collection('asset').insertMany(assetCollection);

		// Close database after write
		db.close();

	});

};


// Database functions which handle the writing, reading, deleting and modifying of
// data in the database using mongojs

// db handles the read and write to database using mongojs
var db = mongojs(url, collections);
Database = {};

//------ User adding and modifying functions --------;
Database.isValidPassword = function(data, cb) {
	db.user.find({username:data.username, password:data.password}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

Database.isUsernameTaken = function(data, cb) {
	db.user.find({username:data.username}, function(err, res) {
		if (res.length > 0)
			cb(true);
		else
			cb(false);

	});
}

Database.addUser = function(data, cb) {
	db.user.insert({username:data.username, password:data.password}, function(err) {
		cb();
	});
}

Database.updatePassword = function(data, cb) {

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

//--------- Asset functions -----------------------------;
Database.getAsset = function(data, cb) {
	db.asset.findOne({name: data.name}, function(err, res) {
		if (res)
			cb(res);
		else
			cb();
	});
}

Database.getAllAssets = function(cb) {
	db.asset.find(function(err, res) {
		if (res)
			cb(res);
		else
			cb();
	});
}

