var fs = require('fs');
require('./DatabaseManager.js');

const Assets = {
    TEXTURE: "Texture",
    SOUND: "Sound",
    ANIMATION: "Animation",
    FONT: "Font"
}

AssetManager = function() {

    var self = {
        textureMap: new Map(),
        animationMap: new Map(),
        fontMap: new Map(),
        soundMap: new Map(),   
    }

    /*  ---- DEPRACATED -----
    loadAssets(){
        let rawdata = fs.readFileSync('server/bin/asset.json');  
        let json = JSON.parse(rawdata); 

        for (const item of Object.keys(json)) {
            var type = json[item]['type'];
    		switch(type){
    			case "Texture":
    				self.addTexture(json[item]['name'], json[item]['path']);
    				break;
    			case "Font":
    				self.addFont(json[item]['name'], json[item]['path']);
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
    }
    */

    // Should load assets immediately;
    self.loadAssets = function(cb) {
        Database.getAllAssets(function(assetDict) {
            if (!assetDict) {
                console.log("No assets found");
                return;
            }

            assetDict.forEach(function(asset) {
                switch(asset.type) {
                    case Assets.TEXTURE:
                        self.addTexture(asset.name, asset.path);
                    break;

                    case Assets.SOUND:
                        self.addSound(asset.name, asset.path);
                    break;

                    case Assets.ANIMATION:
                        self.addAnimation(asset.name, asset.path);
                    break;

                    case Assets.FONT:
                        self.addFont(asset.name, asset.path);
                    break;
                }
            });
            console.log("Assets loaded");
        });
    }

    self.addTexture = function(textureName, path) {
        self.textureMap.set(textureName, path);
    }

    self.addAnimation = function(animationName, path) {
        self.animationMap.set(animationName, path);
    }

    self.addSound = function(soundName, path) {
        self.soundMap.set(soundName, path);
    }

    self.addFont = function(fontName, path) {
        self.fontMap.set(fontName, path);
    }

    self.getTexture = function(textureName) {
       return self.textureMap.get(textureName);
    }

    self.getSound = function(soundName) {
        return self.soundMap.get(soundName);
    }

    self.getFont = function(fontName) {
        return self.fontMap.get(fontName);
    }

    self.getAnimation = function(animationName) {
        return self.animationMap.get(animationName);
    }

    return self;
};

module.exports = AssetManager;

