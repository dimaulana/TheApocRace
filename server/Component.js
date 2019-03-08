var Vec2 = require('./Vec2')

class Component{
	
	constructor() {}

	ofType(type) {
		switch(type) {
			case "Transform":
				return (this instanceof Transform);

			case "Lifespan":
				return (this instanceof Lifespan);

			case "Stats":
				return (this instanceof Stats);

			case "Input":
				return (this instanceof Input);

			case "Dimension":
				return (this instanceof Dimension);

			default:
				console.log("Type: ", type , " not found");
				return false;
		}

    }

}


class Transform extends Component{
	
	constructor(){
		super();
		this.pos = new Vec2(50, 500);
		this.prevPos = new Vec2(0.0, 0.0);
		this.scale = new Vec2(1.0, 1.0);
		this.speed = new Vec2(0.0, 0.0);
		this.speedMax = 10;
		this.angle = 0;
	}
}

class Dimension extends Component {
	constructor() {
		super();
		this.width = 95;
		this.height = 130;
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
	Lifespan: Lifespan,
	Stats: Stats,
	Input: Input,
	Dimension: Dimension
}