var fs = require('fs');
require('./DatabaseManager.js');

class LevelEditor{
    constructor(param){
        this.levelName = param.levelName;
        this.socket = param.socket;
    }

    writeToFile(data){
        var fileName;
            if (this.levelName === "") {
                fileName = data.levelName;
            }
            else if (this.levelName !== data.levelName) {
                fileName = data.levelName;
            }
            else {
                fileName = this.levelName;
            }
        fileName = "./server/levels/" + fileName + ".json";
        fs.writeFileSync(fileName, JSON.stringify(data.tileMap));
    }

    writeToDatabase(data){
        DatabaseManager();
        Database.writeToDatabase(data);
    }

    readSavedFile(){
        var data = {};
        if(this.levelName !== ""){
            var fileName =  './server/levels/' + this.levelName + ".json";
            data = fs.readFileSync(fileName, 'utf8');
        }
        this.socket.emit('getLevelData', data);
    }

    readFromDatabase(){
        var data = {};
        if(this.levelName !== ""){
            data = Database.readFromDatabase(this.levelName);
        }
        this.socket.emit('getLevelData', data);
    }
}

module.exports = LevelEditor;