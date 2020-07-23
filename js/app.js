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
const BOARD_MAX_WIDTH = 600;
const BOARD_MAX_HEIGHT = 800;

var board = new Board();
board.init(10, 10);

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
    //board.imageSizeMultiplier = canvas.width / img.width;
    // canvas.height = img.height;

    canvas.width = img.width;
    canvas.height = img.height;

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}
