function Obstacle(x, y) {
    this.x = x;
    this.y = y;
    this.height = 100;
    this.width = 100;
    this.img = $("#garlick")[0];
}

Obstacle.prototype.move = function() {
    this.x = this.x - 2;
}

