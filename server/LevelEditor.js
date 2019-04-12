var fs = require('fs');
require('./DatabaseManager.js');

function LevelEditor(param) {
    var self = {
        levelName: param.levelName,
        socket: param.socket
    }

    /* DEPRACATED - FILE READING
    self.writeToFile = function(data){
        var fileName;
        if (self.levelName === "") {
            fileName = data.levelName;
        }
        else if (self.levelName !== data.levelName) {
            fileName = data.levelName;
        }
        else {
            fileName = self.levelName;
        }
        fileName = "./server/levels/" + fileName + ".json";
        fs.writeFileSync(fileName, JSON.stringify(data.tileMap));
    }

    self.readSavedFile = function(){
        var data = {};
        if(self.levelName !== "") {
            var fileName =  './server/levels/' + self.levelName + ".json";
            data = fs.readFileSync(fileName, 'utf8');
        }
        self.socket.emit('getLevelData', data);
    }
    */

    self.writeToDatabase = function(data){
        Database.writeToDatabase(data);
    }

    self.readLevel = function() {
        var data = {};
        if(self.levelName !== "") {
            data = Database.readFromDatabase(self.levelName, function(levelData) {
                if(!levelData)
                {
                    console.log("ERROR! No Level Data");
                    return;
                }
                self.socket.emit('getLevelData', levelData.tileMap);
            });
        }
        else {
            self.socket.emit('getLevelData', {});
        }
    }

    return self;
}

module.exports = LevelEditor;