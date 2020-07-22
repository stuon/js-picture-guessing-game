/* 
Board for pixel color game
*/

var Board = function Board() {
  this.rows = 0;
  this.columns = 0;

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

function repeatXI(callback, interval, repeats, immediate) {
  var timer, trigger;
  trigger = function () {
    callback();
    --repeats || clearInterval(timer);
  };

  interval = interval <= 0 ? 1000 : interval; // default: 1000ms
  repeats = parseInt(repeats, 10) || 0; // default: repeat forever
  timer = setInterval(trigger, interval);

  if (!!immediate) {
    // Coerce boolean
    trigger();
  }
}

var board = new Board();
board.init(10, 10);

function loadBoard() {
  var canvas = this.document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;

  board.reset();

  var game = document.querySelector("#game");
  game.insertBefore(canvas, game.childNodes[0]);

  var ctx = canvas.getContext("2d");

  var cw = canvas.width;
  var ch = canvas.height;

  var img = new Image();
  img.onload = start;
  img.src =
    "https://www.joblo.com/assets/images/joblo/posters/2020/03/coffeekareempost1.jpg";

  function start() {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    document.getElementById("clear").onclick = function () {
      ctx.clearRect(0, 0, cw, ch);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.stroke();

      board.reset();
    };

    function clickShowCell() {
      var position = board.showRandomCell();

      if (position === null) return;

      ctx.drawImage(
        img,
        position.x * 30,
        position.y * 30,
        30,
        30,
        position.x * 30,
        position.y * 30,
        30,
        30
      );

      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(position.x * 30, position.y * 30, 30, 30);
      ctx.stroke();
    }

    document.getElementById("autorun").onclick = function () {
      const remainingCount = board.remainingCells();
      if (remainingCount == 0) return;

      repeatXI(clickShowCell, 100 /* wait time */, remainingCount);
    };

    document.getElementById("partial").onclick = function () {
      const remainingCount = board.remainingCells();
      if (remainingCount == 0) return;

      clickShowCell();
    };

    document.getElementById("full").onclick = function () {
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0);
    };
  }
}
