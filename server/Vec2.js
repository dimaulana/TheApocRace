class Vec2{

	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	add(vec){
		this.x += vec.x;
		this.y += vec.y;

		return this;
	}

	subtract(vec){
		this.x -= vec.x;
		this.y -= vec.y;
	}

	multiply(val){
		this.x *= val;
		this.y *= val;
	}

	divide(val){
		this.x /= val;
		this.y /= val;
	}

	equals(vec){
		return this.x == vec.x && this.y == vec.y;
	}

	notEquals(vec){
		return !(this.x == vec.x && this.y == vec.y);	
	}

	abs(){
		this.x < 0 ? -(this.x) : this.x;
		this.y < 0 ? -(this.y) : this.y; 
	}

	distance(vec){
		return Math.sqrt((this.x - vec.x)*(this.x - vec.x) + (this.y - vec.y)*(this.y - vec.y));
	}
}

module.exports = Vec2;