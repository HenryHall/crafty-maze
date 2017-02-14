(function (Crafty) {
    "use strict";
    var timeout = 0;
    Crafty.c("Trail", {
        slow: true,
        trailColor: 'rgb(255,0,0)',
        init: function () {
            this.requires("2D, Canvas, Color");
        },
        // start cell and end cell represent where the algorithm currently is (start) and where it's
        // attempting to go next (end)
        connectNodes: function (start, end) {
            // without modification, these starting attributes would draw a square in the center of the
            // starting cell. this could be changed to draw an arrow, for example, in the direct of "end"
            var centerX = start.x + (start.radius  / 2),
                centerY = start.y + (start.radius / 2),
                width = Math.ceil(start.radius  / 6),
                height = Math.ceil(start.radius / 6),
                t;
            // cells are aligned as such:
            // | x, y |
            // | 0, 0 | 0, 1 |
            // | 1, 0 | 1, 1 |
            // | 2, 0 | 2, 1 |
            // The x and y represent the top left corner pixel of the cell
            //
            // To draw our line, we want to expand the starting square we've described above to be a rectangle
            // in the direction the algorithm has probed.
            //
            // is the first cell to the left of the second cell
            if (start.x > end.x) {
                // change this square to be a horizontal rectangle
                width = start.radius;
                // move the rectangle to the left so that it crosses the border of the empty wall of the two cells
                centerX = centerX - start.radius;
            }
            // is the first cell to the right of the second cell (Note: it could be neither if it is above or below)
            if (start.x < end.x) {
                // change this square to be a horizontal rectangle
                width = start.radius;
                // there is no need to move this, as x,y starts at the center and we've grown this rectangle
                // to the right
            }
            // is the first cell below the second cell
            if (start.y > end.y) {
                height = start.radius;
                centerY = centerY - start.radius;
            }
            // is the first cell above the second cell (Note: it could be neither if it is to the right or left)
            if (start.y < end.y) {
                height = start.radius;
            }

            // show the trail as an animation
            if (this.slow) {
                timeout += 25;
            }
            t = setTimeout(function () {
                this.color(this.trailColor)
                    .attr({x: centerX, y: centerY, w: width, h: height})
                    .bind('DFSStarted', function () {
                        this.destroy();
                    });
            }.bind(this), timeout);
            this.bind('DFSStarted', function () {
                clearTimeout(t);
                timeout = 0;
            });
        }
    });
}(Crafty));
