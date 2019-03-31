/* Load images */

/* Background images */
var newyork1 = new Image();
newyork1.src = "client/images/newyork1.png";
newyork1.name = "NY 1";
var newyork2 = new Image();
newyork2.src = "client/images/newyork2.png";
newyork2.name = "NY 2";
var newyork3 = new Image();
newyork3.src = "client/images/newyork3.png";
newyork3.name = "NY 3";

var losAngeles1 = new Image();
losAngeles1.src = "client/images/losAngeles1.png";
losAngeles1.name = "LA 1";

var losAngeles2 = new Image();
losAngeles2.src = "client/images/losAngeles1.png";
losAngeles2.name = "LA 2";

var losAngeles3 = new Image();
losAngeles3.src = "client/images/losAngeles3.png";
losAngeles3.name = "LA 3";

var backgroundList = [newyork1, newyork2, newyork3, losAngeles1, losAngeles2, losAngeles3];
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

var tileList = [tile1, tile2, tile3];
tileList.name = "Tile";

/* Character & Enemies */
var character = new Image();
character.src = "client/images/charThumbnail.png";
character.spriteSrc = "client/images/playerrun.png"
character.name = "Player 1";

var enemy = new Image();
enemy.src = "client/images/enemyThumbnail.png";
enemy.spriteSrc = "client/images/enemyrun.png";
enemy.name = "Enemy 1"

var enemyList = [character, enemy];
enemyList.name = "Character";

levelEditor = function () {
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
    /* Set game screen sizes */
    self.ctx = self.canvas.getContext("2d");
    self.columns = 1280 / self.tileSize;
    self.rows = 720 / self.tileSize;

    /* initiate tile map for each screen */
    self.screenArray = [];

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
            if (data) {
                // TODO: load level given data
            }
            $("#screenCounter").html(self.currentScreen + 1 + "/" + self.numberOfScreens);
            self.populateDropdown();
            self.canvas.addEventListener('click', self.clicked);
            document.addEventListener('contextmenu', event => event.preventDefault());
            self.canvas.addEventListener('mousedown', self.down);
            self.canvas.addEventListener('mousemove', self.move);
            self.canvas.addEventListener('mouseup', self.reset);

            for (var i = 0; i < self.numberOfScreens; i++) {
                var destination = document.createElement('canvas');
                var dCtx = destination.getContext("2d");
                var item = {
                    "imageData": dCtx.getImageData(0, 0, 1280, 720),
                    "background": {},
                    "tileMap": []
                }
                self.screenArray[i] = item;
            }

            /* Sets up default player position */
            var asset = self.findSprite("Player1", "Character");
            var player = {
                "name": "Player",
                "type": "Character",
                "x": 60,
                "y": 560,
                "tilePos": 449,
                "tilePos1": 481
            }
            self.tileMap.push(player);
            asset.onload = function () {
                self.ctx.drawImage(asset, 0, 0, 40, 80, 40, 560, 40, 80);
                self.updateData();
            };
        });
    }

    /* Shows the grid */
    self.displayGrid = function () {
        /* Draw the grids */
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

    /* Saves the data into the main array */
    self.updateData = function () {
        self.screenArray[self.currentScreen].imageData = self.ctx.getImageData(0, 0, 1280, 720);
        self.screenArray[self.currentScreen].tileMap = self.tileMap;
        self.screenArray[self.currentScreen].background = self.background;
        self.displayGrid();
    };

    /* Function to change the screen */
    self.transition = function () {
        self.ctx.clearRect(0, 0, 1280, 720);
        var destination = self.screenArray[self.currentScreen].imageData;
        self.background = self.screenArray[self.currentScreen].background;
        self.tileMap = self.screenArray[self.currentScreen].tileMap;
        self.canvas.style.background = "url('" + self.background.loc + "')";
        self.ctx.putImageData(destination, 0, 0);
        self.viewport.update("Editor", self.currentScreen);
        self.updateData();
    };

    self.setBackground = function () {
        self.canvas.style.background = "url('" + self.background.loc + "')";
        self.updateData();
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



    /* Find the retrieved asset into loaded asset */
    self.findSprite = function (name, type) {
        var sprite = new Image();
        if (type === "Character") {
            for (var i = 0; i < enemyList.length; i++) {
                if (enemyList[i].name.replace(/\s/g, '') === name) {
                    sprite.src = enemyList[i].spriteSrc;
                    return sprite;
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
    }

    /* Draws asset into current canvas */
    self.drawItem = function (e) {
        var mouse = self.mousePosition(self.canvas, e);
        let gridX = Math.floor(mouse.x / self.tileSize) * self.tileSize;
        let gridY = Math.floor(mouse.y / self.tileSize) * self.tileSize;
        let tileX = Math.floor(mouse.x / 40);
        let tileY = Math.floor(mouse.y / 40);

        let targetTile = tileY * self.columns + tileX;
        if (self.validate(targetTile)) {
            if (mouse.y < 720 && mouse.x < 1280) {
                var item = {
                    "name": self.pickedTile.name,
                    "type": self.pickedTile.type,
                    "x": gridX + self.viewport.x,
                    "y": gridY,
                }
                self.ctx.clearRect(gridX, gridY, 40, 40);
                var asset = self.findSprite(self.pickedTile.name, self.pickedTile.type);
                if (item.type === "Character") {
                    item.img = asset.src.substring(22);
                    item.tilePos = targetTile;
                    item.tilePos1 = targetTile + self.columns;
                    self.tileMap.push(item);
                    asset.onload = function () {
                        self.ctx.drawImage(asset, 1 * self.tileSize, 0, 40, 80, gridX, gridY, 40, 80);
                        self.updateData();

                    }
                }
                if (item.type === "Tile") {
                    item.img = asset.src.substring(22);
                    item.tilePos = targetTile;
                    self.tileMap.push(item);
                    asset.onload = function () {
                        self.ctx.drawImage(asset, gridX, gridY, 40, 40);
                        self.updateData();

                    }


                }
            }
        }

    }

    /* Makes sure no tiles are in the way */
    self.validate = function (targetTile) {
        console.log("targetTile: "+targetTile);
        console.log("ROWS*COLUMNS: "+(self.rows * self.columns));
        console.log("self.rows: "+self.rows);
        if (!self.pickedTile || Object.keys(self.pickedTile).length === 0) {
            alert("Please select an object to draw.");
            return false;
        }
        if (self.pickedTile.type === "Character" && targetTile + self.columns > (self.columns * self.rows)) {
            alert("Invalid character position.");
            return false;
        }

        for (var i = 0; i < self.tileMap.length; i++) {
            if (self.tileMap[i].tilePos === targetTile || self.tileMap[i].tilePos1 === targetTile) {
                return false;
            }
            if (self.pickedTile.type === "Character" && self.tileMap[i].tilePos === (targetTile+self.columns)) {
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
        var height = 40;
        var width = 40;
        var targetItem;
        var location;
        if (449 === targetTile || 481 === targetTile) {
            alert("Cannot delete player!");
            return;
        } else {
            for (var i = 0; i < self.tileMap.length; i++) {
                if (self.tileMap[i].tilePos === targetTile || self.tileMap[i].tilePos1 === targetTile) {
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
            self.updateData();
        }
    }

    /* Save level */
    self.saveLevel = function () {
        $(".saveLevel").on("click", function () {
            var levelName = $("#levelName").val();
            self.screenArray.name = levelName;

            self.tileMap = [];
            for (var i = 0; i < self.screenArray.length; i++) {
                // TODO: Instead of each screen to array; Why not make use of the viewport and
                // save to self.tileMap;
                self.tileMap.push.apply(self.tileMap, self.screenArray[i].tileMap);
            }


            /* Save data here */
            if (levelName) {
                $('#saveModal').modal('hide');
            }

            var tileMapToSend = self.tileMap.filter(function (item) {
                return item !== null;
            });

            var pack = {
                tileMap: tileMapToSend,
                levelName: levelName
            }
            socket.emit('saveNewLevel', pack);
        });
    }
    
    /* Load Level */
    self.loadLevel = function () {
        // for (var i = 0; i < self.numberOfScreens; i++) {
        //     var destination = document.createElement('canvas');
        //     var dCtx = destination.getContext("2d");
        //     var item = {
        //         "imageData": dCtx.getImageData(0, 0, 1280, 720),
        //         "background": {},
        //         "tileMap": []
        //     }
        //     self.screenArray[i] = item;
        // }
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
                if (self.currentScreen === 9) {
                    this.setAttribute('disabled', true);
                }
            }
            previous.removeAttribute('disabled');
        } else if (selectedOption === "previous") {
            if (self.currentScreen < self.numberOfScreens && self.currentScreen > 0) {
                self.currentScreen--;
                if (self.currentScreen === 0) {
                    this.setAttribute("disabled", true);
                }
            }
            next.removeAttribute('disabled');
        }
        $("#screenCounter").html(self.currentScreen + 1 + "/" + self.numberOfScreens);
        self.transition();
    });

    /* Handle main buttons on clicks */
    $(document).on("click", ".objects li", function () {
        var selectedOption = $(this).attr("id");
        switch (selectedOption) {
            case "Back":
            console.log("")
                $(".interface").html("");
                $(".menu").html("");
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
                self.background.loc = imageSrc.substring(22);
                $(".selectedBg").attr("src", imageSrc);
                self.setBackground();
                break;
        }
    });

    /* Starters */
    self.initiate();
    return self;
};


