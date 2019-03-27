/* Load images */

/* Background images */
var newyork1 = new Image();
newyork1.src = "client/images/newyork1.png";
newyork1.name = "New York 1";
var newyork2 = new Image();
newyork2.src = "client/images/newyork2.png";
newyork2.name = "New York 2";
var newyork3 = new Image();
newyork3.src = "client/images/newyork3.png";
newyork3.name = "New York 3";

var losAngeles1 = new Image();
losAngeles1.src = "client/images/losAngeles1.png";
losAngeles1.name = "Los Angeles 1";

var losAngeles2 = new Image();
losAngeles2.src = "client/images/losAngeles1.png";
losAngeles2.name = "Los Angeles 2";

var losAngeles3 = new Image();
losAngeles3.src = "client/images/losAngeles3.png";
losAngeles3.name = "Los Angeles 3";

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
character.name = "Player 1";

var enemy = new Image();
enemy.src = "client/images/enemyThumbnail.png";
enemy.name = "Enemy 1"

var enemyList = [character, enemy];
enemyList.name = "enemies";



levelEditor = function () {
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
    self.gameWidth = 1280;
    self.ctx = canvas.getContext("2d");
    self.columns = gameWidth / tileSize;
    self.rows = canvasHeight / tileSize;

    /* Set buffer tile to draw into current screen */
    self.buffer = document.createElement('canvas');
    self.bCtx = buffer.getContext("2d");
    buffer.width = self.canvasWidth;
    buffer.height = self.canvasHeight;

/* initiate tile map for each screen */
    self.screenArray = {};

    /* Initiate variables */
    self.backgroundLoc = "";
    self.tileLoc = "";
    self.tileType = "";
    self.tileMap = [];
    self.currentScreen = 0;
    self.itemId = 0;
    self.mouseDown = false;
    initiate();
}

/* Initiates the first empty canvas */
    function initiate() {  
        populateDropdown();      
        self.canvas.addEventListener('mousedown', clicked, false);
        document.addEventListener('contextmenu', event => event.preventDefault());

        for (var  i = 0; i < numberOfScreens; i++) {
            var destination = document.createElement('canvas');
            destination.width = self.gameWidth;
            destination.height = self.canvasHeight;
            var dCtx = destination.getContext("2d");
/*             dCtx.drawImage(background, 0, 0, gameWidth, canvasHeight);
 */            var item = {
                "imageData" : dCtx.getImageData(0, 0, gameWidth, canvasHeight),
                "background" : "", 
                "tileMap" : []
            }
            screenArray[i] = item;
        }
        updateData();

        console.log(tileType);
    }

/* Saves the data into the main array */    
    function updateData() {
        screenArray[currentScreen].imageData = self.ctx.getImageData(0,0,gameWidth, canvasHeight);
        screenArray[currentScreen].tileMap = self.tileMap;
        screenArray[currentScreen].background = self.backgroundLoc;
        console.log(screenArray);
        displayGrid();
    }

/* Function to change the screen */
    function transition() {
        var destination = screenArray[currentScreen].imageData;
        self.tileMap = [];
        self.backgroundLoc = screenArray[currentScreen].background;
        self.tileMap = screenArray[currentScreen].tileMap;
        self.canvas.style.background = "url('"+backgroundLoc+"')";
        self.ctx.putImageData(destination, 0, 0);
        displayGrid();
/*         updateData();
 */    }

/* Shows the grid */
    function displayGrid() {
        /* Draw the grids */
        for (var i = 0; i <= self.columns; i++) {
        self.ctx.moveTo(i * tileSize, 0);
        self.ctx.lineTo(i * tileSize, canvasHeight);
        }
        self.ctx.stroke();
        for (var i = 0; i <= self.rows; i++) {
            self.ctx.moveTo(0, i * tileSize);
            self.ctx.lineTo(gameWidth, i * tileSize);
        }
        self.ctx.stroke();
    }


function setBackground() {
    self.canvas.style.background = "url('"+backgroundLoc+"')";
    updateData();
}

function mousePosition(canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
        return {
          x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
          y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
}

$(document).on("click", "#canvasEditor button", function (e) {
    var selectedOption = $(this).attr('id');
    if (selectedOption === "next") {
        if (currentScreen < numberOfScreens) {
            currentScreen++;
            if (currentScreen === 9) {
                this.setAttribute('disabled', true);    
            }
        }
        previous.removeAttribute('disabled');
        }
    else if (selectedOption === "previous") {
        if (currentScreen < numberOfScreens && currentScreen > 0) {
            currentScreen--;
            if (currentScreen === 0) {
                this.setAttribute("disabled", true);
            }
        }
        next.removeAttribute('disabled');
      }   
      transition();
});

/* function drag() {
    var position = self.getMousePos(self)
} */

function clicked(e) {
    if (e.button === 0) {
        drawItem(e);
    }
    if (e.button === 2) {
        removeItem(e);
    }
}

/* Draws asset into current canvas */
function drawItem(e) {
    console.log(self.tileType);
    var res = self.tileLoc.substring(22);

    /* Find asset to draw and make image */

    console.log(res);
    if (self.selectedTile != "") {
    var mouse = mousePosition(self.canvas, e);
    let gridX = Math.floor(mouse.x / tileSize) * tileSize;
    let gridY = Math.floor(mouse.y / tileSize) * tileSize;
        if (mouse.y < canvasHeight && mouse.x < gameWidth) {
            let id = self.itemId;
            var item = {
                "id" : id,
                "img" : self.tileLoc.substring(22),
                "type" : self.tileType,
                "x" : gridX,
                "y" : gridY,
                "height" : self.tileType.height,
                "width" : self.tileType.width
            }
            self.ctx.clearRect(gridX, gridY, item.width, item.height);
            let tileX = Math.floor(mouse.x / item.width);
            let tileY = Math.floor(mouse.y / item.width);
            let targetTile = tileY * columns + tileX;
            if (tileType === "enemies") {
 /*                if (tileType === "player") {
                    var index = 0;
                }
                if (tileType === "enemy") {
                    var index = 1;
                } */
                self.ctx.drawImage(item.img, 1*tileSize, 0, 40, 80, gridX, gridY, tile.width, tile.height);
                tileMap[targetTile] = item;
                tileMap[targetTile + self.columns] = item;
            }
            else if (tileType === "tiles") {
                console.log();
                self.ctx.drawImage(item.img, gridX, gridY, item.width , item.height);
                tileMap[targetTile] = item;
            }
            itemId++;
        }
        updateData();
    }
}


/* Delete drawn asset item */
function removeItem(e) {
    self.mouseDown = true;
    var mouse = mousePosition(self.canvas, e);
    let tileX = Math.floor(mouse.x / tileSize);
    let tileY = Math.floor(mouse.y / tileSize);
    let targetTile = tileY * columns + tileX;
  console.log("remove function");
    if (tileMap[targetTile]) {
        var topX = tileMap[targetTile].x;
        var topY = tileMap[targetTile].y;
        var height = tileMap[targetTile].height;
        var width = tileMap[targetTile].width; 
        var id = tileMap[targetTile].id;
        var type = tileMap[targetTile].type;
    
        if (mouse.y < canvasHeight && mouse.x < gameWidth) {
            self.ctx.clearRect(topX, topY, width, height);
            if (type === "enemies") {
                    $.each(tileMap, function(i) {
                        if (tileMap[i].id === id) {
                            delete tileMap[i];
                            console.log("Remove player");
                            console.log(tileMap);
                        }
                    });
                }
                /* Assign ID to each object and delete both by ID value */
            }
            else if (type === "tile") {
                delete tileMap[targetTile];
                console.log("Removing Tiles")
                console.log(tileMap);
            }
        }
        updateData();
    }


    function saveLevel() {

    }

    function populateDropdown() {
        var items = [tileList, enemyList, backgroundList];
        $.each(items, function(i) {
            var dropdown = [];
            var assetType = items[i];
            dropdown.push("<div class='dropdown-menu' aria-labelledby='"+assetType.name+"'>");
            for (var j = 0; j < assetType.length; j++) {
                dropdown.push("<a id='"+assetType[j].name+"' class='dropdown-item'><img src='"+assetType[j].src+"'>&nbsp"+assetType[j].name+"</a>")
            }
            dropdown.push("</div>");
            $(dropdown.join('')).appendTo("#"+assetType.name);
        });
    }

    $(document).on("click", ".objects li .dropdown-menu a", function() {
        var imageSrc = $("img", this).attr("src");
        var id = $(this).attr("id");
         var selectedOption = $(this).closest("li").attr("id");
         var imageId = $(this).closest("a").attr("id");
         console.log("selectedOption: "+selectedOption);
 
    switch (selectedOption) {
        case "back":
            $(".interface").html("");
            generateMenus('buildMenu');
            break;
        case "tiles":
            self.tileLoc = imageSrc;
            self.tileType = selectedOption;
            self.tileType.height = 40;
            self.tileType.width = 40;
            console.log("Tile clicked");
            $(".selectedTile").attr("src",imageSrc);
            break;
        case "enemies":
            self.tileLoc = imageSrc;
            self.tileType = selectedOption;
            self.tileType.height = 80;
            self.tileType.width = 40;
            console.log("Enemies appended");
            $(".selectedChar").attr("src",imageSrc);
            break;
        case "backgrounds":
            self.backgroundLoc = imageSrc;
            console.log("Background clicked");
            $(".selectedBg").attr("src",imageSrc);
            setBackground();
            break;
        case "save":
            saveLevel();
            break;
        case "play":
            /* Enter play game function here */
            break;
        }
    }); 
