var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
/* Declare the Menu pages */
var mainMenu = ["Play", "Build", "Options", "Extras", "Sign Out"];
var buildMenu = ["New Level", "Load Level", "Back"]; 
var playMenu = ["Story Mode", "Custom", "Back"];
var currentPage;

var MenuBuilder = function(socket){
    var self = {
        socket: socket
    }
}

/* Shows button clicked where to go */
$(document).ready(function() {
    $('.menu').on('click', '.btn', function() {
        var menuClicked = $(this).text();
        $(".interface").html("");
        $(".btn-group-vertical").html("");
        if (currentPage === "mainMenu") {
            switch(menuClicked) {
                case "Play" :
                    generateMenus("playMenu");
				
                    break;
                case "Build":
                    generateMenus("buildMenu");
                    break;
                case "Options":
                    $('.interface').load('client/interface/LevelEditor.html');
                    break;            
                case "Extras":
                    $('.interface').load("ENTER PAGE URL HERE");
                    break;
                case "Sign Out":
                    /* Add account signed out function here. */ 
                    $('#account').show();   
            }
        }
        else if (currentPage === "buildMenu") {
            switch(menuClicked) {
                case "New Level":
                    $('.interface').load("ENTER PAGE URL HERE");
                    break;
                case "Load Level": 
                    $('.interface').load("ENTER PAGE URL HERE");
                    break;          
                case "Back":
                    generateMenus("mainMenu");
                    break;
            }
        }
        else {
            switch(menuClicked) {
                case "Story Mode":
                    $('#gameCan').show();
                    startNewGame();
                    break;
                case "Custom":
                    $('.interface').load("ENTER PAGE URL HERE");
                    break;
                case "Back":
                    generateMenus("mainMenu");
                    break;
            }
        }
    });
});

/* Function that generates all the menu options */
function generateMenus(k) {
    var items = [];
    if (k === "playMenu") {
        currentPage = k;
        $.each(playMenu, function(i) {
            items.push("<button id='playMenu-"+playMenu[i]+"' class='btn btn-primary btn-lg ml-2 type='submit'>"+playMenu[i]+"</button>")
        });
        $(items.join('')).appendTo(".btn-group-vertical");
        }
    else if (k === "buildMenu") {
        currentPage = k;
        $.each(buildMenu, function(i) {
            items.push("<button id='playMenu-"+buildMenu[i]+"' class='btn btn-primary btn-lg ml-2 type='submit'>"+buildMenu[i]+"</button>")
        });
        $(items.join('')).appendTo(".btn-group-vertical");
        }
    else {
        $.each(mainMenu, function(i) {
            currentPage = k;
            items.push("<button id='playMenu-"+mainMenu[i]+"' class='btn btn-primary btn-lg ml-2 type='submit'>"+mainMenu[i]+"</button>")
        });
        $(items.join('')).appendTo(".btn-group-vertical");
        }
    }


