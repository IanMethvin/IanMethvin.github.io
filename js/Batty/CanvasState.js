// Constructor for the current state of the canvas
function CanvasState(canvas) {
    var cState = this;
    
    // Initialize canvas properties
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');

    // Initialize game properties
    this.gameScore = 0;
    this.gameRunning = false;
    this.gameOver = false;
    this.drawInterval = 5;
    this.scoreInterval = 100;
    this.obstacleInterval = 500;
    this.obstacles = [];

    // Tracks the horizontal offset of the background image
    this.vx = -2;

    // Establish background image src and defines actions on image laod
    this.backgroundImage = new Image(5042, 657);

    // Load event needed to specify exactly when to draw the background and other game related features
    this.backgroundImage.addEventListener('load', function() {
        cState.drawBackground();
        
        // Initialize Batty after background loads
        cState.batty = new Batty(cState.width * .20, cState.height * .25);

        // Initialize game drawing only after background and batty images are loaded
        cState.clear();
        cState.draw();
      }, false);
      
    this.backgroundImage.src = 'img/Batty/background.png';

    // Listener to track mouse click events
    canvas.addEventListener('mousedown', function(e) {
        // Start game if it isnt running
        if (!cState.gameRunning && !cState.gameOver) 
        { 
            cState.startGame(cState); 
            return;
        }

        // If game is running, make Batty flap
        if (cState.gameRunning) {
            cState.batty.flap();
        }
    }, true);

    // Listener to prevent surrounding text from being selected on double click.
    canvas.onselectstart = function () { 
        return false; 
    }    
}

// Start intervals and set state.
CanvasState.prototype.startGame = function() {
    var cState = this;
    cState.gameRunning = true;
    cState.cInterval = setInterval( function() { cState.draw(); }, cState.drawInterval );
    cState.sInterval = setInterval( function() { cState.incrementScore(); }, cState.scoreInterval )
    cState.oInterval = setInterval( function() { cState.addObstacle(); }, cState.obstacleInterval )

    // Play the background music if audio isn't muted
    if (!audioMuted) {
        backgroundMusic.play();
    }
}

// Reset game state and redraw inital image.
CanvasState.prototype.restartGame = function() {
    this.gameScore = 0;
    this.gameRunning = false;
    this.gameOver = false;
    this.obstacles = [];

    var batty = this.batty;
    this.batty.x = batty.startingX;
    this.batty.y = batty.startingy;

    this.clear();
    this.draw();

    cState.startGame();
}

// Increase game score
CanvasState.prototype.incrementScore = function() {
    this.gameScore++;
}

CanvasState.prototype.drawBackground = function () {
    var ctx = this.ctx;
    
    // Lower global alpha to reduce opacity when drawing the background image
    ctx.globalAlpha = 0.5;

    // Two draw instances needed for continuous scrolling
	ctx.drawImage(this.backgroundImage, this.vx, 50);
	ctx.drawImage(this.backgroundImage, this.backgroundImage.width - Math.abs(this.vx), 50);
    
    // Reset offset if it is past the width of the background image
	if (Math.abs(this.vx) > this.backgroundImage.width) {
		this.vx = 0;
	}
    
    // Adjust horizontal offset
    this.vx -= 2;

    // Restore global alpha
    ctx.globalAlpha = 1;
};

// Draw game and check for end game state.
CanvasState.prototype.draw = function () {
    var ctx = this.ctx;
    var w = this.width;
    var h = this.height;
    this.clear();

    // Fill in cave dark grey
    ctx.fillStyle = "#1c1c1c";
    ctx.fillRect(0, 0, w, h);

    // Draw background before batty to ensure background loads underneath
    cState.drawBackground();

    // Draw Batty
    var batty = this.batty;
    batty.fly();
    ctx.drawImage(batty.img, batty.x, batty.y, batty.width, batty.height);

    // Draw Obstacles
    var os = this.obstacles
    for (i = 0; i < os.length; i++) {
        var o = os[i];
        o.move();
        ctx.drawImage(o.img, o.x, o.y, o.width, o.height);
    }

    // If Batty is off the screen, game over
    if (this.isGameOver()) {
        cState.endGame();
    }
    else {
        // Draw score
        ctx.font = "25px Impact MS";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: " + cState.gameScore, cState.width - 130, 30); 
    }
}

// 70% chance to add an obstacle to be drawn .
CanvasState.prototype.addObstacle = function() {
    var chance = randomIntFromInterval(0,10);
    if (chance > 7)
        cState.obstacles.push(new Obstacle(cState.width + 30, getRandomY()));
}

// Check game state to see if game should be over.
CanvasState.prototype.isGameOver = function() {
    var b = this.batty;
    if (b.y > this.height - (b.height / 2) || b.y < 0) {
        return true;
    }

    var os = this.obstacles;
    for (i = 0; i < os.length; i++) {
        var o = os[i];
        // If obstacle is offscreen, remove it
        if (o.x < -(o.width / 2)) {
            this.obstacles.splice(i, 1);
            i--;
        }

        // Check it Batty has overlap with the object
        if ((b.x < o.x + o.width/2 && b.x  > o.x - o.width/2 ) 
            && (b.y < o.y + o.height/2 && b.y > o.y - o.height/2)) {
            return true;
        }
    }

    return false;
}

// Detect if Batty is touching any obsticles 
CanvasState.prototype.detectCollision = function(o) {
    var b = this.batty;

    // Remove some pixels to adjust for the image width
    var oW = o.width;// - 5;
    var oH = o.hieght;// - 5;

    var distX = Math.abs(b.x - o.x - oW / 2);
    var distY = Math.abs(b.y - o.y - oH / 2);

    if (distX > (oW / 2 + b.width)) {
        return false;
    }
    if (distY > (oH / 2 + b.width)) {
        return false;
    }

    if (distX <= (oW/ 2)) {
        return true;
    }
    if (distY <= (oH / 2)) {
        return true;
    }

    var dx = distX - oW / 2;
    var dy = distY - oH / 2;
    return (dx * dx + dy * dy <= (b.width * b.width));

}

// Display game over message and offer restart.
CanvasState.prototype.endGame = function() {
    cState.gameRunning = false;
    cState.gameOver = true;
    clearInterval(cState.cInterval);
    clearInterval(cState.sInterval);
    clearInterval(cState.oInterval);

    // Reset background music when game ends
    backgroundMusic.pause();
    backgroundMusic.load();

    // Draw game over
    var ctx = cState.ctx;
    ctx.font = "50px Impact MS";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", cState.width/2, cState.height/2 - 25); 

    // Draw score
    ctx.font = "25px Impact MS";
    ctx.fillText("Score: " + cState.gameScore, cState.width/2, cState.height/2 + 25); 

    // Draw restart
    ctx.font = "35px Impact MS";
    ctx.fillText("Press Space Bar To Restart The Game", cState.width/2, cState.height - 50); 
}

// Clear the canvas
CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
}

// Check if user has clicked "Restart" on end game screen.
CanvasState.prototype.isRestartClick = function(mouse) {
    var x = mouse.x;
    var y = mouse.y;
    if (x > this.width/2 - 100 && x < this.width/2 + 100
        && y > this.height - 200 && y < this.height - 50)
        return true;

    return false;
}

// Retrieve the user's current mouse position.
CanvasState.prototype.getMousePosition = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
    
    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }
  
    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;
    
    // Return a simple javascript object (a hash) with x and y defined.
    return {x: mx, y: my};
}