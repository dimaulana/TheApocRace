var fs = require('fs');

class LevelEditor{
    constructor(param){
        this.levelName = param.levelName;
        this.socket = param.socket;
    }

    writeToFile(data){
        var fileName = this.levelName === "" ? data.levelName : this.levelName;
        fileName = "./server/bin/" + fileName + ".json";
        console.log(fileName);
        fs.writeFileSync(fileName, JSON.stringify(data.tileMap));
    }

    readSavedFile(){
        var data = {};
        if(this.levelName !== ""){
            var fileName =  './server/bin' + this.levelName;
            data = fs.readFileSync(fileName);
        }
        this.socket.emit('getLevelData', data);
    }
}

module.exports = LevelEditor;