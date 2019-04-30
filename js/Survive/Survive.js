var canvas = {};
var state = {};
var suriverImage;
var mobImages = {};
var arrowImage;
//var arrowImages = {};

function initializeGameState() {
    canvas = $("#gameCanvas");
    preloadImages();
}

function preloadImages() {
        loadSurviverImage();
        loadMobImages();
        loadArrowImages();
}

function loadSurviverImage() {
    suriverImage = new Image();       
    suriverImage.onload = function() {
        state = new CanvasState(canvas[0]);
    }
    suriverImage.src = "img/Survive/spriteBow.png";
}

function loadMobImages() {
    var mobSkeleton = new Image();
    mobSkeleton.src = "img/Survive/spriteSkeletonDagger.png";
    mobImages["Skeleton"] = mobSkeleton;
}

function loadArrowImages() {
    arrowImage = new Image();
    arrowImage.src = "img/Survive/arrowSprite.png";
}

// Generate a random number between the min and max.
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}