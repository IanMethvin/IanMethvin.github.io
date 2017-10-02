var canvasObj = {};
var cState = {};

var backgroundMusic = {};
var audioMuted = false;

// Initialize the game board on page load.
function initializeCave () {
    canvasObj = $('#battyCanvas');
    cState = new CanvasState(canvasObj[0]);
}

function initializeBackgroundMusic () {
    // Initialize background music 
    backgroundMusic = $('#background-music')[0];
    backgroundMusic.src = 'sounds/bgm.mp3';
    backgroundMusic.loop = true;
    backgroundMusic.autoplay = false;

    $('#muteBGM').on('click', function () {
        toggleBackgroundMusic();
    });
}

// Initialize cave, background music, and key press listeners
function initializeGameState () {
    initializeCave();
    initializeBackgroundMusic();

    $(document).keyup(function(e) {
        // Toggle background music on esc key press
        if (e.keyCode == 27) { 
           toggleBackgroundMusic();
       }

       // If game is over, check for restart space bar press
        else if (e.keyCode == 32 && !cState.gameRunning && cState.gameOver) {
            cState.restartGame();
        }
   });
}

// Toggle the mute state of the audio for the background music
function toggleBackgroundMusic () {
    audioMuted = !audioMuted;
    
    if (audioMuted) {
        backgroundMusic.pause();
    }
    else {
        backgroundMusic.play();
    }
}

// Generate a random move within the canvas board.
function getRandomY() {   
    return randomIntFromInterval(0, cState.height - 50);
}

// Generate a random number between the min and max.
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Return true if point in between two numbers
function isBetween(point, min, max) {
    if (min <= point && point <= max) {
        return true;
    }

    return false;
}

//testing something else
$.ajax({
    type: "POST",
    url: "https://evbcih8157.execute-api.us-west-1.amazonaws.com/prod/NodeDemo",
    data: 
     JSON.stringify({
        "key3": "value3",
        "key2": "value2",
        "key1": "value1"
      }),
    dataType: "text",
    success: function (data) {
     alert (data);   
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert('error ' + xhr.status + ' ' + thrownError);
        alert(thrownError);
    }
  });
