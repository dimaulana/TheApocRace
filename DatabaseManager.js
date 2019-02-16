// Database Manager
// This class manages the creation of database for a every new user
// Creates collections that are used in our database.
//
// Author: Hussein Parpia
//

var MongoClient = require('mongodb').MongoClient;

DatabaseManager = function () {
	this.url = "mongodb://localhost:27017/apoRun";
	this.collections = ['user', 'asset'];

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

//DatabaseManager();

