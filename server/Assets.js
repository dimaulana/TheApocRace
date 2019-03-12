// Asset class
// Author: Hussein Parpia
//
// Requiring fs module in which  
// readFile function is defined. 
const fs = require('fs') 

class Asset {
	constructor() {
		this.textureMap = new Map();
		this.animationMap = new Map();
		this.fontMap = new Map();
		this.soundMap = new Map();
	}

	loadAssets(path) {

		fs.readFile(path, function(err, data) {
			if (err) {throw err;}
			//console.log(data.toString());

			var lines = data.toString().split("\n");
			for (var i in lines) {
				var words = lines[i].split(" ");
				switch(words[0]) {
					case "Texture":
						addTexture(words[1], words[2]);
						break;

					case "Animation":
						addAnimation(words[1], words[2]);
						break;

					case "Font":
						addFonts(words[1], words[2]);
						break;

					case "Sound":
						addSound(words[1], words[2]);
						break;

					default:
						console.log("Asset", words[0], "not found");
						break;
				}
				//console.log(array[i]);
			}
		});
	}

	addTexture(textureName, path) {
		this.textureMap.set(textureName, path);
	}

	addAnimation(name, path) {
		this.animationMap.set(name, path);
	}

	addSound(soundName, path) {
		this.soundMap.set(soundName, path);
	}

	addFonts(fontName, path) {
		this.fontMap.set(fontName, path);
	}

	getTexture(name) {
		return this.textureMap.get(name);
	}

	getAnimation(name) {
		return this.animationMap.get(name);
	}

	getSound(name) {
		return this.soundMap.get(name);
	}

	getFont(name) {
		return this.fontMap.get(name);
	}
}