var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
/* Declare the Menu pages */
var mainMenu = ["Play", "Build", "Options", "Extras", "Sign Out"];
var buildMenu = ["New Level", "Load Level", "Back"];
var playMenu = ["Story Mode", "Custom", "Back"];
var extraMenu = ["Credits", "LeaderBoard", "Back"];
var optionsMenu = ["Controls", "Sound", "Back"];

var currentPage;

var MenuBuilder = function (socket) {
    var self = {
        socket: socket
    }
}

/* Shows button clicked where to go */
$(document).ready(function () {
    $('.menu').on('click', '.btn', function () {
        var menuClicked = $(this).text();
        $(".interface").html("");
        $(".btn-group-vertical").html("");
        if (currentPage === "mainMenu") {
            switch (menuClicked) {
                case "Play":
                    generateMenus("playMenu");
                    break;
                case "Build":
                    generateMenus("buildMenu");
                    break;
                case "Options":
                    generateMenus("optionsMenu");
                    break;
                case "Extras":
                    generateMenus("extraMenu");
                    break;
                case "Sign Out":
                    /* Add account signed out function here. */
                    $('#account').show();
            }
        } else if (currentPage === "extraMenu") {
            switch (menuClicked) {
                case "Credits":
                   $('.interface').load("client/credits.html");
                    break;
                case "LeaderBoard":
                    $('.interface').load("client/profile.html");
                    break;
                case "Back":
                    generateMenus("mainMenu");
                    break;
            }
        } else if (currentPage === "buildMenu") {
                switch (menuClicked) {
                    case "New Level":
                    $('.interface').load("client/levelEditor.html", startEditor);
                        break;
                    case "Load Level":
                    $('.interface').load("client/levelEditor.html", loadEditor);
                        break;
                    case "Back":
                        generateMenus("mainMenu");
                        break;
                }      
        } else if (currentPage === "optionsMenu") {
            switch (menuClicked) {
                case "Controls":
                    $('.interface').load("client/controls.html");
                break;
                case "Sound":
                    $('.interface').load("client/sounds.html");
                    break;
                case "Back":
                    generateMenus("mainMenu");
                    break;
            }
        } else {
            switch (menuClicked) {
                case "Story Mode":
                    loadGame('story', 'story1'); // Start game level 1;
                    break;
                case "Custom":
                    //$('.interface').load("ENTER PAGE URL HERE");
                    getCustom();
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
        $.each(playMenu, function (i) {
            items.push("<button id='playMenu-" + playMenu[i] + "' class='btn btn-primary btn-lg ml-2' type='submit'>" + playMenu[i] + "</button>");
        });
        $(items.join('')).appendTo(".btn-group-vertical");
    } else if (k === "buildMenu") {
        currentPage = k;
        $.each(buildMenu, function (i) {
            items.push("<button id='playMenu-" + buildMenu[i] + "' class='btn btn-primary btn-lg ml-2' type='submit'>" + buildMenu[i] + "</button>");
        });
        $(items.join('')).appendTo(".btn-group-vertical");
    } else if (k === "optionsMenu") {
        currentPage = k;
        $.each(buildMenu, function (i) {
            items.push("<button id='playMenu-" + optionsMenu[i] + "' class='btn btn-primary btn-lg ml-2' type='submit'>" + optionsMenu[i] + "</button>");
        });
        $(items.join('')).appendTo(".btn-group-vertical");
    } else if (k === "extraMenu") {
        currentPage = k;
        $.each(extraMenu, function (i) {
            items.push("<button id='playMenu-" + extraMenu[i] + "' class='btn btn-primary btn-lg ml-2' type='submit'>" + extraMenu[i] + "</button>");
        });
        $(items.join('')).appendTo(".btn-group-vertical");
    } else {
        $.each(mainMenu, function (i) {
            currentPage = k;
            items.push("<button id='playMenu-" + mainMenu[i] + "' class='btn btn-primary btn-lg ml-2' type='submit'>" + mainMenu[i] + "</button>");
        });
        $(items.join('')).appendTo(".btn-group-vertical");
    }
}