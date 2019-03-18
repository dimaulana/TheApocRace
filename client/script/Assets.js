// Tile object takes the tile image source and location {x: , y: } of the tile;
function Tile(imageSource, location) {
	this.tileImage = new Image();
	this.tileImage.src = imageSource;

	this.width = 30;
	this.height = 41;

	this.x = location.x;
	this.y = location.y;

	this.prevX = 0;
	this.prevY = this.y;

	this.draw = function() {
		ctx.drawImage(this.tileImage,this.x, this.y);
	}

	this.update = function() {
		this.prevX = this.x;
		if (player.x === canvas.width/2)
			this.x -= player.speedX;
	}
}

// Level function that helps in creating 
Level = function(data){
	var self = {
		levelName: data.levelName,
		fileLocation: data.fileLocation,
		levelData: data.levelData,
		tileFile: data.tileFile
    }
    
    self.loadLevel = function(){
        var tiles = self.levelData;
		for (var i = 0; i < tiles.length; i++) {
			obstacles.push(new Tile(self.tileFile, { x: tiles[i]['x'], y: tiles[i]['y'] } ));
		}
    }

	return self;
}

//Sound function that helps play sound
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;

	this.sound.setAttribute("storyMode", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}