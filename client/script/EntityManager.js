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

	if (self.tag == "Player" || self.tag == "Enemy" || self.tag == "Bullet") {
		self.animation = new Animation();
	}
	if (self.tag == "Background") self.frame = 0;

	self.changeAnimation = function(param) {
		if (!self.animation) return;
		var delay = 5;
		var frame_sets;

		if (param.state === "run") {
			frame_sets = self.properties.frame_sets;
			self.image.src = self.properties.fileLocation;
		}
		else if (param.state === "jump") {
			frame_sets = self.properties.jump_sets;
			self.image.src = self.properties.jumpImage;
		}
		else {
			frame_sets = self.properties.frame_sets;
		}

		self.animation.change(frame_sets[param.index], delay);
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
		});
		return entity;
	}

	self.getEntitiesByTag = function(tag) {
		var entities = self.entities.filter(function(e) {
			return e.properties.tag == tag;
		});
		return entities;
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