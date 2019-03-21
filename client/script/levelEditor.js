/* Load images */

/* Background images */
var newyork1 = new Image();
newyork1.src = "client/images/newyork1.png";
var newyork2 = new Image();
newyork2.src = "client/images/newyork2.png";
var newyork3 = new Image();
newyork3.src = "client/images/newyork3.png";
var losAngeles1 = new Image();
losAngeles1.src = "client/images/losAngeles1.png";
var losAngeles2 = new Image();
losAngeles2.src = "client/images/losAngeles1.png";
var losAngeles3 = new Image();
losAngeles3.src = "client/images/losAngeles3.png";

/* Tiles */
var tile1 = new Image();
tile1.src = "client/images/tile1.png";
var tile2 = new Image();
tile1.src = "client/images/tile2.png";
var tile3 = new Image();
tile3.src = "client/images/tile3.png";


var character = new Image();
character.src = "client/images/playerrun.png"


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
    self.tile = brickTile;
    self.backgroundLoc = "";
    self.tileLoc = "";
    self.tileType = "";
    self.tileMap = [];
    self.currentScreen = 0;
    self.itemId = 0;
    self.mouseDown = false;

    initiate();
}

    function initiate() {        
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
/*         self.canvas.style.background = "url('"+newyork1.src+"')";
 */        updateData();
    }

    function updateData() {
        screenArray[currentScreen].imageData = self.ctx.getImageData(0,0,gameWidth, canvasHeight);
        screenArray[currentScreen].tileMap = self.tileMap;
        screenArray[currentScreen].background = self.backgroundLoc;
        console.log(screenArray);
        displayGrid();
    }

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
    self.canvas.style.background = "url('client/images/losAngeles1.png')";
    self.backgroundLoc = "client/images/losAngeles1.png";
    updateData();
}

function pickCharacter() {
    self.tile = character;
}

function drawCharacter() {

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

function drawItem(e) {
    var mouse = mousePosition(self.canvas, e);
    let gridX = Math.floor(mouse.x / tileSize) * tileSize;
    let gridY = Math.floor(mouse.y / tileSize) * tileSize;
        if (mouse.y < canvasHeight && mouse.x < gameWidth) {

            self.ctx.clearRect(gridX, gridY, tile.width, tile.height);
            let tileX = Math.floor(mouse.x / tile.width);
            let tileY = Math.floor(mouse.y / tile.width);
            let targetTile = tileY * columns + tileX;
            let id = self.itemId;
            var item = {
                "id" : id,
                "img" : tileLoc,
                "type" : tileType,
                "x" : gridX,
                "y" : gridY,
                "height" : tile.height,
                "width" : tile.width
            }
            if (tileType === "player" || tileType === "enemy") {
                if (tileType === "player") {
                    var index = 0;
                }
                if (tileType === "enemy") {
                    var index = 1;
                }
                self.ctx.drawImage(tile, index*tileSize, 0, 40, 80, gridX, gridY, tile.width, tile.height);
                tileMap[targetTile] = item;
                tileMap[targetTile + self.columns] = item;
            }
            else if (tile.type === "tile") {
                self.ctx.drawImage(tile, gridX, gridY, tile.width , tile.height);
                tileMap[targetTile] = item;
            }
            itemId++;
        }
        updateData();
}

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
            if (type === "character") {
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

    function showModal() {

    }


    function saveLevel() {

    }


$(document).on("click", ".objects li", function (e) {
    $('li').css({
        "background-color": "#173B0B"
    })
    $(this).css({
        "background-color": "#FF8000"
    });
    var selectedOption = $(this).attr('id');
    var imageSrc = $("img", this).attr("src");
    console.log(selectedOption);
    console.log(imageSrc);

    switch (selectedOption) {
        case "back":
            $(".interface").html("");
            generateMenus('buildMenu')
        case "tiles":
            self.tileLoc = imageSrc;
            self.tileType = "tile";
            $('#myModal').modal('toggle');

            break;
        case "characters":
            self.tileLoc = imageSrc;
            self.tileType = "character";
            $('#myModal').modal('toggle')

            break;
        case "background":
            setBackground();
            $('#myModal').modal('toggle')

            break;
        case "save":
            saveLevel();
            break;
        case "play":
            /* Enter play game function here */
            break;
    }
});

