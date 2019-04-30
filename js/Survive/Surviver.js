// Create Surviver object
function Surviver(options) {

    // Inherit Agent's properties and functions
    Agent.call(this, options);

    // Surviver specific items
    this.attackType = "shoot";
    this.quiver = [];
}

// Setup the prototype chain 
Surviver.prototype = Object.create(Agent.prototype);


// Update sprite frame index for animation
Surviver.prototype.updateSprite = function() {
    this.tickCount += 1;
    // Only move frame index if in motion
    if (this.isAttacking || this.moving || this.isHurt) {
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            // If the current frame index is in range
            if (this.frameIndex < this.hFrameCount - 1) {	
                // Go to the next frame
                this.frameIndex += 1;
                // Only fire the arrow once the correct frame has been reached
                if (this.isAttacking && this.frameIndex == this.movementMap["arrowFire"]) {
                    this.quiver.push(new Arrow({
                        state: this.state,
                        image: arrowImage, //arrowImages[this.direction],
                        direction: this.direction,
                        x: this.x,
                        y: this.y
                    }));
                }
            }
            else if (this.loop) {
                if (this.isHurt) {
                    this.state.endGame();
                    return;
                }
                // check if attack animation has completed, if so switch to 'move' frame
                if (this.action != "shoot") {
                    this.isAttacking = false;
                    this.action = "move";
                    this.setFramePosition();
                }
                this.frameIndex = 0;
            }
        }
    }

    // Draw each arrow
    var remainingArrows = [];
    _.each(this.quiver, function(arrow) {
        arrow.renderArrow();
        // Stop drawing any arrows that are no longer on the canvas
        if (!arrow.isOffScreen()) {
            remainingArrows.push(arrow);
        }
    });
    this.quiver = remainingArrows;
}