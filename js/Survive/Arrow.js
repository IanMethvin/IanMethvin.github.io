var TO_RADIANS = Math.PI/180; 

// Create Arrow object
function Arrow(options) {
    
    // Drawing properties
    this.state = options.state;
    this.ctx = this.state.ctx;
    this.image = options.image;
    this.width = this.image.width;
    this.height = this.image.height;
    // this.centerX = this.ctx.width / 2;
    // this.centerY = this.ctx.height / 2;
    this.directions = state.directions;
    this.edges = state.edges; 

    // Animation settings
    this.frameSize = 64;
    this.numberOfHFrames = arrowImage.width / this.frameSize;
    this.numberOfVFrames = arrowImage.height / this.frameSize;
    this.direction = options.direction;
    this.x = options.x;
    this.y = options.y + 6; // 6 is temp correction ammount 
    this.moveSpeed = 8;

    // this.centerX = this.x + (this.width / 2);
    // this.centerY = this.y + (this.height / 2);

    // Map for frame locations in sprite map
    this.arrowMap = {
        "arrowNorth": 1,
        "arrowEast": 0,
        "arrowSouth": 2,
        "arrowWest": 3,
    }
}

// Draw arrow flight animation
Arrow.prototype.renderArrow = function() {
    this.updatePosition();
    //this.ctx.drawImage(this.image, this.x, this.y);
    this.renderSprite();
}

// Move arrow in correct direction
Arrow.prototype.updatePosition = function() {
    var ms = this.moveSpeed;
    var dirs = this.directions;
    switch (this.direction) {
        case dirs["N"]:
            this.y -= ms;
            break;
        case dirs["E"]:
            this.x += ms;
            break;
        case dirs["S"]:
            this.y += ms;
            break;
        case dirs["W"]:
            this.x -= ms;
            break;
    }
}

// Draw the animation
Arrow.prototype.renderSprite = function() {
    // Rename variables for convenience 
    var img = this.image;
    var w = this.width;
    var h = this.height;
    var fSize = this.frameSize;
    var fIndex = this.arrowMap["arrow" + this.direction];
    var hFrames = this.numberOfHFrames;
    var vFrames = this.numberOfVFrames;
    var vfIndex = 0;//fIndex;

    // Set source variables
    var sx = fIndex * w / hFrames;
    var sy = vfIndex * fSize;
    var sw = w / hFrames;
    var sh = h / vFrames;

    // Set destination variables 
    var dx = this.x;
    var dy = this.y;
    var dw = w / hFrames;
    var dh = h / vFrames;

    this.state.ctx.drawImage(
        img, // Source image object
        sx, // Source x
        sy, // Source y
        sw, // Source width
        sh, // Source height
        dx, // Destination x
        dy, // Destination y
        dw, // Destination width
        dh // Destination height
    );
}

// Check is arrow is off canvas
Arrow.prototype.isOffScreen = function() {
    var isOffScreen = false;
    var dirs = this.directions;
    var e = this.edges;
    var padding = 0;
    switch (this.direction) {
        case dirs["N"]:
            isOffScreen = this.y < e[dirs["N"]] - padding;
            break;
        case dirs["E"]:
            isOffScreen = this.x > e[dirs["E"]] + padding;
            break;
        case dirs["S"]:
            isOffScreen = this.y > e[dirs["S"]] + padding;
            break;
        case dirs["W"]:
            isOffScreen = this.x < e[dirs["W"]] + padding;
            break;
    }
    return isOffScreen;
}