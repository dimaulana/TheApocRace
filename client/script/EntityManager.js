/*	EntityManager.js has 2 classes which are Entity and
	EntityManager which handles the entities;

	Contributor: Hussein Parpia;
*/

// Load Animation class
var script = document.createElement('script');
script.src = 'client/script/Animation.js';
document.head.appendChild(script);

// Class to save the entity properties;
function Entity(param) {
	var self = {};
	self.tag = param.tag;
	self.properties = param;

	if (!self.properties.id) {
		self.properties.id = Math.random().toString(36).substr(2, 9);
	}
	
	self.image = new Image();
	self.image.src = self.properties.fileLocation;

	if (self.tag == "Player" || self.tag == "Enemy" || self.tag == "Background") {
		self.animation = new Animation();
	}
	if (self.tag == "Background") self.frame = 0;

	self.changeAnimation = function(index) {
		if (!self.animation) return;
		var delay = 5;
		self.animation.change(self.properties.frame_sets[index], delay);
	}


	return self;
}

// Class to handle the entities and their basic functions;
function EntityManager() {
	var self = {};
	self.entities = [];
	self.entitiesToAdd = [];

	self.addEntity = function(param) {
		var entity = new Entity(param);
		self.entitiesToAdd.push(entity);
		return entity;
	}

	self.getEntities = function() {
		return self.entities;
	}

	self.getEntityByTag = function(tag) {
		var entity = self.entities.find(function(e) {
			return e.properties.tag == tag;
		})
		return entity;
	}

	self.update = function() {
		// Add new entities to the main entities array;
		self.entitiesToAdd.forEach(function(e) {
			self.entities.push(e);
		});
		self.entitiesToAdd = []; // clear entitiesToAdd;

		// Check for dead entities;
		var toRemove = [];
		self.entities.forEach(function(e) {
			if (e.properties.alive == null) return;

			if (e.properties.alive == false) {
				toRemove.push(e);
			}
		});

		toRemove.forEach(function(e) {
			self.removeEntity(e);
		});
	}

	// Remove dead entities;
	self.removeEntity = function(entity) {
		self.entities.splice( self.entities.indexOf(entity), 1);
		delete entity;
	}

	self.removeAllEntities = function(){
		self.entities = [];
	}

	return self;
}