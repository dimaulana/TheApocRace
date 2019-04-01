var script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var gameMenu = ["Resume","Inventory", "Abort Mission", "Quit","Save"];

/* Shows button clicked where to go *

/* Function that generates all the pause options */
function generatePaused() {
    var items = [];
        $.each(gameMenu, function(i) {
            items.push("<button id='gameMenu-"+gameMenu[i]+"' class='btn btn-primary btn-lg ml-2 type='submit'>"+gameMenu[i]+"</button>")
        });
        $(items.join('')).appendTo(".paused");
	//	$('.paused').appendTo('#game');
		//calls div to appear
		//$('.paused').show();
}