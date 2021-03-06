/*
    This file contains all the assets such as tile, sound etc. that are used 
    inside Game.js
*/

// Level class that loads the level assets;
/** DEPRACATED
Level = function(data){
	var self = {
		levelName: data.name,
		levelFile: data.file,
		levelData: data.data,
    }

    self.loadLevel = function(){
    	for (var i = 0; i < self.levelData.length; i++) {
    		
    		if (self.levelData[i].tag == "Sound") {
    			backgroundSound = new Sound(self.levelData[i].fileLocation);
    			continue;
    		}
    		//var e = new Entity(self.levelData[i]);
    		entityManager.addEntity(self.levelData[i]);
    	}
    	return;
    }

	return self;
}
**/

//Sound function that helps play sound
function Sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;

	// TODO: Get the sound mode from the level file;
	this.sound.setAttribute("storyMode", "none");
	this.sound.style.display = "none";
	this.sound.loop=true;
	document.body.appendChild(this.sound);

	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}