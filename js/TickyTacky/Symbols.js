
// Used for inheritance -- provides the common properties and functions used for symbols.
function Symbol(x, y) {
    this.centerX = x;
    this.centerY = y;
    this.distFromCenter = 38;
    this.lineWidth = 3;
}

// Constructor for the 'O' symbol.
function O(x, y) {
    // Inherit Symbol's properties and functions
    Symbol.call(this, x, y);
}

// Draws the display of the 'O' symbol.
O.prototype.draw = function() {
    var ctx = cState.ctx;
    var x = this.centerX;
    var y = this.centerY;
    var l = this.distFromCenter;

    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, l, 0, 2*Math.PI);
    ctx.strokeStyle = '#008b8b';
    ctx.stroke();
}

// Constructor for the 'X' symbol
function X(x, y) {
    // Inherit Symbol's properties and functions
    Symbol.call(this, x, y);
}

// Draws the display of the 'X' symbol.
X.prototype.draw = function(ctx) {
    var ctx = cState.ctx;
    var x = this.centerX;
    var y = this.centerY;
    var l = this.distFromCenter;

    ctx.beginPath();

    // Draw Left diagonal line
    ctx.moveTo(x - l, y - l);
    ctx.lineTo(x + l, y + l);
    
    // Draw right diagonal line
    ctx.moveTo(x + l, y - l);
    ctx.lineTo(x - l, y + l);
    
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = '#008b8b';
    ctx.stroke();
}