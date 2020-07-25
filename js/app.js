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

const ROWS = 10;
const COLS = 10;

const BOARD_MAX_WIDTH = 600;
const BOARD_MAX_HEIGHT = 800;

var board = new Board();
board.init(ROWS, COLS);

function loadBoard() {
  var canvas = this.document.createElement("canvas");
  canvas.width = BOARD_MAX_WIDTH;
  canvas.height = BOARD_MAX_HEIGHT;

  board.reset();

  var game = document.querySelector("#game");
  game.insertBefore(canvas, game.childNodes[0]);

  var ctx = canvas.getContext("2d");

  var img = new Image();
  img.onload = start;
  img.src =
    "https://www.joblo.com/assets/images/joblo/posters/2020/03/coffeekareempost1.jpg";

  function start() {
    canvas.width = img.width;
    canvas.height = img.height;

    const columnSize = Math.ceil(canvas.width / COLS);
    const rowSize = Math.ceil(canvas.height / ROWS);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    document.getElementById("clear").onclick = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.stroke();

      board.reset();
    };

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    }

    function writeMessage(canvas, message) {
      //console.log(message);
      /*  var context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = "18pt Calibri";
      context.fillStyle = "black";
      context.fillText(message, 10, 25);*/
    }

    canvas.addEventListener(
      "mousemove",
      function (evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
        writeMessage(canvas, message);
      },
      false
    );

    function clickShowCell() {
      var position = board.getRandomAvailableCell();
      showShow(position);
    }

    function showShow(position) {
      if (position === null) return;

      const posX = position.x * columnSize;
      const posY = position.y * rowSize;

      // if last row/column then use the remainder width
      const widthAdj =
        position.x + 1 === COLS ? canvas.width - posX : columnSize;

      const heightAdj =
        position.y + 1 === ROWS ? canvas.height - posY : rowSize;

      board.showCell(position.x, position.y, true);

      ctx.drawImage(
        img,
        posX,
        posY,
        widthAdj,
        heightAdj,
        posX,
        posY,
        widthAdj,
        heightAdj
      );

      if (!position.topSet) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX + widthAdj, posY);
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.stroke();
      }

      if (!position.leftSet) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX, posY + heightAdj);
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.stroke();
      }

      if (!position.rightSet) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(posX + widthAdj, posY);
        ctx.lineTo(posX + widthAdj, posY + heightAdj);
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.stroke();
      }

      if (!position.bottomSet) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(posX, posY + heightAdj);
        ctx.lineTo(posX + widthAdj, posY + heightAdj);
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.stroke();
      }
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.stroke();
    };
  }
}
