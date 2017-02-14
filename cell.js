(function (Crafty) {
    "use strict";
    var wallWidth = 0.5,
        radius = 16;
    // our Cell component. Consists of four walls, positional information, and
    // information needed for DFS
    Crafty.c("Cell", {
        radius: radius,
        init: function () {
            // randomly generate a cell color.
            // prevent it from being close to the same color as the background (230)
            var red =  Math.floor(Math.random() * 200),
                green = Math.floor(Math.random() * 200),
                blue = Math.floor(Math.random() * 200);
            this.color = 'rgb(' + red + ',' + green + ',' + blue + ')';
            this.walls             = {};
            this.left              = true;
            this.top               = true;
            this.right             = true;
            this.bottom            = true;
            this.neighbors         = [];
            this.attachedNeighbors = [];
            this.visited           = false;
            this.bind('DFSStarted', function () {
                this.visited = false;
            });
            this.areaMap([0, 0], [radius, 0], [radius, radius], [0, radius]);
        },
        addNeighbor: function (cell) {
            this.neighbors.push(cell);
        },
        getUnVisitedNeighbors: function () {
            var neighbors = [],
                n;
            // grab each neighbor of our current cell that has not been visited
            for (n = 0; n < this.neighbors.length; n++) {
                if (!this.neighbors[n].visited) {
                    neighbors.push(this.neighbors[n]);
                }
            }

            return neighbors;
        },
        getAttachedNeighbors: function () {
            var neighbors = [],
                n;
            for (n = 0; n < this.attachedNeighbors.length; n++) {
                if (!this.attachedNeighbors[n].visited) {
                    neighbors.push(this.attachedNeighbors[n]);
                }
            }
            return neighbors;
        },
        removeWall: function (cell) {
            if (this.x < cell.x) {
                this.right = false;
            } else if (this.y < cell.y) {
                this.bottom = false;
            } else if (this.x > cell.x) {
                this.left = false;
            } else if (this.y > cell.y) {
                this.top = false;
            }
            this.attachedNeighbors.push(cell);
        },
        drawWalls: function () {
            // create the walls that have not been disabled
            if (this.left) {
                this.walls.left = Crafty.e("2D, Canvas, Color")
                    .color(this.color)
                    .attr({x: this.x + wallWidth, y: this.y, w: wallWidth, h: radius});
            }
            if (this.top) {
                this.walls.top = Crafty.e("2D, Canvas, Color")
                    .color(this.color)
                    .attr({x: this.x, y: this.y + wallWidth, w: radius, h: wallWidth});
            }
            if (this.right) {
                this.walls.right = Crafty.e("2D, Canvas, Color")
                    .color(this.color)
                    .attr({x: this.x + radius - wallWidth, y: this.y, w: wallWidth, h: radius});
            }
            if (this.bottom) {
                this.walls.bottom = Crafty.e("2D, Canvas, Color")
                    .color(this.color)
                    .attr({x: this.x, y: this.y + radius - wallWidth, w: radius, h: wallWidth});
            }
        },
        drawNode: function (color) {
            var width = radius / 2,
                height = radius / 2,
                centerX = this.x + (radius / 2) - (width / 2),
                centerY = this.y + (radius / 2) - (height / 2);
            Crafty.e("2D, Canvas, Color")
                .color(color)
                .attr({x: centerX, y: centerY, w: width, h: height})
                .bind('DFSStarted', function () {
                    this.destroy();
                });
        },
        drawStartNode: function () {
            this.drawNode('rgb(0, 255, 0)');
        },
        drawEndNode: function () {
            this.drawNode('rgb(0, 0, 255)');
        }
    });
}(Crafty));
