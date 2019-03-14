var newyork2 = new Image();
newyork2.src = "client/images/newyork2.png";

var newyork1 = new Image();
newyork1.src = "client/images/newyork1.png";




levelEditor = function () {
    console.log("Creating level editor.");

    self.canvasWidth = 1280;
    self.canvasHeight = 720;
/* Set tile properties to draw columns, rows and total level dimensions */
    self.tileSize = 40; 
    self.tileMap = [];
    self.canvas = document.getElementById("editor");
    self.ctx = canvas.getContext("2d");

/*     self.columns = Math.floor(levelWidth / tileSize);
 */    self.columns = Math.floor(canvasWidth / tileSize);

/*     self.rows = Math.floor(levelHeight / tileSize);
 */    self.rows = Math.floor(canvasHeight / tileSize);


    self.background = newyork2;
    
/*     self.setHTML();
    self.addEventListeners();
    self.menuClicks(); */
    self.initiate();
    self.displayGrid();
}


self.initiate = function() {
    self.ctx.drawImage(background, 0,0, background.width, background.height);

   
}




self.displayGrid = function() {
    var boxes = self.rows  * self.columns;
    var len = boxes * tileSize;
    console.log("boxes: "+boxes);

    console.log("columns: "+self.columns);
    console.log("rows: "+self.rows);

/*     for (var i = 0; i < boxes; i++) {
        ctx.beginPath();
        ctx.moveTo(tileSize + tileSize * i - .5, 0);
        ctx.lineTo(tileSize + tileSize * i - .5, len);
        ctx.moveTo(0, tileSize + tileSize * i - .5);
        ctx.lineTo(len, tileSize + tileSize * i - .5);
        ctx.stroke();
     } */


    /* Vertical grid */
    console.log(tileSize);
    for (var i = 0; i < self.columns; i++) {
        self.ctx.beginPath();
        self.ctx.moveTo(i * tileSize, 0);
        self.ctx.lineTo(i * tileSize, self.rows * tileSize);
        self.ctx.stroke();
    }
    /* Horizontal Grid */
    for (var i = 0; i < self.rows; i++) {
        self.ctx.beginPath();
        self.ctx.moveTo(0, i * tileSize);
        self.ctx.lineTo(self.columns * tileSize, i * tileSize);
        self.ctx.stroke();
    }

}

function setBackground() {
    self.ctx.clearRect(0, 0, self.canvasHeight, self.canvasWidth);
    self.ctx.drawImage(background, 0, 0, background.width, background.height);
    displayGrid();
}


$(document).on("click",".objects li",function(e){
/*     e.stopPropagation(); */
    $('li').css({ "background-color" : "#173B0B" })
    $(this).css({ "background-color" : "#FF8000" });
    var selected = $(this).attr('id');
    switch(selected) {
        case "back":
            $(".interface").html("");
            generateMenus('buildMenu')
        case "tiles": 
            drawTile();
            break;
        case "characters":
            drawCharacter();
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

