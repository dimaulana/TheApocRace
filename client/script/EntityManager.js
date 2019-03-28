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
	
	self.image = new Image();
	self.image.src = self.properties.fileLocation;

	if (self.tag == "Player" || self.tag == "Enemy") {
		self.animation = new Animation();
	}

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

	self.addEntity = function(entity) {
		self.entities.push(entity);
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

	return self;
}