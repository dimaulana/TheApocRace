/* Load images */

/* Background images */
var newyork = new Image();
newyork.src = "client/images/newyork1.png";
newyork.name = "New York";

var losAngeles = new Image();
losAngeles.src = "client/images/losAngeles1.png";
losAngeles.name = "Los Angeles";

var backgroundList = [newyork, losAngeles];
backgroundList.name = "Background";

/* Tiles */
var tile1 = new Image();
tile1.src = "client/images/tile1.png";
tile1.name = "Tile 1";

var tile2 = new Image();
tile2.src = "client/images/tile2.png";
tile2.name = "Tile 2";

var tile3 = new Image();
tile3.src = "client/images/tile3.png";
tile3.name = "Tile 3";

var tile4 = new Image();
tile4.src = "client/images/tile4.png";
tile4.name = "Tile 4";


var coin = new Image();
coin.src = "client/images/singlecoin.png";
coin.name = "Coin";

var tileList = [tile1, tile2, tile3, tile4, coin];
tileList.name = "Tile";

/* Character & Enemies */
var character = new Image();
character.src = "client/images/charThumbnail.png";
character.spriteSrc = "client/images/playerrun.png"
character.name = "Player";

var enemy1 = new Image();
enemy1.src = "client/images/enemyThumbnail.png";
enemy1.spriteSrc = "client/images/enemyrun.png";
enemy1.name = "Enemy";
enemy1.ai = "Basic";

enemy2 = new Image();
enemy2.src = "client/images/minionThumbnail.png";
enemy2.spriteSrc = "client/images/minionenemyrun.png";
enemy2.name = "Minion";

var enemyList = [enemy1, enemy2];
enemyList.name = "Character";

levelEditor = function (lvlName) {
    var self = {};
    /* Set game total sizes */
    self.canvasWidth = 12800;
    self.canvasHeight = 720;

    /* Set tile properties to draw columns, rows and total level dimensions */
    self.tileSize = 40;
    self.mapSize = self.canvasWidth * 10;
    self.numberOfScreens = 10; /* will increase if player decides to add more screen transition */

    /* Main large tile */
    self.canvas = document.getElementById("editor");
    self.ctx = self.canvas.getContext("2d");
    self.columns = 1280 / self.tileSize;
    self.rows = 720 / self.tileSize;

    /* Initiate variables */
    self.background = {};
    self.tileMap = [];
    self.pickedTile = {};
    self.currentScreen = 0;
    self.mouseDown;
    self.viewport = new Viewport(0, 0, 1280, 720); // The viewport of the game;

    /* Initiates the first empty canvas */
    self.initiate = function (levelName) {

        if (!levelName) levelName = "";
        socket.emit('loadLevel', levelName);
        socket.on('getLevelData', function (data) {

            /* Attach event listeners */
            self.canvas.addEventListener('click', self.clicked);
            document.addEventListener('contextmenu', event => event.preventDefault());
            self.canvas.addEventListener('mousedown', self.down);
            self.canvas.addEventListener('mousemove', self.move);
            self.canvas.addEventListener('mouseup', self.reset);

            /* If we are loading an existing level, load level */
            if (!jQuery.isEmptyObject(data)) {
                self.loadLevel(data);
            } else {
                /* Sets up default player position for blank canvas */
                var character = new Image();
                character.src = "client/images/playerrun.png"
                var player = {
                    "name": "Player",
                    "type": "Character",
                    "x": 40,
                    "y": 560,
                    "tilePos": 449,
                    "tilePos1": 481
                }
                self.tileMap.push(player);
                character.onload = function () {
                    self.ctx.drawImage(character, 0, 0, 40, 80, 40, 560, 40, 80);
                };
            }

            self.displayGrid();

            /* Adds screen number indicator */
            $("#screenCounter").html(self.currentScreen + 1 + "/" + self.numberOfScreens);

            /* Populate dropdown options */
            self.populateDropdown();
        });
    }

    /* Shows the grid */
    self.displayGrid = function () {
        for (var i = 0; i <= self.columns; i++) {
            self.ctx.moveTo(i * self.tileSize, 0);
            self.ctx.lineTo(i * self.tileSize, 720);
        }
        self.ctx.stroke();
        for (var i = 0; i <= self.rows; i++) {
            self.ctx.moveTo(0, i * self.tileSize);
            self.ctx.lineTo(1280, i * self.tileSize);
        }
        self.ctx.stroke();
    }

    self.drawToCanvas = function (data) {
        $.each(data, function (i) {
            if (data[i].x > 1280 || data[i].x < 0) {
                return;
            } else {
                if (data[i].type === "Character" || data[i].type === "Tile") {
                    var asset = self.findSprite(data[i].name, data[i].type);
                    asset.onload = function () {
                        if (data[i].type === "Character") {
                            if (data[i].name === "Player") {
                                self.ctx.drawImage(asset, 0 * self.tileSize, 0, 40, 80, data[i].x, data[i].y, 40, 80);
                            } else {
                                self.ctx.drawImage(asset, 1 * self.tileSize, 0, 40, 80, data[i].x, data[i].y, 40, 80);
                            }
                        }
                        if (data[i].type === "Tile") {
                            self.ctx.drawImage(asset, data[i].x, data[i].y, 40, 40);
                        }
                    }
                }
                if (data[i].type === "Background") {
                    self.canvas.style.background = "url('" + data[i].src + "')";
                }
            }
        });
        self.displayGrid();
    }

    /* Function to change the screen */
    self.transition = function (val) {
        self.viewport.update("Editor", val);
        self.ctx.clearRect(0, 0, 1280, 720);
        for (var i = 0; i < self.tileMap.length; i++) {
            if (self.tileMap[i].type === "Character" || self.tileMap[i].type === "Tile") {
                self.tileMap[i].x += self.viewport.x;
            }
        }
        self.drawToCanvas(self.tileMap);
    };

    /* Sets background TODO: Figure out sprite backgrounds */
    self.setBackground = function () {
        self.canvas.style.background = "url('" + self.background.src + "')";
    }

    /* Translates mouse position from normal coordinates to canvas coordinates */
    self.mousePosition = function (canvas, e) {
        var rect = canvas.getBoundingClientRect(),
            scaleX = canvas.width / rect.width,
            scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        }
    }

    /* Handles left and right click for drawing */
    self.clicked = function (e) {
        self.drawItem(e);
    }

    self.down = function (e) {
        self.mouseDown = true;
        if (e.button === 2) self.removeItem(e);
        else return;
    }

    self.move = function (e) {
        if (self.mouseDown) {
            self.drawItem(e);
        }
    }

    self.reset = function (e) {
        self.mouseDown = false;
    }

    /* Find the requested assets */
    self.findSprite = function (name, type) {
        var sprite = new Image();
        if (type === "Character") {
            if (name === "Player") {
                sprite.src = character.spriteSrc;
                return sprite;
            } else {
                for (var i = 0; i < enemyList.length; i++) {
                    if (enemyList[i].name.replace(/\s/g, '') === name) {
                        sprite.src = enemyList[i].spriteSrc;
                        return sprite;
                    }
                }
            }
        }
        if (type === "Tile") {
            for (var i = 0; i < tileList.length; i++) {
                if (tileList[i].name.replace(/\s/g, '') === name) {
                    sprite.src = tileList[i].src;
                    return sprite;
                }
            }
        }
        if (type === "Background") {
            for (var i = 0; i < backgroundList.length; i++) {
                if (backgroundList[i].name.replace(/\s/g, '') === name) {
                    sprite.src = backgroundList[i].src;
                }
            }
        }
    }

    /* Draws asset into current canvas */
    self.drawItem = function (e) {
        var mouse = self.mousePosition(self.canvas, e);
        let gridX = Math.floor(mouse.x / self.tileSize) * self.tileSize;
        let gridY = Math.floor(mouse.y / self.tileSize) * self.tileSize;
        let tileX = Math.floor(mouse.x / self.tileSize);
        let tileY = Math.floor(mouse.y / self.tileSize);
        var offset = (self.columns * self.rows) * self.currentScreen;
        let targetTile = tileY * self.columns + tileX;
        let position = targetTile + offset;
        if (self.validate(position, offset)) {
            if (mouse.y < 720 && mouse.x < 1280) {
                var item = {
                    "name": self.pickedTile.name,
                    "type": self.pickedTile.type,
                    "x": gridX,
                    "y": gridY,
                }
                self.ctx.clearRect(gridX, gridY, 40, 40);
                var asset = self.findSprite(self.pickedTile.name, self.pickedTile.type);
                item.tilePos = position;
                item.img = asset.src.substring(22);

                if (item.type === "Character") {
                    item.tilePos1 = position + self.columns;
                    if (item.name === "Enemy") {
                        item.ai = "Basic";
                    }
                    if (item.name === "Minion") {
                        item.ai = "FollowPlayer";
                        item.followSpeed = {
                            "x": 5,
                            "y": 0
                        };
                    }
                    self.tileMap.push(item);
                    asset.onload = function () {
                        self.ctx.drawImage(asset, 1 * self.tileSize, 0, 40, 80, gridX, gridY, 40, 80);
                    }
                }
                if (item.type === "Tile") {
                    self.tileMap.push(item);
                    asset.onload = function () {
                        self.ctx.drawImage(asset, gridX, gridY, 40, 40);
                    }
                }
            }
        }
        self.displayGrid();

    }

    /* Makes sure no tiles are in the way */
    self.validate = function (pos, offset) {
        if (!self.pickedTile || Object.keys(self.pickedTile).length === 0) {
            return false;
        }
        if (self.pickedTile.type === "Character" && pos + self.columns > offset + (self.rows * self.columns)) {
            alert("Invalid character position.");
            return false;
        }

        for (var i = 0; i < self.tileMap.length; i++) {
            if (self.tileMap[i].tilePos === pos || self.tileMap[i].tilePos1 === pos) {
                return false;
            }
            if (self.pickedTile.type === "Character" && self.tileMap[i].tilePos === (pos + self.columns)) {
                return false;
            }
        }
        return true;
    }

    /* Delete drawn asset item */
    self.removeItem = function (e) {
        var mouse = self.mousePosition(self.canvas, e);
        let tileX = Math.floor(mouse.x / self.tileSize);
        let tileY = Math.floor(mouse.y / self.tileSize);
        let targetTile = tileY * self.columns + tileX;
        var offset = (self.columns * self.rows) * self.currentScreen;
        let position = targetTile + offset;

        var height = 40;
        var width = 40;
        var targetItem;
        var location;
        if (449 === position || 481 === position) {
            alert("Cannot delete player!");
            return;
        } else {
            for (var i = 0; i < self.tileMap.length; i++) {
                if (self.tileMap[i].tilePos === position || self.tileMap[i].tilePos1 === position) {
                    targetItem = self.tileMap[i];
                    location = i;
                }
            }
            if (targetItem) {
                var topX = targetItem.x;
                var topY = targetItem.y;
                if (mouse.y < 720 && mouse.x < 1280) {
                    if (targetItem.type === "Character") {
                        height = 80;
                    }
                    self.ctx.clearRect(topX, topY, width, height);
                    self.tileMap.splice(location, 1);
                }
            }
        }
        self.displayGrid();

    }

    /* Save level */
    self.saveLevel = function () {
        $(".saveLevel").on("click", function () {
            var levelName = $("#levelName").val();
            self.tileMap.name = levelName;

            /* Save data here */
            if (levelName) {
                $('#saveModal').modal('hide');
            }

            var tileMapToSend = self.tileMap;
            /* Adjust for current screen position offset */
            for (var i = 0; i < tileMapToSend.length; i++) {
                tileMapToSend[i].x += 1280 * self.currentScreen;
            }
            /* Find end tile and attach object property */
            var lastTile = JSON.parse(JSON.stringify(tileMapToSend.reduce(function (i, e) {
                return i.x > e.x ? i : e;
            })));
            var endTile = {
                "name": "End",
                "type": "Point",
                "x": lastTile.x,
                "y": lastTile.y
            }
            var sound = {
                "type": "Sound",
                "name": "StoryMode",
                "src": "client/sound/background.mp3",
                "x": 0
            }

            // Check if End tile already exists;
            var oldEnd = tileMapToSend.find(function(e) {
                            return e.name === "End"
                        });

            if (oldEnd) {
                tileMapToSend.splice(tileMapToSend.indexOf(oldEnd), 1);
            }
            tileMapToSend.push(endTile);

            // Check if sound already exists;
            var soundOld = tileMapToSend.find(function(e) {
                            return e.name === 'StoryMode'
                        });

            if (!soundOld)
                tileMapToSend.push(sound);

            if (!jQuery.isEmptyObject(self.background)) {
                tileMapToSend.push(self.background);
            }

            var pack = {
                tileMap: tileMapToSend,
                levelName: levelName
            }
            socket.emit('saveNewLevel', pack);
        });
    }

    /* Load Level */
    self.loadLevel = function (levelData) {
        console.log(levelData);
        self.drawToCanvas(levelData);
        self.tileMap = levelData;
    }


    /* Populate level editor dropdown menu from array of assets */
    self.populateDropdown = function () {
        var items = [tileList, enemyList, backgroundList];
        $.each(items, function (i) {
            var dropdown = [];
            var assetType = items[i];
            dropdown.push("<div class='dropdown-menu' aria-labelledby='" + assetType.name + "'>");
            for (var j = 0; j < assetType.length; j++) {
                dropdown.push("<a id='" + assetType[j].name.replace(/\s/g, '') + "' class='dropdown-item'><img src='" + assetType[j].src + "'>&nbsp" + assetType[j].name + "</a>")
            }
            dropdown.push("</div>");
            $(dropdown.join('')).appendTo("#" + assetType.name);
        });
    }

    /* Handle creation of new screen */
    $(document).on("click", "#canvasEditor button", function (e) {
        $('#screenCounter').html("");
        var selectedOption = $(this).attr('id');
        if (selectedOption === "next") {
            if (self.currentScreen < self.numberOfScreens) {
                self.currentScreen++;
                self.transition("next");
                if (self.currentScreen === self.numberOfScreens - 1) {
                    this.setAttribute('disabled', true);
                }
            }
            previous.removeAttribute('disabled');
        } else if (selectedOption === "previous") {
            if (self.currentScreen < self.numberOfScreens && self.currentScreen > 0) {
                self.currentScreen--;
                self.transition("prev");
                if (self.currentScreen === 0) {
                    this.setAttribute("disabled", true);
                }
            }
            next.removeAttribute('disabled');
        }
        $("#screenCounter").html(self.currentScreen + 1 + "/" + self.numberOfScreens);
    });

    /* Handle main buttons on clicks */
    $(document).on("click", ".objects li", function () {
        var selectedOption = $(this).attr("id");
        switch (selectedOption) {
            case "Back":
                $(".interface").html("");
                $(".menu").html("");
                $('.star').removeClass("off");
                generateMenus('buildMenu');
                break;
            case "Save":
                self.saveLevel();
                break;
            case "Play":
                console.log("play game");
                break;
        }
    });

    /* Handle dropdown on clicks */
    $(document).on("click", ".objects li .dropdown-menu a", function () {
        var imageSrc = $("img", this).attr("src");
        var selectedDropdown = $(this).closest("li").attr("id");
        var imageId = $(this).closest("a").attr("id");
        switch (selectedDropdown) {
            case "Tile":
                var tile = {
                    "loc": imageSrc.substring(22),
                    "name": imageId,
                    "type": selectedDropdown,
                };
                self.pickedTile = tile;
                $(".selectedTile").attr("src", imageSrc);
                $("#Tile").css({
                    "background-color": "#FF8000"
                });
                $("#Character").css({
                    "background-color": "#173B0B"
                });
                break;
            case "Character":
                var tile = {
                    "loc": imageSrc.substring(22),
                    "name": imageId,
                    "type": selectedDropdown,
                };
                self.pickedTile = tile;
                $(".selectedChar").attr("src", imageSrc);
                $("#Character").css({
                    "background-color": "#FF8000"
                });
                $("#Tile").css({
                    "background-color": "#173B0B"
                });
                break;
            case "Background":
                self.background.type = "Background";
                self.background.name = imageId;
                self.background.src = imageSrc.substring(22);
                $(".selectedBg").attr("src", imageSrc);
                self.setBackground();
                break;
        }
    });

    /* Starters */
    self.initiate(lvlName)
    return self;
};

function startEditor() {
    $('.star').addClass("off");
    $('#editor').show();
    var editor = new levelEditor();
    return editor;
}

function loadEditor() {
    /* To Do: get list of levels from directory */
    var listofLevel = ["level1", "level2", "level3"];
    var items = [];
    $.each(listofLevel, function (i) {
        items.push("<button id='loadLevel' class='btn btn-primary btn-lg ml-2'>" + listofLevel[i] + "</button>");
    });
    items.push("<button id='loadLevel' class='btn btn-primary btn-lg ml-2'>Back</button>")
    $(items.join('')).appendTo(".menu");

    $(".menu #loadLevel").on("click", function () {
        var selectedLvl = $(this).text();
        $('.star').addClass("off");
        if (selectedLvl === "Back") {
            $(".interface").html("");
            $(".menu").html("");
            $('.star').removeClass("off");
            generateMenus("buildMenu");
        } else {
            $('.interface').load("client/levelEditor.html", function () {
                $('#editor').show();
                var editor = new levelEditor(selectedLvl);
                return editor;
            });
        }
    });
}
