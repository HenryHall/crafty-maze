window.onload = function () {
    "use strict";
    var width = 800,
        height = 600,
        radius = 16,
        xCount = Math.floor(width / radius),
        yCount = Math.floor(height / radius),
        // x,
        // y,
        id = 0,
        grid = [],
        cell,
        previousRow = [],
        currentRow = [],
        previousCell = false,
        // i,
        // g,
        startCell,
        click,
        openCell = [],
        tempStack = [];

    Crafty.init(width, height);
    Crafty.background('rgb(230,230,230)');

    //Calculate the distance of a cell to the endCell
    function calcDistanct(cell, endCell) {
      return (Math.abs(cell.x - endCell.x) + Math.abs( cell.y - endCell.y));
    }

    function addOpenCell(cell, stack, endCell) {

      cell.visited = true;
      Crafty.e("Trail").connectNodes(cell, stack[stack.length-1]);

      if (openCell.length == 0) {
        openCell.push(cell);
        tempStack.push(stack);
        stack = [];
        return;
      } else {
        for (var i=0; i<openCell.length; i++) {
          //Order the cells and stacks by distance
          if (calcDistanct(cell, endCell) < calcDistanct(openCell[i], endCell)) {
            openCell.splice(i, 0, cell);
            tempStack.splice(i, 0, stack);
            stack = [];
            return;
          }
        }
        openCell.push(cell);
        tempStack.push(stack);
        stack = [];
        return;
      }
    }

    function dfsSearch(startCell, endCell) {
        Crafty.trigger('DFSStarted', null);
        endCell.drawEndNode();
        startCell.drawStartNode();
        var currentCell = startCell,
            neighborCell,
            stack = [],
            neighbors = [],
            stackPopped = false,
            found = false;
        currentCell.visited = true;

        //Skip the search if the user creates a startCell at the endCell
        if (startCell.x === endCell.x && startCell.y === endCell.y) {
            found = true;
        }

        while (!found) {
            neighbors = currentCell.getAttachedNeighbors();
            if (neighbors.length) {
                // if there is a current neighbor that has not been visited, we are switching currentCell to one of them
                stack.push(currentCell);

                //Check to see which direction leads more towards end, given the end location is known
                if (neighbors.length > 1) {
                  neighborCell = neighbors[0];

                  for (var i=1; i<neighbors.length; i++) {
                    //Determine which cell is closest to the end and add the others to temp vars be checked later
                    if (calcDistanct(neighborCell, endCell) > calcDistanct(neighbors[i], endCell)) {
                      addOpenCell(neighborCell, stack.slice(0), endCell);
                      neighborCell = neighbors[i];
                    } else {
                      addOpenCell(neighbors[i], stack.slice(0), endCell);
                    }
                  }

                } else {
                  neighborCell = neighbors[0];
                }

                neighborCell.visited = true;
                Crafty.e("Trail").connectNodes(currentCell, neighborCell);
                // update our current cell to be the newly selected cell
                currentCell = neighborCell;
                stackPopped = false;

                //If a cell in the temp vars is closer than the currentCell, swap them and search from there
                if (openCell[0] && calcDistanct(currentCell, endCell) > calcDistanct(openCell[0], endCell)) {
                  addOpenCell(currentCell, stack.slice(0), endCell);
                  currentCell = openCell.shift();
                  stack = tempStack.shift();
                }

            } else {
                stackPopped = true;
                if (stack.length === 0) {
                  if (tempStack.length !== 0) {
                    stack = tempStack.shift();
                    currentCell = openCell.shift();
                  } else {
                    console.log("All empty D:");
                    // this point can not be found. bail
                    break;
                  }
                } else {
                  currentCell = stack.pop();
                }
            }

            if (currentCell.x === endCell.x && currentCell.y === endCell.y) {
              console.log("FOUND!");
                found = true;
                tempStack = [];
                openCell = [];
            }
        }
        if (stack.length) {
            stack.push(endCell);
        }
        Crafty.trigger('DFSCompleted', null);
        return stack;
    }

    click = function () {
        // on click, use dfs to search our maze
        var stack = dfsSearch(startCell, this),
            neighbor;
        if (stack.length) {
            startCell = stack.shift();
            while (stack.length) {
                neighbor = stack.shift();
                Crafty.e("Trail")
                    .attr({slow: false, trailColor: 'rgb(0,0,255)'})
                    .connectNodes(startCell, neighbor);
                startCell = neighbor;

            }
        }
    };
    // build the grid for our DFS and rendering
    for (var y = 0; y < yCount; y++) {
        // row information is used to assign neighbors
        currentRow = [];
        for ( var x = 0; x < xCount; x++) {

            id = x * y + y;
            cell = Crafty.e("2D, Mouse, Cell")
                .attr({id: id, x: x * radius, y:  y * radius})
                .bind('MouseDown', click);

            currentRow.push(cell);
            grid.push(cell);
            if (previousCell !== false) {
                previousCell.addNeighbor(cell);
                cell.addNeighbor(previousCell);
            }
            // set our initial start cell to the center of the maze
            if (Math.floor(yCount / 2) === y && Math.floor(xCount / 2) === x) {
                startCell = cell;
            }
            previousCell = cell;
        }
        if (previousRow.length !== 0) {
            for (var i = 0; i < previousRow.length; i++) {
                previousRow[i].addNeighbor(currentRow[i]);
                currentRow[i].addNeighbor(previousRow[i]);
            }
        }
        previousRow = currentRow;
        // clear previous cell to prevent wrapped neighbors
        previousCell = false;
    }

    // use dfs to create our maze
    function dfsCreate(startCell) {
        var currentCell = startCell,
            neighborCell,
            stack = [],
            neighbors = [],
            visited = 1;
        currentCell.visited = true;
        while (visited < grid.length) {
            neighbors = currentCell.getUnVisitedNeighbors();
            if (neighbors.length) {
                // if there is a current neighbor that has not been visited, we are switching currentCell to one of them
                stack.push(currentCell);
                // get a random neighbor cell
                neighborCell = neighbors[Math.floor(Math.random() * neighbors.length)];
                visited++;
                neighborCell.visited = true;
                // while building, on move, knock down the walls!
                neighborCell.removeWall(currentCell);
                currentCell.removeWall(neighborCell);
                // update our current cell to be the newly selected cell
                currentCell = neighborCell;
            } else {
                currentCell = stack.pop();
            }
        }
    }
    dfsCreate(grid[Math.floor(Math.random() * grid.length)]);
    for (var g = 0; g < grid.length; g++) {
        grid[g].drawWalls();
    }
};
