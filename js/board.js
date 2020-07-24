/* 
Board for pixel color game
*/

var Board = function Board() {
  this.columns = 0; // x position
  this.rows = 0; // y position
  this.imageSizeMultiplier = 0;
  this.cellsShownCount = 0;
  this.cellsShown = null;
};

Board.prototype.init = function (columns, rows) {
  this.columns = columns; // x positions
  this.rows = rows; // y positions
};

Board.prototype.remainingCells = function () {
  return this.rows * this.columns - this.cellsShownCount;
};

Board.prototype.showCell = function (x, y, show) {
  this.cellsShown[y * this.rows + x] = show;
  this.cellsShownCount += show ? 1 : -1;
};

Board.prototype.reset = function () {
  this.cellsShownCount = 0;
  this.cellsShown = new Array(this.rows * this.columns);
};

Board.prototype.isShowCell = function (x, y) {
  if (x < 0 || y < 0 || x >= this.columns || y >= this.rows) return false;

  return this.cellsShown[y * this.rows + x] || false;
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

Board.prototype.showRandomCell = function () {
  const randomIndex = getRndInteger(
    0,
    this.rows * this.columns - 1 - this.cellsShownCount
  );

  let num = 0;
  let x = 0;
  let y = 0;
  let position = null;

  for (y = 0; y < this.rows; y++) {
    if (position != null) break;

    for (x = 0; x < this.columns; x++) {
      if (this.isShowCell(x, y)) {
        continue;
      }

      if (num == randomIndex) {
        position = {
          x: x,
          y: y,
          topSet: this.isShowCell(x, y - 1),
          leftSet: this.isShowCell(x - 1, y),
          rightSet: this.isShowCell(x + 1, y),
          bottomSet: this.isShowCell(x, y + 1),
        };
        break;
      }
      num++;
    }
  }

  console.log(position);

  if (position === null) {
    return null;
  }

  this.showCell(position.x, position.y, true);
  return position;
};
