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