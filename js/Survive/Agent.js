 // Create Base Agent object for Surviver & Mob to inherit 
function Agent(options) {

    // Drawing properties
    this.state = options.state;
    this.image = options.image;
    this.width = this.image.width;
    this.height = this.image.height;

    // Animation settings
    this.frameSize = 64;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.numberOfHFrames = suriverImage.width / this.frameSize;
    this.numberOfVFrames = suriverImage.height / this.frameSize;
    this.loop = true;

    // Position settings
    this.moveSpeed = options.moveSpeed;
    this.boostSpeed = 12;
    this.x = options.x;
    this.y = options.y;
    this.moving = false;
    this.directions = this.state.directions
    this.direction = options.direction;
    this.action = options.action;

    // Attack settings
    this.isAttacking = false;
    this.isHurt = false;

    // Map for frame locations in sprite map
    this.movementMap = {
        "moveFrames": 9,
        "moveNorth": 8,
        "moveEast": 11,
        "moveSouth": 10,
        "moveWest": 9,
        "shootFrames": 11,
        "shootNorth": 16,
        "shootEast": 19,
        "shootSouth": 18,
        "shootWest": 17,
        "arrowFire": 9,
        "slashFrames": 6,
        "slashNorth": 12,
        "slashEast": 15,
        "slashSouth": 14,
        "slashWest": 13,
        "hurtFrames": 6,
        "hurt": 20
    }

    this.setFramePosition();
}


// Update coordinates to move Surviver
Agent.prototype.move = function(kMap) {
    // dont allow movement if hurt
    if (this.isHurt) {
        return;
    }

    var ms = this.moveSpeed;
    var edges = this.state.edges;
    var dirs = this.directions;
    var d;
    // speed boost for testing
    if (kMap[16]) {
        ms = this.boostSpeed;
    }
    // north
    if (kMap[87]) {
        d = dirs["N"];
        if (this.y >= edges[d]) {
            this.y -= ms;
        }
        this.direction = d;
    }
    // east
    if (kMap[68]) { 
        d = dirs["E"]
        if (this.x <= edges[d]) {
            this.x += ms;
        }
        this.direction = d;
    }
    // south
    if (kMap[83]) { 
        d = dirs["S"];
        if (this.y <= edges[d]) {
            this.y += ms;
        }
        this.direction = d;
    }
    // west
    if (kMap[65]) {
        d = dirs["W"];
        if (this.x >= edges[d]) {
            this.x -= ms;
        }
        this.direction = d;
    }
    // attack
    if (kMap[32]) {
        this.action = this.attackType;
        this.isAttacking = true;
    }
    else if (!this.isHurt) {
        this.action = "move";
        if (this.frameIndex > this.movementMap[this.action + "Frames"]) {
            this.frameIndex = 1;
        }
    }
    // check if directional key is pressed and set movement bool accordingly 
    if (kMap[87] || kMap[68] || kMap[83] || kMap[65]) {
        this.moving = true;
    }
    else {
        this.moving = false;
    }

    this.setFramePosition();
}

// Draw the animation
Agent.prototype.renderSprite = function() {
    // Rename variables for convenience 
    var img = this.image;
    var w = this.width;
    var h = this.height;
    var fSize = this.frameSize;
    var fIndex = this.frameIndex;
    var hFrames = this.numberOfHFrames;
    var vFrames = this.numberOfVFrames;
    var vfIndex = this.vFrameIndex;

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

Agent.prototype.stopAction = function() {  
    this.moving = false;
    this.action = "move";
}

// Set frame index based off action and update number of frames for that action
Agent.prototype.setFramePosition = function() {
    var ad = this.action;
    if (this.action != "hurt") {
        ad += this.direction
    }
    this.vFrameIndex = this.movementMap[ad];
    this.hFrameCount = this.movementMap[this.action + "Frames"];
}