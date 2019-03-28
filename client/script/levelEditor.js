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
backgroundList.name = "backgrounds";

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
tileList.name = "tiles";

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
enemyList.name = "enemies";

levelEditor = function () {
    var self = {};
    console.log("Creating level editor.");
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
    self.rows = 1280 / self.tileSize;

    /* Set buffer tile to draw into current screen */
    self.buffer = document.createElement('canvas');
    self.bCtx = self.buffer.getContext("2d");
    self.buffer.width = self.canvasWidth;
    self.buffer.height = self.canvasHeight;

    /* initiate tile map for each screen */
    self.screenArray = {};

    /* Initiate variables */
    self.backgroundLoc = "";
    self.tileMap = [];
    self.pickedTile = {};
    self.currentScreen = 0;
    self.itemId = 0;
    self.mouseDown = false;


    /* Initiates the first empty canvas */
    self.initiate = function () {
        self.populateDropdown();
        self.canvas.addEventListener('mousedown', self.clicked, false);
        document.addEventListener('contextmenu', event => event.preventDefault());

        for (var i = 0; i < self.numberOfScreens; i++) {
            var destination = document.createElement('canvas');
            destination.width = self.gameWidth;
            destination.height = self.canvasHeight;
            var dCtx = destination.getContext("2d");
            var item = {
                "imageData": dCtx.getImageData(0, 0, 1280, 720),
                "background": "",
                "tileMap": []
            }
            self.screenArray[i] = item;
        }
        self.updateData();
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
        self.screenArray[self.currentScreen].imageData = self.ctx.getImageData(0, 0, 1280, self.canvasHeight);
        self.screenArray[self.currentScreen].tileMap = self.tileMap;
        self.screenArray[self.currentScreen].background = self.backgroundLoc;
        self.displayGrid();
    };

    /* Function to change the screen */
    self.transition = function () {
        var destination = self.screenArray[self.currentScreen].imageData;
        self.tileMap = [];
        self.backgroundLoc = self.screenArray[self.currentScreen].background;
        self.tileMap = self.screenArray[self.currentScreen].tileMap;
        self.canvas.style.background = "url('" + self.backgroundLoc + "')";
        self.ctx.putImageData(destination, 0, 0);
        self.displayGrid();
    };




    self.setBackground = function () {
        self.canvas.style.background = "url('" + self.backgroundLoc + "')";
        self.updateData();
    }

    self.mousePosition = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
        return {
            x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
        }
    }

    $(document).on("click", "#canvasEditor button", function (e) {
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
        self.transition();
    });

    /* function drag() {
        var position = self.getMousePos(self)
    } */

    self.clicked = function (e) {
        if (e.button === 0) {
            self.drawItem(e);
        }
        if (e.button === 2) {
            self.removeItem(e);
        }
    }

    self.findSprite = function (val) {

        /* Find the retrieved asset into loaded asset */
        for (var i = 0; i < enemyList.length; i++) {
            if (enemyList[i].name.replace(/\s/g, '') === val) {
                return enemyList[i].spriteSrc;
            }
        }
    }

    /* Draws asset into current canvas */
    self.drawItem = function (e) {
        console.log("Currently Drawing: " + self.pickedTile.name);
        var mouse = self.mousePosition(self.canvas, e);
        let gridX = Math.floor(mouse.x / self.tileSize) * self.tileSize;
        let gridY = Math.floor(mouse.y / self.tileSize) * self.tileSize;
        if (mouse.y < 720 && mouse.x < 1280) {
            let id = self.itemId;
            var item = {
                "id": id,
                "name": self.pickedTile.name,
                "type": self.pickedTile.type,
                "x": gridX,
                "y": gridY,
                "height": self.pickedTile.height,
                "width": self.pickedTile.width
            }
            var asset = new Image();
            self.ctx.clearRect(gridX, gridY, item.width, item.height);
            let tileX = Math.floor(mouse.x / item.width);
            let tileY = Math.floor(mouse.y / item.width);
            let targetTile = tileY * self.columns + tileX;
            if (item.type === "enemies") {
                console.log("We are drawing an enemy");
                item.img = self.findSprite(self.pickedTile.name);
                console.log("item img: " + item.img);
                asset.src = item.img;
                console.log("asset: " + asset);
                self.ctx.drawImage(asset, 0, 0, 40, 80, gridX, gridY, item.width, item.height);
                console.log("item drawn");
                self.tileMap[targetTile] = item;
                self.tileMap[targetTile + self.columns] = item;
            }
            if (item.type === "tiles") {
                item.img = self.pickedTile.loc;
                asset.src = item.img;
                self.ctx.drawImage(asset, gridX, gridY, item.width, item.height);
                self.tileMap[targetTile] = item;
            }
            self.itemId++;
        }
        self.updateData();
        console.log(self.tileMap);
    }


    /* Delete drawn asset item */
    self.removeItem = function (e) {
        var contents = self.tileMap;
        self.mouseDown = true;
        var mouse = self.mousePosition(self.canvas, e);
        let tileX = Math.floor(mouse.x / self.tileSize);
        let tileY = Math.floor(mouse.y / self.tileSize);
        let targetTile = tileY * self.columns + tileX;
        console.log("remove function");
        if (self.tileMap[targetTile]) {
            var topX = self.tileMap[targetTile].x;
            var topY = self.tileMap[targetTile].y;
            var height = self.tileMap[targetTile].height;
            var width = self.tileMap[targetTile].width;
            var id = self.tileMap[targetTile].id;
            var type = self.tileMap[targetTile].type;

            if (mouse.y < 720 && mouse.x < 1280) {
                self.ctx.clearRect(topX, topY, width, height);
                console.log("Type: " + type);
                if (type === "enemies") {

                    var filteredTileMap = self.tileMap.filter(tiles => tiles.id === id);

                    console.log(filteredTileMap);
                    for (var i = 0; i < self.tileMap.length; i++) {
                        console.log("i: " + i);
                        if (self.tileMap[i]) {
                            if (self.tileMap[i].id === id) {
                                delete self.tileMap[i];
                            }
                        }

                    }


                }
                /* Assign ID to each object and delete both by ID value */
                else if (type === "tiles") {
                    console.log("Type is tile");
                    delete self.tileMap[targetTile];
                    console.log("Removing Tiles")
                    console.log(self.tileMap);
                }
            }
        }
        self.updateData();
        console.log(self.tileMap);
    }


    self.saveLevel = function () {

    }

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

    /* Handle main buttons on clicks */
    $(document).on("click", ".objects li", function () {
        var selectedOption = $(this).attr("id");
        switch (selectedOption) {
            case "back":
                $(".interface").html("");
                generateMenus('buildMenu');
                break;
            case "save":
                self.saveLevel();
                break;
            case "play":
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
            case "tiles":
                var tile = {
                    "loc": imageSrc.substring(22),
                    "name": imageId,
                    "type": selectedDropdown,
                    "height": 40,
                    "width": 40
                };
                self.pickedTile = tile;
                $(".selectedTile").attr("src", imageSrc);
                break;
            case "enemies":
                var tile = {
                    "loc": imageSrc.substring(22),
                    "name": imageId,
                    "type": selectedDropdown,
                    "height": 80,
                    "width": 40
                };
                self.pickedTile = tile;
                $(".selectedChar").attr("src", imageSrc);
                break;
            case "backgrounds":
                self.backgroundLoc = imageSrc.substring(22);
                console.log("Background clicked");
                $(".selectedBg").attr("src", imageSrc);
                self.setBackground();
                break;
        }
    });

    self.initiate();
    return self;

};