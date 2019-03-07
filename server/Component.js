var Vec2 = require('./Vec2')

class Component{
	
	constructor(){
	
	}	
}

class Transform extends Component{
	
	constructor(){
		super();
		this.pos = new Vec2(0.0, 0.0);
		this.prevPos = new Vec2(0.0, 0.0);
		this.scale = new Vec2(1.0, 1.0);
		this.speed = new Vec2(0.0, 0.0);
		this.angle = 0;
	}
}

class LifeSpan extends Component{

	constructor(){
		super();
		this.clock = new Date();
		this.lifeSpan = 0;
	}
}

class Stats extends Component{

	constructor(){
		super();
		this.alive = true;
		this.score = 0;
		this.hp = 0;
		this.lives = 3;
	}
}

class Input extends Component{

	constructor(){
		super();
		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
		this.shoot = false;
		this.jump = false;
		this.canShoot = true;
	}
}

module.exports = {
	Component: Component,
	Transform: Transform,
	LifeSpan: LifeSpan,
	Stats: Stats,
	Input: Input
}