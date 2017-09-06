// Constructor for the current state of the canvas
function CanvasState(canvas) {
    
    // Initialize canvas properties
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');

    // Initialize game state properties
    this.quadrantDividend = 200;
    this.isUserTurn = true;
    this.movesListX = [];
    this.movesListO = [];

    this.gameWinner = null;

    // Listener to track mouse click events to place a move
    canvas.addEventListener('mousedown', function(e) {
        if (cState.gameWinner != null) { return; }

        var mouse = cState.getMousePosition(e);
        var quad = cState.getQuadrantPosition(mouse.x, mouse.y);

        // If user clicked inside of a quadrant and a move has not been made there yet.
        if (quad && !cState.moveMade(quad)) {
            cState.makeMove(quad);

            // Trigger AI Move
            setTimeout(function(){
                cState.aiMove();
            }, 350);
        }
    }, true);
      
    // Listener to track click event on restart header to reset the game.
    $('#restartHeader').on('click', function () {
        resetBoard();
    });

    // Listener to track esc key press to reset the game.
    window.addEventListener('keyup', function(e) {
        if (e.which == 27) {
            resetBoard();
        }
    }, true);
}

// Draws the complete game board
CanvasState.prototype.drawBoard = function() {
    var ctx = this.ctx;
    var w = this.width;
    var h = this.height;
    var qW = w / 3; //width of each quadrant
    var qH = h / 3; //height of each quadrant
    ctx.beginPath();

    // Draw vertical left line
    ctx.moveTo(qW, 0);
    ctx.lineTo(qW, w);
    
    // Draw vertical right line
    ctx.moveTo(w - qW, 0);
    ctx.lineTo(w - qW, w);

    // Draw horizontal top line
    ctx.moveTo(0, qH);
    ctx.lineTo(h, qH);

    // Draw horizontal bottom line
    ctx.moveTo(0, h - qH);
    ctx.lineTo(h, h - qH);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#008b8b';
    ctx.stroke();
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

// Evaluate a specific quadrant that contains the given x and y coordinates.
CanvasState.prototype.getQuadrantPosition = function(x, y) {
    var maxX = this.width;
    var maxY = this.height;
    var qW = maxX / 3; //width of each quadrant
    var qH = maxY / 3; //height of each quadrant
    var xCenter = qW / 2; //x center of quadrant
    var yCenter = qH / 2 //y center of quadrant

    var xCord = (Math.floor(x / qW) * qW) + xCenter;
    var yCord = (Math.floor(y / qH) * qH) + yCenter;

    var specificQuadrant =  Math.ceil(x/this.quadrantDividend) + (Math.floor(y/this.quadrantDividend) * 3);
    return { x: xCord, y: yCord, quadrant: specificQuadrant };
}

// Checks whether a move was already made in a specific quadrant by either X or O.
CanvasState.prototype.moveMade = function(quad) {
    return _.contains(this.movesListX, quad.quadrant) || _.contains(this.movesListO, quad.quadrant);
}

// Processes a specific move for either sides and then switches turns. 
CanvasState.prototype.makeMove = function(quad) {
    var currentSymbolMoveList = this.movesListO;

    // Draw the symbol based on whose turn it is.
    if (this.isUserTurn) {
        var x = new X(quad.x, quad.y);
        x.draw();

        currentSymbolMoveList = this.movesListX;
    }
    else {
        var o = new O(quad.x, quad.y);
        o.draw();
    }

    // Check the game status before switching sides and moving on to the next move.
    this.checkGameStatus(quad.quadrant);
    currentSymbolMoveList.push(quad.quadrant);

    //switch turns
    this.isUserTurn = !this.isUserTurn;
}

// Creates a move for the AI using a random selection.
CanvasState.prototype.aiMove = function() {
    if (this.gameWinner != null) { return; }

    var rMove = getRandomMove(); // Generate a random possible move
    var pMove = this.getQuadrantPosition(rMove.x, rMove.y); // Find the corresponding quadrant for that move
    
    // Keep evaluating the generated possible move until the first available move is found.
    while (this.moveMade(pMove)) {
        rMove = getRandomMove(this); 
        pMove = this.getQuadrantPosition(rMove.x, rMove.y);
    }
    
    // Evaluate the first available move.
    this.makeMove(pMove);
}

// Checks the current state of the game by comparing the current move against previous moves.
// Note: This occurs BEFORE inserting the current move into the symbol's move list.
CanvasState.prototype.checkGameStatus = function (currentMove) {
    var currentSymbolMoveList = (cState.isUserTurn ? this.movesListX : this.movesListO)

    _.each(currentSymbolMoveList, function (previousMove) {
        if (cState.gameWinner === null) {
            // Determine if a possible win path exists based on combining the current move with a previous move.
            var possibleWinPath = gameWinPaths[currentMove + '' + previousMove];

            // If a possible win path exists, look for the final move in that win path in the list of previous moves.
            if (possibleWinPath && _.contains(currentSymbolMoveList, possibleWinPath)) {
                cState.gameWinner = (cState.isUserTurn ? 'X' : 'O');
            }
        }
    });

    // If no winner was found and there are no more available moves, then end the game as a draw.
    if (this.gameWinner === null && (this.movesListX.length + this.movesListO.length + 1 >= 9)) {
        this.gameWinner = 'XO';
    }

    // Display end game text if a winner is found or if the game ended in a draw.
    if (this.gameWinner) {
        if (this.gameWinner === 'X') {
            $('#gameOverHeader').text('Congrats, you won the game! You are the ultimate Ticky Tacky champion.');
        }
        else if (this.gameWinner === 'O') {
            $('#gameOverHeader').text('Aw... the random bot won the game. Better luck next time!');
        }
        else {
            $('#gameOverHeader').text('Looks like this game ended in a draw. Maybe you\'ll win the next game!');
        }

        $('#gameOverHeader').show();
    }
}