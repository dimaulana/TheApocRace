var fs = require('fs');

class AssetManager{
    constructor(){
        this.textureMap = new Map();
        this.animationMap =  new Map();
        this.fontMap = new Map();
        this.soundMap = new Map();   
    }

    loadAssets(){
        let rawdata = fs.readFileSync('server/asset.json');  
        let json = JSON.parse(rawdata); 

        for (const item of Object.keys(json)) {
            var type = json[item]['type'];
    		switch(type){
    			case "Texture":
    				this.addTexture(json[item]['name'], json[item]['path']);
    				break;
    			case "Font":
    				this.addFont(json[item]['name'], json[item]['path']);
    				break;
    			case "Sound":
    				this.addSound(json[item]['name'], json[item]['path']);
    				break;
    			case "Animation":
    				this.addAnimation(json[item]['name'], json[item]['path']);
    				break;		
    			default:
    				console.log(json[i]['name'] + 'does not exist');
    				break;
    		}
		}
    }

    addTexture(textureName, path){
        this.textureMap.set(textureName, path);
        console.log("texture map" + this.textureMap.size);
    }

    addAnimation(animationName, path){
        this.animationMap.set(animationName, path);
    }

    addSound(soundName, path){
        this.soundMap.set(soundName, path);
    }

    addFont(fontName, path){
        this.fontMap.set(fontName, path);
    }

    getTexture(textureName){
       return this.textureMap.get(textureName);
    }

    getSound(soundName){
        this.soundMap.get(soundName);
    }

    getFont(fontName){
        this.fontMap.get(fontName);
    }

    getAnimation(animationName){
        this.animationMap.get(animationName);
    }
}

module.exports = AssetManager;
