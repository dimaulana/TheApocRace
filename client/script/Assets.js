/*
    This file contains all the assets such as tile, sound etc. that are used 
    inside Game.js
*/

// Tile object takes the tile image source and location {x: , y: } of the tile;
function Tile(imageSource, location) {
	this.tileImage = new Image();
	this.tileImage.src = imageSource;

	this.width = 30;
	this.height = 41;

	this.x = location.x;
	this.y = location.y;

    this.prev_x = this.x;
	this.prev_y = this.y;

	this.draw = function() {
		ctx.drawImage(this.tileImage,this.x - viewport.x, this.y - viewport.y);
	}

	this.update = function() {
		// this.prevX = this.x;
		// if (player.x === canvas.width/2)
		// 	this.x -= player.speedX;
	}
}

// Level class that loads the level assets;
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
                case "Tile1":
                case "Tile2":
                case "Tile3":
                    obstacles.push(new Tile(data.assetLocation[type], { x: levelData[i]['x'], y: levelData[i]['y'] }));
                    break;
                case "Sound":
                    var sound = new Sound(data.assetLocation.Sound);
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