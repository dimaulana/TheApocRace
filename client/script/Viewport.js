/* Viewport object helps to draw the level assets 
   based on the current position of the screen

   Can be relative to player or any other case where needed.

   Author: Hussein Parpia
*/

function Viewport (x, y, w, h) {
	this.x = x; // Upper left x-position of the viewport
	this.y = y; // Upper left y-position of the viewport
	this.w = w; // Width of the viewport
	this.h = h; // Height of th viewport

	// Update the viewport relative to the entity;
	this.update = function(relativeTo, entity) {

		switch (relativeTo) {
			case "Player":
				// Trying to center the player to the viewport;
				// Note: this.y does not change as we are moving camera just to the left or right;
				if (entity.x > ((this.w / 2) - entity.width/2)) {
					this.x = entity.x - (this.w / 2 - entity.width/2);
				}
				else {
					this.x = 0; // Return viewport to the original position;
				}
			break;

			// Add more cases if needed; For example, in the case of Level Editor,
			// We could have a mock entity where whenever the user clicks next screen button
			// The viewport will be updated based on the desired position;
			// You can also add your own calculations as well;
		}
	}
}