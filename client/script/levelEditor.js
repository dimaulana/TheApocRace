
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

var natureTile = new Image();
natureTile.src = "client/images/natureTile2.png";

var tile = new Image();
tile.src = "client/images/nTile.png";


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
    self.tileGrid = new Array(columns * rows);
    self.screenArray = new Array();
    
    self.tileMap = [];
    self.xOffset = 0;
    self.yOffset = 0;
    self.background = newyork2;
    self.currentScreen = 0;

    initiate();
}

    function initiate() {        
        for (var  i = 0; i < numberOfScreens; i++) {
            var destination = document.createElement('canvas');
            destination.width = self.gameWidth;
            destination.height = self.canvasHeight;
            var dCtx = destination.getContext("2d");
            dCtx.drawImage(background, 0, 0, gameWidth, canvasHeight);
            screenArray[i] = dCtx.getImageData(0, 0, gameWidth, canvasHeight);
        }
        self.ctx.drawImage(background, 0, 0, gameWidth, canvas.height, 0,0,gameWidth, canvas.height);
        drawToCanvas();

        self.canvas.addEventListener('click', mouseClick);
/*         self.canvas.addEventListener('mousemove', mouseMove);
 */           
    }

    function drawToCanvas() {
        var offset = 1280 * currentScreen;

        self.bCtx.putImageData(screenArray[currentScreen], offset, 0);
        screenArray[currentScreen] = self.ctx.getImageData(0,0,gameWidth, canvasHeight);

        displayGrid();
        var c2 = document.getElementById("editor2");
        c2ctx = c2.getContext("2d");
        console.log(c2);
        var imageData = bCtx.getImageData(offset, 0, canvasWidth, canvasHeight);
        c2ctx.putImageData(imageData, 0, 0);
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
    self.ctx.clearRect(0, 0, self.canvasHeight, self.gameWidth);
    self.ctx.drawImage(losAngeles1, 0, 0, background.width, background.height);
    drawToCanvas();
}

function pickTile() {
    let x = e.clientX;
}

function drawTile() {
    var tile = brickTile;
    for (var i = 0; i < self.tile; i++) {
        self.ctx.drawImage(tile, )
    }
    /* each time a tile is drawn, push to array + offset */
}

function pickCharacter() {

}

function drawCharacter() {

}

function saveLevel() {

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
    let x = e.clientX;
    let y = e.clientY;
    let gridX = Math.floor(x / tileSize) * tileSize;
    let gridY = Math.floor(y / tileSize) * tileSize;

    if (y < self.canvasHeight && x < self.canvasWidth) {
        self.ctx.clearRect(gridX, gridY, tileSize, tileSize);
        self.ctx.drawImage(tile, gridX, gridY, tileSize, tileSize);
        let tileX = Math.floor(x / tileSize);
        let tileY = Math.floor(y / tileSize);
        let targetTile = tileY * self.columns * tileX;
/*         tiles[targetTile] = sourceTile; */
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
            break;
        case "save":
            saveLevel();
            break;
        case "play":
            /* Enter play game function here */
            break;
    }
});