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

var app = (function (board) {
  const ROWS = 10;
  const COLS = 10;
  const BOARD_MAX_WIDTH = 800;
  const BOARD_MAX_HEIGHT = 640;

  var canvas = null;
  var img = null;
  var ctx = null;
  var columnSize = 0;
  var rowSize = 0;
  var imageRatio = 1.0;

  var getRandomImage = function () {
    // Make this dynamic and random
    var image = [
      "https://lifeminibites.com/wp-content/uploads/2020/07/pursuit_of_happyness_intro_b.png",
      "https://lifeminibites.com/wp-content/uploads/2020/06/martian-about-720x404-1.png",
    ];

    var index = Math.floor(Math.random() * image.length);
    return image[index];
  };

  var getMousePos = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  var writeMessage = function (canvas, message) {
    //console.log(message);
    /*  var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "18pt Calibri";
        context.fillStyle = "black";
        context.fillText(message, 10, 25);*/
  };

  var setupEventListeners = function () {
    canvas.addEventListener(
      "mousemove",
      function (evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
        writeMessage(canvas, message);
      },
      false
    );

    document.getElementById("clear").onclick = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.stroke();

      board.reset();
      img.src = getRandomImage(); // get a new image
    };

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
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.stroke();
    };
  };

  var start = function () {
    imageRatio =
      img.width > BOARD_MAX_WIDTH ? BOARD_MAX_WIDTH / img.width : 1.0;

    canvas.width = img.width * imageRatio;
    canvas.height = img.height * imageRatio;

    columnSize = Math.ceil(canvas.width / COLS);
    rowSize = Math.ceil(canvas.height / ROWS);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
  };

  var clickShowCell = function () {
    var position = board.getRandomAvailableCell();
    showCell(position);
  };

  var showCell = function (position) {
    if (position === null) return;

    const posX = position.x * columnSize;
    const posY = position.y * rowSize;

    // if last row/column then use the remainder width
    const widthAdj = position.x + 1 === COLS ? canvas.width - posX : columnSize;

    const heightAdj = position.y + 1 === ROWS ? canvas.height - posY : rowSize;

    board.showCell(position.x, position.y, true);

    ctx.drawImage(
      img,
      posX / imageRatio,
      posY / imageRatio,
      widthAdj / imageRatio,
      heightAdj / imageRatio,
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
  };

  return {
    init: function () {
      board.init(ROWS, COLS);
      board.reset();

      canvas = document.createElement("canvas");
      canvas.width = BOARD_MAX_WIDTH;
      canvas.height = BOARD_MAX_HEIGHT;

      var game = document.querySelector("#game");
      game.insertBefore(canvas, game.childNodes[0]);

      ctx = canvas.getContext("2d");
      setupEventListeners();

      img = new Image();
      img.onload = start;
      img.src = getRandomImage();
    },
  };
})(imageBoard);

app.init();
