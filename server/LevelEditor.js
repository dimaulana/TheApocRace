var fs = require('fs');

class LevelEditor{
    constructor(levelName){
        this.levelName = levelName;
    }

    writeToFile(data){
        var fileName = this.levelName + '.json';
		fs.writeFileSync(fileName, JSON.stringify(data));
    }

    readSavedFile(levelName){
        return fs.readFileSync(levelName);
    }
}

module.exports = LevelEditor;