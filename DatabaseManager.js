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

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;

		db.listCollections().toArray(function(err, collInfos) {
			if (err) throw err;

			for (var i in this.collections) {

				var collectionExists = collInfos.find(function (col) {
					return col.name == this.collections[i];
				});

				if (collectionExists == null) {
					// Create collection if it doesn't already exists.
					db.createCollection(this.collections[i], function(err, res) {
						if (err) {
							console.log("Nothing here", err);
							throw err;
						}
						console.log(this.collections[i]," - Collection created!");
					});
				}
			}
			
		});
		db.close();
	});
}

DatabaseManager();

