var fs = require('fs');
require('./DatabaseManager.js');

function LevelEditor(param) {
    var self = {
        levelName: param.levelName,
        socket: param.socket,
        user: param.username
    }

    // Only used for saving story files for local run;
    self.writeToFile = function(data) {
        if (self.user !== 'admin') {
            console.log("RESTRICTED ACTION: NO ACCESS TO READ OR EDIT STORY MODE");
            socket.emit('saveLevelResponse', false);
            return;
        }

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
        fs.writeFileSync(fileName, JSON.stringify(data.tileMap), function(err, res) {
            if(res)
                self.socket.emit('saveLevelResponse', true);
            else
                self.socket.emit('saveLevelResponse', false);
        });

    }

    self.readSavedFile = function() {
        if (self.user !== 'admin') {
            console.log("RESTRICTED ACTION: NO ACCESS TO READ OR EDIT STORY MODE");
            self.socket.emit('saveLevelResponse', false);
            self.socket.emit('getLevelData', {});
            return;
        }

        var data = {};
        if(self.levelName !== "") {
            var fileName =  './server/levels/' + self.levelName + ".json";
            data = fs.readFileSync(fileName, 'utf8');
        }
        self.socket.emit('getLevelData', JSON.parse(data));
    }

    self.writeToDatabase = function(data){
        self.socket.emit('getUserName', self.user);
        Database.writeToDatabase(data, function(res) {
            if (res)
                self.socket.emit('saveLevelResponse', true);
            else
                self.socket.emit('saveLevelResponse', false);
        });
    }

    self.readLevel = function() {
        var data = {};
        if(self.levelName !== "") {
            data = Database.readFromDatabase({levelName: self.levelName, user: self.user} , function(levelData) {
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