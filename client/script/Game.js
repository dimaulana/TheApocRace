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

var player;
var gameStarted;
Player = function(param){

	var self = {
		socket: param.socket,
		x: param.x,
		y: param.y,
		speed: param.speed,
		speedMax: param.speedMax,
		hp: param.hp,
		score :param.score,
		width: param.width,
		height: param.height,
		pos: param.pos,
		prevPos: param.prevPos,
		alive: param.alive,
		angle: param.angle,
		right: false,
		keyLeft: false,
		up:  false,
		down: false,
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
		console.log("HERE");
		self.updateSpeed();
		/*
		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		
		}*/
		self.x+=self.speed;
		self.y+=self.speed;
		console.log(self.x + " " + self.y);
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
		console.log("WHEREWHUIRHUEIW");
		if(self.right)
			self.speed = self.speedMax;
		else if(self.keyLeft)
			self.speed = -self.speedMax;
		else
			self.spdX = 0;
		
		if(self.up)
			self.speed = -self.speedMax;
		else if(self.down)
			self.speed = self.speedMax;
		else
			self.spdY = 0;		
	}
	
	self.draw = function(player){
		ctx.clearRect(0, 0, 1280, 720);
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


// Controls WASD works after adding input component 
document.onkeydown = function(event){
	if(event.keyCode === 68)	//d
		player.right = true;
	else if(event.keyCode === 83)	//s
		player.down = true;
	else if(event.keyCode === 65) {} //a
		//player.keyLeft = true;
	else if(event.keyCode === 87) // w
		player.up = true;
	/*
	else if(event.keyCode === 80) //p
		paused = !paused;
	*/
}

document.onkeyup = function(event){
	if(event.keyCode === 68)	//d
		player.right = false;
		//player.updateSpeed();
	else if(event.keyCode === 83)	//s
		player.down = false;
	else if(event.keyCode === 65) {} //a
		//player.keyLeft = false;
	else if(event.keyCode === 87) // w
		player.up = false;
}

var update=function(){
	console.log("GAME UPDATE")
	if (!gameStarted) return;
	player.update();
	
}


startNewGame = function(){
	$(".star").hide();
	$('#game').show();

	
	socket.emit('storyMode', {});

	var param ={
		socket: self.socket,
		x: 50,
		y:500,
		speed: 0,
		speedMax: 5,
		hp: 10,
		score: 10,
		width: 500,
		height: 500,
		pos: 10,
		prevPos :10,
		alive: 10,
		angle :10,
	}
	player = new Player(param);

	socket.on('initPack', function(data) {
	}); 
	
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	console.log("before draw");
	player.draw();
	gameStarted = true;
	console.log("after draw");

} 

setInterval(update(),40);






