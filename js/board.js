/* 
Board for pixel color game
*/

var Board = function Board() {
  this.rows = 0;
  this.columns = 0;
  this.imageSizeMultiplier = 0;
  this.cellsShownCount = 0;
  this.cellsShown = null;
};

Board.prototype.remainingCells = function () {
  return this.rows * this.columns - this.cellsShownCount;
};

Board.prototype.showCell = function (x, y, show) {
  this.cellsShown[x * this.columns + y] = show;
  this.cellsShownCount += show ? 1 : -1;
};

Board.prototype.reset = function () {
  this.cellsShownCount = 0;
  this.cellsShown = new Array(this.rows * this.columns);
};

Board.prototype.isShowCell = function (x, y) {
  return this.cellsShown[x * this.columns + y] || false;
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
  let i = 0;
  let j = 0;
  let position = null;

  for (i = 0; i < this.rows; i++) {
    if (position != null) break;

    for (j = 0; j < this.columns; j++) {
      if (this.isShowCell(i, j)) {
        continue;
      }

      if (num == randomIndex) {
        position = { x: i, y: j };
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

Board.prototype.init = function (rows, columns) {
  this.rows = rows;
  this.columns = columns;
};
