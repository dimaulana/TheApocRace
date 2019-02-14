// Database Manager
// This class manages the creation of database for a every new user
// Creates collections that are used in our database.
//
// Author: Hussein Parpia
//

var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";

DatabaseManager = function () {
	this.url = "mongodb://localhost:27017/apoRun";
	this.collections = ['user', 'asset'];

	// Create database;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		
		// Checks which collection needs to be created;
		console.log("Here0");
		var toCreate = this.collectionsToCreate(db);
		console.log("To be created: ", toCreate);
		for (var i in toCreate) {
			console.log("Here2");
			db.createCollection(toCreate[i], function(err, res) {
				if (err) throw err;
				console.log(toCreate[i]," - Collection created!");
			});
		}
		
		// Close database after write
		db.close();
		
	});

	this.collectionsToCreate = function(db) {

			var toCreate = new Array();
			// Check if the collections already exists.
			db.listCollections().toArray(function(err, collInfos) {

				console.log("Here1");
				for (var i in this.collections) {

					var collectionExists = collInfos.find(function (col) {
						return col.name == this.collections[i];
					});

					if (collectionExists == null) {
						// Create collection if it doesn't already exists.
						toCreate.push(this.collections[i]);
						console.log(this.collections[i]);
					}
				}
				
			});
			console.log("To create: ", toCreate);
			return toCreate;
		}

	
	
}

DatabaseManager();

