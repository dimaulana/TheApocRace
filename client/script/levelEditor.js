var newyork2 = new Image();
newyork2.src = "client/images/newyork2.png";

var newyork1 = new Image();
newyork1.src = "client/images/newyork1.png";

var losAngeles1 = new Image();
losAngeles1.src = "client/images/losAngeles1.png";

var losAngeles3 = new Image();
losAngeles3.src = "client/images/losAngeles3.png";

var brickTile = new Image();
brickTile.src = "client/images/brickTile1.png";
brickTile.height = 40;
brickTile.width = 40;
brickTile.type = "tile";

var natureTile = new Image();
natureTile.src = "client/images/natureTile2.png";

var tile = new Image();
tile.src = "client/images/nTile.png";

var character = new Image();
character.src = "client/images/running.png"
character.height = 80;
character.width = 40;
character.type = "character"

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
    self.tileMap = new Array(columns * rows);
    self.screenArray = {};

    self.tile = brickTile;
    
    self.tileMap = {};
    self.xOffset = 0;
    self.yOffset = 0;
    self.background = newyork2;
    self.currentScreen = 0;

    self.mouseDown = false;


    initiate();
}

    function initiate() {        
        self.canvas.addEventListener('click', mouseClick, false);
        self.canvas.addEventListener('mousedown', rightClick, false);
        document.addEventListener('contextmenu', event => event.preventDefault());

        for (var  i = 0; i < numberOfScreens; i++) {
            var destination = document.createElement('canvas');
            destination.width = self.gameWidth;
            destination.height = self.canvasHeight;
            var dCtx = destination.getContext("2d");
            dCtx.drawImage(background, 0, 0, gameWidth, canvasHeight);
            screenArray[i] = dCtx.getImageData(0, 0, gameWidth, canvasHeight);
        }
        self.canvas.style.background = "url('"+newyork1.src+"')";
        updateData();

    }

    function updateData() {
        var offset = 1280 * currentScreen;
        screenArray[currentScreen] = self.ctx.getImageData(0,0,gameWidth, canvasHeight);
        displayGrid();
        var imageData = screenArray[currentScreen];
    }

    function transition() {
/*         var destination = document.createElement('canvas');
        destination.width = self.gameWidth;
        destination.height = self.canvasHeight; */
        var destination = screenArray[currentScreen];
        self.ctx.putImageData(destination, 0, 0);
       displayGrid();
    }

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
    updateData();
}

function pickTile() {
    let x = e.clientX;
}

function drawTile(e) {
    

    /* each time a tile is drawn, push to array + offset */
}

function pickCharacter() {

}

function drawCharacter() {

}

function saveLevel() {

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

function mouseClick(e) {
    var mouse = mousePosition(self.canvas, e);
    let gridX = Math.floor(mouse.x / tileSize) * tileSize;
    let gridY = Math.floor(mouse.y / tileSize) * tileSize;
        if (mouse.y < canvasHeight && mouse.x < gameWidth) {
            self.ctx.clearRect(gridX, gridY, tile.width, tile.height);
            self.ctx.drawImage(tile, gridX, gridY, tile.width , tile.height)
            let tileX = Math.floor(mouse.x / tile.width);
            let tileY = Math.floor(mouse.y / tile.height);
            let targetTile = tileY * columns + tileX;
            var item = {
                "img" : tile.src,
                "type" : tile.type,
                "x" : gridX,
                "y" : gridY,
                "height" : tile.height,
                "width" : tile.width
            }

            if (tile.type === "character") {
                tileMap[targetTile] = item;
                tileMap[targetTile + self.columns] = item;

            }
            else if (tile.type === "tile") {
                tileMap[targetTile] = item;
            }


            console.log(tileMap);     
        }
}

function rightClick(e) {

    self.mouseDown = true;
    var mouse = mousePosition(self.canvas, e);

    let tileX = Math.floor(mouse.x / tile.width);
    let tileY = Math.floor(mouse.y / tile.height);
    let targetTile = tileY * columns + tileX;
  
    if (tileMap[targetTile]) {
        var topX = tileMap[targetTile].x;
        var topY = tileMap[targetTile].y;
        var height = tileMap[targetTile].height;
        var width = tileMap[targetTile].width;
    
 
    
        if (mouse.y < canvasHeight && mouse.x < gameWidth) {
            self.ctx.clearRect(topX, topY, width, height);
            if (tile.type === "character") {
                delete tileMap[targetTile];
                delete tileMap[targetTile + columns];

            }
            else if (tile.type === "tile") {
                delete tileMap[targetTile];
            }
        }
    }

}


/* function mouseMove(e) {
    let x = e.clientX;
    let y = e.clientY;

    if (y > canvasHeight && y < (canvasHeight * 2) && x < canvasWidth) {
        let gridX = Math.floor(x / tileSize) * tileSize;
        let gridY = Math.floor(y / tileSize) * tileSize;
        self.ctx.clearRect(0, 0, canvasHeight, canvasWidth); 
        self.ctx.beginPath();
        self.ctx.stroke();
    }
} */


$(document).on("click", ".objects li", function (e) {
    $('li').css({
        "background-color": "#173B0B"
    })
    $(this).css({
        "background-color": "#FF8000"
    });
    var selectedOption = $(this).attr('id');

    var imageId = $("img", this).attr("id");

    switch (selectedOption) {
        case "back":
            $(".interface").html("");
            generateMenus('buildMenu')
        case "tiles":
            pickTile();
            break;
        case "characters":
            pickCharacter();
            break;
        case "background":
            setBackground();
            self.tile = character;
            break;
        case "save":
            saveLevel();
            break;
        case "play":
            /* Enter play game function here */
            break;
    }
});