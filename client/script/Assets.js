/*
    This file contains all the assets such as tile, sound etc. that are used 
    inside Game.js
*/

const AssetEnum ={
    TILE: "Tile",
    STAR: "Star"
}



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
    console.log(this.tileImage);

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
		levelName: data.name,
		levelFile: data.file,
		levelData: data.data,
		assetLocation: data.assetLocation
    }
    
    self.loadLevel = function(data){
        var levelData = data.data;
		for (var i = 0; i < levelData.length; i++) {
            var type = levelData[i]["type"];
            switch(type){
                case "Tile":
                    obstacles.push(new Tile(data.assetLocation, { x: levelData[i]['x'], y: levelData[i]['y'] }));
                    break;
                case "Sound":
                    var sound = new Sound(data.assetLocation);
                    console.log(sound);
                    sound.play();
                    break; 
                default:
                    console.log("could not find the type: " + type);
                    break;       

            }
		}
    }

	return self;
}

//Sound function that helps play sound
function Sound(src) {
    console.log(src);
    
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