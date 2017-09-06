
// Canvas object and state references
var canvasObj = {};
var cState = {};

// Defined list of all possible win combinations in the format - (First two quadrants: Last quadrant needed to win)
var gameWinPaths = {
    // Horizontal Win Combinations
    12: 3, 21: 3, 23: 1, 32: 1, 13: 2, 31: 2, // 1 2 3
    45: 6, 54: 6, 56: 4, 65: 4, 46: 5, 64: 5, // 4 5 6
    78: 9, 87: 9, 89: 7, 98: 7, 79: 8, 97: 8, // 7 8 9
    
    // Vertical Win Combinations
    14: 7, 41: 7, 47: 1, 74: 1, 17: 4, 71: 4, // 1 4 7
    25: 8, 52: 8, 58: 2, 85: 2, 28: 5, 82: 5, // 2 5 8
    36: 9, 63: 9, 69: 3, 96: 3, 39: 6, 93: 6, // 3 6 9

    // Diagonal Win Combinations
    15: 9, 51: 9, 59: 1, 95: 1, 19: 5, 91: 5, // 1 5 9
    35: 7, 53: 7, 57: 3, 75: 3, 37: 5, 73: 5  // 3 5 7
}

// Initialize the game board on page load.
function initializeBoard () {
    canvasObj = $('#gameCanvas');
    cState = new CanvasState(canvasObj[0]);

    resetBoard();
}

// Clears the game board and reset the game state.
function resetBoard() {
    cState.ctx.clearRect(0, 0, cState.width, cState.height);
    cState.drawBoard();
    cState.movesListX = [];
    cState.movesListO = [];
    cState.isUserTurn = true;
    cState.gameWinner = null;

    $('#gameOverHeader').hide();
}

// Generate a random number between the min and max.
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Generate a random move within the canvas board.
function getRandomMove() {
    var move = 
    {
        x: randomIntFromInterval(0, cState.width),
        y: randomIntFromInterval(0, cState.height)
    };
    
    return move;
}

