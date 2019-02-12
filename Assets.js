// Asset class
// Author: Hussein Parpia

class Asset {
	constructor() {
		this.textureMap = new Map();
		this.animationMap = new Map();
		this.fontMap = new Map();
		this.soundMap = new Map();

	}

	loadAssets(path) {

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