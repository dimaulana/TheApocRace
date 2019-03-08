var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var Img = {};
Img.player = new Image();
Img.player.src = "/client/images/character.png";
var ctx = document.getElementById("game").getContext("2d");

testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x+rect2.width 
		&& rect2.x <= rect1.x+rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

Player = function(param){

	var self = {
		socket: param.socket,
		x: param.x,
		y: param.y,
		speed: param.speed,
		hp: param.hp,
		score :param.score,
		width: param.width,
		height :param.height,
		pos: param.pos,
		prevPos :param.prevPos,
		alive: param.alive,
		angle :param.angle,
		img: 'client/images/character.png',
	}
	// might get a better idea, keeping it here.

	// self.speed = param.speed;
	// self.hp = param.hp;
	// self.score = param.score;
	// self.width = param.width,
	// self.height = param.height,
	// self.pos = param.pos,
	// self.prevPos = param.prevPos,
	// self.alive = param.alive,
	// self.angle = param.angle,
	// self.img = 'client/images/player.png',
	
	self.update = function(){
		self.updateSpeed();
		
		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		}
	}
	self.shootBullet = function(angle){
		if(Math.random() < 0.1)
			self.inventory.addItem("potion",1);
		Bullet({
			parent:self.id,
			angle:angle,
			x:self.x,
			y:self.y,
		});
	}
	
	self.updateSpeed = function(){
		if(self.pressingRight)
			self.spdX = self.maxSpd;
		else if(self.pressingLeft)
			self.spdX = -self.maxSpd;
		else
			self.spdX = 0;
		
		if(self.pressingUp)
			self.spdY = -self.maxSpd;
		else if(self.pressingDown)
			self.spdY = self.maxSpd;
		else
			self.spdY = 0;		
	}
	
	self.draw = function(player){
		var x = self.x-self.width/2;
		var y = self.y-self.height/2;
		ctx.drawImage(Img.player,x,y);
	}
	
	Player.list[self.id] = self;
	
	return self;
}
Player.list = {}


function getImage(imageName) {
  var x = document.createElement("IMG");
  x.setAttribute("src", imageName);
  x.setAttribute("width", "50");
  x.setAttribute("height", "50");

  return x;
}

startNewGame = function(){
	$(".star").hide();
	$('#game').show();

	var player;
	socket.emit('storyMode', {});

	var param ={
		socket: self.socket,
		x: 50,
		y:600,
		speed: 10,
		hp: 10,
		score :10,
		width: 10,
		height :10,
		pos: 10,
		prevPos :10,
		alive: 10,
		angle :10,
	}

	socket.on('initPack', function(data) {
		player = new Player(param);
	}); 
	
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	player.draw();
} 






