var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var Img = {};
Img.player = new Image();
Img.player.src = "/client/images/player.png";
var ctx = document.getElementById("game").getContext("2d");

testCollisionRectRect = function(rect1,rect2){
	return rect1.x <= rect2.x+rect2.width 
		&& rect2.x <= rect1.x+rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

Player = function(){
	var self = {
		x:50,
		y: 600,
		hp: 0,
		width: 30,
		height: 5,
		img: 'client/images/player.png'
	}

	self.draw = function(){
		// ctx.save();
		var x = self.x-self.width/2;
		var y = self.y-self.height/2;
		// var image = getImage(self.img);
		ctx.drawImage(Img.player,x,y);
		//ctx.restore();
	}
	return self;
}

function getImage(imageName) {
  var x = document.createElement("IMG");
  x.setAttribute("src", imageName);
  x.setAttribute("width", "50");
  x.setAttribute("height", "50");

  return x;
}

startNewGame = function(player){
	$(".star").hide();
	$('#game').show();
	player.hp = 10;
	timeWhenGameStarted = Date.now();
	frameCount = 0;
	score = 0;
	player.draw();
}

Entity = function(type,id,x,y,spdX,spdY,width,height,img){
	var self = {
		type:type,
		id:id,
		x:x,
		y:y,
		spdX:spdX,
		spdY:spdY,
		width:width,
		height:height,
		img:img,
	};
	self.update = function(){
		self.updatePosition();
		self.draw();
	}
	self.draw = function(){
		ctx.save();
		var x = self.x-self.width/2;
		var y = self.y-self.height/2;
		ctx.drawImage(self.img,x,y);
		ctx.restore();
	}
	self.getDistance = function(entity2){	//return distance (number)
		var vx = self.x - entity2.x;
		var vy = self.y - entity2.y;
		return Math.sqrt(vx*vx+vy*vy);
	}

	self.testCollision = function(entity2){	//return if colliding (true/false)
		var rect1 = {
			x:self.x-self.width/2,
			y:self.y-self.height/2,
			width:self.width,
			height:self.height,
		}
		var rect2 = {
			x:entity2.x-entity2.width/2,
			y:entity2.y-entity2.height/2,
			width:entity2.width,
			height:entity2.height,
		}
		return testCollisionRectRect(rect1,rect2);
		
	}
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
				
		if(self.x < 0 || self.x > WIDTH){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > HEIGHT){
			self.spdY = -self.spdY;
		}
	}
	
	return self;
}

Actor = function(type,id,x,y,spdX,spdY,width,height,img,hp,atkSpd){
	var self = Entity(type,id,x,y,spdX,spdY,width,height,img);
	
	self.hp = hp;
	self.atkSpd = atkSpd;
	self.attackCounter = 0;
	self.aimAngle = 0;

	return self;
}
