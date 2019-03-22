/* 	Database Manager
	
	Initializes the database as well as allows to write, read, modify,
	and delete data to the collections using mongojs;

	Author: Hussein Parpia
*/


var mongojs = require("mongojs");


// This function manages the creation of database for a every new user
// Creates collections that are used in our database.
var MongoClient = require('mongodb').MongoClient;

DatabaseManager = function () {
	this.url = "mongodb://localhost:27017/apoRun";
	this.collections = ['user', 'asset', 'level', 'inventory', 'leaderboard'];

	MongoClient.connect(this.url, async function(err, db) {
		if (err) throw err;

		// Create collections
		let res = await db.createCollection('user');
		console.log(res.collectionName, " - Collection created");

		res = await db.createCollection('asset');
		console.log(res.collectionName, " - Collection created");

		res = await db.createCollection('level');
		console.log(res.collectionName, " - Collection created");

		res = await db.createCollection('inventory');
		console.log(res.collectionName, " - Collection created");

		res = await db.createCollection('leaderboard');
		console.log(res.collectionName, " - Collection created");

		// Close database after write
		db.close();

	});
}

// Database functions which handle the writing, reading, deleting and modifying of
// data in the database using mongojs

// db handles the read and write to database using mongojs
var collections = ['user', 'asset', 'level', 'inventory', 'leaderboard'];
var db = mongojs('localhost:27017/apoRun', collections);

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

// TODO: Make a function to set up the asset collection in the beginning;
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

