function repeatXI(callback, interval, repeats, immediate) {
  let timer, trigger;
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

  let canvas;
  let imageElement;
  let image;
  let ctx;
  let columnSize;
  let rowSize;
  let imageRatio;
  let progressElement;
  let progressWrapperElement;

  let getRandomImage = function () {
    // Replace this to return a random image from some remote call
    const images = [
      {
        title: ["The Pursuit of Happyness", "Pursuit of Happyness"],
        url:
          "https://lifeminibites.com/wp-content/uploads/2020/07/pursuit_of_happyness_intro_b.png",
      },
      {
        title: ["The Martian"],
        url:
          "https://lifeminibites.com/wp-content/uploads/2020/06/martian-about-720x404-1.png",
      },
    ];

    let randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  let getMousePos = function (canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  let writeMessage = function (canvas, message) {
    //console.log(message);
    /*  var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "18pt Calibri";
        context.fillStyle = "black";
        context.fillText(message, 10, 25);*/
  };

  let newGame = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();

    board.reset();
    image = getRandomImage(); // get a new image
    imageElement.src = image.url;

    progressElement.innerText =
      board.remainingCells() == 0
        ? ""
        : board.remainingCells() + " / " + board.totalCells();
    progressElement.style = "width: " + board.remainingCells() + "%;";
  };

  let setupEventListeners = function () {
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
      let r = confirm("Are you sure you want to start a new game?");
      if (r == true) newGame();
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
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.stroke();
    };
  };

  let start = function () {
    imageRatio = canvas.width / imageElement.width;

    canvas.height = imageElement.height * imageRatio;

    columnSize = Math.ceil(canvas.width / COLS);
    rowSize = Math.ceil(canvas.height / ROWS);

    progressWrapperElement.setAttribute(
      "style",
      "width:" + canvas.width + "px"
    );
    progressElement.innerText =
      board.remainingCells() + " / " + board.totalCells();

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
    progressElement.innerText =
      board.remainingCells() == 0
        ? ""
        : board.remainingCells() + " / " + board.totalCells();
    progressElement.style = "width: " + board.remainingCells() + "%;";
    ctx.drawImage(
      imageElement,
      posX * imageRatio,
      posY * imageRatio,
      widthAdj * imageRatio,
      heightAdj * imageRatio,
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

      canvas = document.querySelector("#game");
      ctx = canvas.getContext("2d");
      setupEventListeners();

      progressElement = document.querySelector("#progress");
      progressWrapperElement = document.querySelector("#progress-wrapper");

      imageElement = new Image();
      imageElement.onload = start;

      newGame();
    },
  };
})(imageBoard);

app.init();
