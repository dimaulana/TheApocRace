/* Viewport object helps to draw the level assets
   based on the current position of the screen

   Can be relative to player or any other case where needed.

   Author: Hussein Parpia
*/

function Viewport(x, y, w, h) {
	this.x = x; // Upper left x-position of the viewport
	this.y = y; // Upper left y-position of the viewport
	this.w = w; // Width of the viewport
	this.h = h; // Height of the viewport

	// Update the viewport relative to the entity;
	this.update = function (relativeTo, entity) {

		switch (relativeTo) {
			case "Player":
				// Trying to center the player to the viewport;
				// Note: this.y does not change as we are moving camera just to the left or right;
				if (entity.properties.pos.x > ((this.w / 2) - entity.properties.width / 2)) {
					this.x = entity.properties.pos.x - (this.w / 2 - entity.properties.width / 2);
				} else {
					this.x = 0; // Return viewport to the original position;
				}
			break;
			case "Editor":
				if (entity === "prev") this.x = 1280;
				if (entity === "next") this.x = -1280;
			break;
		}
	}

	// Check if the entity is in the viewport;
	this.inView = function (entity, margin) {
		return (entity.properties.pos.x >= this.x - margin &&
				entity.properties.pos.x <= this.x + this.w + margin);
	}
}