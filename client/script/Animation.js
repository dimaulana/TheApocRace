/* Animation class that handles the basics of animation

   Author: Hussein Parpia

*/

function Animation(frame_set, delay) {

    this.count = 0;
    this.delay = delay; // The number of game cycles to wait until the next frame change.
    this.frame = 0;
    this.frame_index = 0;
    this.frame_set = frame_set;

    this.change = function(frame_set, delay = 15) {
    	if (this.frame_set != frame_set) {
    		this.count = 0;
    		this.delay = delay;
    		this.frame_index = 0;
    		this.frame_set = frame_set;
    		this.frame = this.frame_set[this.frame_index];
    	}
    }

    this.update = function() {
    	this.count ++;

		if (this.count >= this.delay) { // If enough cycles have passed, we change the frame.
    		this.count = 0; // Reset count;
    		this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
    		this.frame = this.frame_set[this.frame_index]; // Update current frame;
    	}
    }
}