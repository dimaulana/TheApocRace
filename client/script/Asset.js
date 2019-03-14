

Asset = function(){
	
		var self = {
			textureMap: new Map(),
			animationMap:  new Map(),
			fontMap: new Map(),
			soundMap: new Map()
		}
	
	self.loadAssets = function(){
		$.getJSON("client/script/asset.json", function(json) {

		for (item in json) {
    		var type = json[item]['type'];
    		switch(type){
    			case "Texture":
    				self.addTexture(json[item]['name'], json[item]['path']);
    				break;
    			case "Font":
    				self.addFonts(json[item]['name'], json[item]['path']);
    				break;
    			case "Sound":
    				self.addSound(json[item]['name'], json[item]['path']);
    				break;
    			case "Animation":
    				self.addAnimation(json[item]['name'], json[item]['path']);
    				break;		
    			default:
    				console.log(json[i]['name'] + 'does not exist');
    				break;
    		}
		}
		console.log(self.getTexture('Player'));
		});
 	 }
 
	self.addTexture = function(textureName, path) {
		self.textureMap.set(textureName, path);
	}

	self.addAnimation = function(name, path) {
		self.animationMap.set(name, path);
	}

	self.addSound = function(soundName, path) {
		self.soundMap.set(soundName, path);
	}

	self.addFonts = function(fontName, path) {
		self.fontMap.set(fontName, path);
	}

	self.getTexture = function(name) {
		return self.textureMap.get(name);
	}

	self.getAnimation = function(name) {
		return self.animationMap.get(name);
	}

	self.getSound = function(name) {
		return self.soundMap.get(name);
	}

	self.getFont = function(name) {
		return self.fontMap.get(name);
	}
	return self;
}