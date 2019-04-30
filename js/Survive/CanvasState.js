// Constructor for the current state of the canvas
function CanvasState(canvas) {
    var state = this;

    // Initialize canvas properties
    this.canvas = canvas;
    this.width = canvas.width;//window.innerWidth;
    this.height = canvas.height;//window.innerHeight;
    this.ctx = canvas.getContext('2d');
    this.edges = {
        "North": -12,
        "East": 748,
        "South": 735,
        "West": -12
    };
    this.directions = {
        "N": "North",
        "E": "East",
        "S": "South",
        "W": "West"
    }

    // Game settings
    this.isGameStarted = false;
    this.isGameOver = false;
    this.gameScore = 0;
    this.mobs = [];
    this.mobSpawnCount = 0;
    this.mobSpawnCountLimit = 1000;

    // Create surviver
    this.surviver = new Surviver({
        state: state,
        image: suriverImage,
        ticksPerFrame: 5,
        direction: this.directions["S"],
        action: "move",
        moveSpeed: 3,
        x: this.width / 2 - 32,
        y: this.height / 2 - 32
    });

    // Map to track key presses
    this.surviverKeyMap = {
        16: false, // shift
        32: false, // space
        65: false, // a
        68: false, // d
        83: false, // s
        87: false // w
    };

    window.addEventListener("keydown", function(e) {
        var map = state.surviverKeyMap;
        if (e.keyCode in map) {

            if (!state.isGameStarted && e.keyCode == 32) {
                state.startGame();
            }
            else {
                map[e.keyCode] = true;
                state.checkMotion();
            }
        }
    });
    window.addEventListener("keyup", function(e) {
        var map = state.surviverKeyMap;
        if (e.keyCode in map) {
            map[e.keyCode] = false;
            state.checkMotion();
        }
    });

    this.initialDrawing();
}

// Draw function
CanvasState.prototype.draw = function() {
    var s = this.surviver;
    // Game drawing
    this.drawBackground();
    this.checkMobSpawn();
    // Surviver drawing
    s.updateSprite();
    s.renderSprite();
    // Mob Drawing
    this.manageMobs();
    this.mobs = this.mobs;

    if (!this.isGameOver) {
        requestAnimationFrame(this.draw.bind(this));
    }
}

CanvasState.prototype.manageMobs = function() {
    var ms = this.mobs;
    var s = this.surviver;
    var state = this;
    var remainingMobs = [];
    
    _.each(ms, function(m) {
        m.move(m.generateKMap(s.x, s.y));
        m.updateSprite();
        m.renderSprite();
        // check if Arrow has hit Mob
        _.each(s.quiver, function(arrow) {
            state.checkContactMade(m, arrow);
            // REMOVE ARROW IF CONTACT MADE
        });
        if (!m.isDead) {
            remainingMobs.push(m);
        }
        else {
            state.gameScore += 10;
        }
        // check if Mob has hit Surviver
        state.checkContactMade(s, m);
    });

    this.mobs = remainingMobs;
}

// Check timer and see if it is time to spawn a mob
CanvasState.prototype.checkMobSpawn = function() {
    if (this.mobSpawnCount > this.mobSpawnCountLimit || this.mobs.length == 0) {
        this.mobs.push(new Mob({
            state: this,
            image: mobImages["Skeleton"],
            ticksPerFrame: 10,
            direction: this.directions["S"],
            action: "move",
            moveSpeed: .5,
            x: this.randomX(),
            y: this.randomY()
        }));
        this.mobSpawnCount = 0;
    }
    this.mobSpawnCount += 1;
}

// Start game
CanvasState.prototype.startGame = function() {
    this.isGameStarted = true;    
    // start the animation
    requestAnimationFrame(state.draw.bind(this));
}

// Write end game message to screen
CanvasState.prototype.endGame = function() {
    this.isGameOver = true;
    var ctx = this.ctx;
    ctx.font = "50px Impact MS";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", this.width/2, this.height/2 - 25); 
    // ADD FINAL SCORE
}

// Check if attacker has made contact with target
CanvasState.prototype.checkContactMade = function(target, attacker) {
    // object that is doing the damage
    var a = attacker;
    // object that will be getting hurt
    var t = target;
    var ts = t.frameSize / 2;
    if (!t.isHurt && a.x < t.x + ts && a.x + ts > t.x && a.y < t.y + ts && a.y + ts > t.y) {
        t.action = "hurt";
        t.frameIndex = 0;
        t.isHurt = true;
        t.setFramePosition();
    }
}

// Check if any movement or action is occuring and update accordingly 
CanvasState.prototype.checkMotion = function(map) {
    var map = this.surviverKeyMap;
    var inAction = false;
    for (var key in map) {
        if (map[key]) {
            inAction = true;
            state.surviver.move(map, "shoot");
            break;
        }
    }
    if (!inAction) {
        state.surviver.stopAction();
    }
}

// Draw start screen
CanvasState.prototype.initialDrawing = function() {
    this.drawBackground();
    var ctx = this.ctx;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "20px Impact MS";
    // Game play instructions 
    ctx.fillText("W A S D to move", this.width / 2, this.height - 50); 
    ctx.fillText("Space to attack", this.width / 2, this.height - 75); 
    ctx.fillText("Press Space to start", this.width / 2, this.height / 2 + 55); 
    // title
    ctx.fillStyle = "#660000";
    ctx.font = "60px Impact MS";
    ctx.fillText("Survive?", this.width / 2, this.height / 2 - 30); 
    // add surviver
    this.surviver.renderSprite();
}

// Fill in background display 
CanvasState.prototype.drawBackground = function () {
    var ctx = this.ctx;
    var w = this.width;
    var h = this.height;
    this.clear();

    // Fill in 
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, w, h);

    // Draw Score
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "20px Impact MS";
    ctx.fillText("Score: " + this.gameScore, this.width - 75, 20); 
}

// Clear the canvas
CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
}

// Generate random x on canvas
CanvasState.prototype.randomX = function() {
    return randomIntFromInterval(0, this.edges["East"]);
}

// Generate random y on canvas
CanvasState.prototype.randomY = function() {
    return randomIntFromInterval(0, this.edges["South"]);
}