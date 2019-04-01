var Vec2 = require('./Vec2');
const components = require('./ComponentEnum.js');

class Component{
	
	constructor() {}

	ofType(type) {
		switch(type) {
			case components.TRANSFORM:
				return (this instanceof Transform);

			case components.GRAVITY:
				return (this instanceof Gravity);

			case components.LIFESPAN:
				return (this instanceof Lifespan);

			case components.STATS:
				return (this instanceof Stats);

			case components.INPUT:
				return (this instanceof Input);

			case components.DIMENSION:
				return (this instanceof Dimension);

			case components.FOLLOWPLAYER:
				return (this instanceof FollowPlayer);

			case components.PATROL:
				return (this instanceof Patrol);

			case components.SPRITE:
				return (this instanceof Sprite);

			case components.WEAPON:
				return (this instanceof Weapon);

			default:
				console.log("Type: ", type , " not found");
				return false;
		}
    }
}

class Transform extends Component{
	
	constructor(param){
		super();
		this.pos = new Vec2(param.x, param.y);
		this.prevPos = new Vec2(param.x, param.y);
		this.scale = new Vec2(1.0, 1.0);
		this.speed = new Vec2(0.0, 0.0);
		this.speedMax = (param.speedMax) ? param.speedMax : 10;
		this.angle = 0;
		this.state = "standing";
	}
}

class Gravity extends Component {
	constructor() {
		super();
		this.gravity = -3.75;
	}
}

class Dimension extends Component {
	constructor(param) {
		super();
		this.width = param.w;
		this.height = param.h;
	}
}

class Lifespan extends Component{

	constructor(){
		super();
		this.clock = new Date();
		this.lifespan = 0;
	}
}

class Stats extends Component{

	constructor(){
		super();
		this.alive = true;
		this.score = 0;
		this.hp = 10;
		this.lives = 3;
	}
}

class Input extends Component{

	constructor(){
		super();
		//this.up = false;
		//this.down = false;
		this.left = false;
		this.right = false;
		this.shoot = false;
		this.jump = false;
		this.canShoot = true;
	}
} 

class FollowPlayer extends Component {
	constructor(s) {
		super();
		this.followSpeed = s;
	}
}

class Patrol extends Component {
	constructor(param) {
		super();
		this.patrolSpeed = param.speed;
		this.positions = param.pos; // TODO: Get current pos and an addition to that;
	}
}

// To keep the file location of the entity;
class Sprite extends Component {
	constructor(param) {
		super();
		this.location = param.loc;
		
		if (param.frame_sets) {
			this.frame_sets = param.frame_sets;
		}
		if (param.jumpLoc) {
			this.jumpLoc = param.jumpLoc;
			this.jump_sets = [[0], [5], [1,2,3,4], [6,7,8,9]];
		}
	}
}

class Weapon extends Component {
	constructor(param) {
		super();
		this.clock = 0;
		this.name = "normal";
		this.map = {"normal": 20}; // Can update coolDown based on this map;
		this.coolDown = 20;
		this.imageLoc = param.loc;
	}
}

module.exports = {
	Component: Component,
	Transform: Transform,
	Lifespan: Lifespan,
	Stats: Stats,
	Input: Input,
	Dimension: Dimension,
	FollowPlayer: FollowPlayer,
	Patrol: Patrol,
	Sprite: Sprite,
	Gravity: Gravity,
	Weapon: Weapon,
}