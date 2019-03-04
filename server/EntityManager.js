var Entity = require('./Entity');

class EntityManager {

	constructor(){
		this.entities = new Array();
		this.mapOfEntities = new Map();
	}
	
	update(){
		//TODO
	}

	addEntity(name){
		var entity = new Entity(name);
		this.entities.push(entity);
	}

	getEntities(){
		return this.entities;
	}

	getEntitiesByTag(tag){
		var entityWithTag =  this.entities.filter(function(e) {
			return e.tag == tag;
	});
		return entityWithTag;
	}
};

module.exports = EntityManager;

// Test Code working 100: keep it here until we have tested with front end. This serves as sample for people 
// to refer to.

// var entityManager = new EntityManager();
// entityManager.addEntity("user");
// entityManager.addEntity("enemy");

// console.log(entityManager.getEntities());

// console.log(entityManager.getEntitiesByTag('user'));