function repeatXI(callback, interval, repeats, immediate, finalCallback) {
  let timer, trigger;

  trigger = function () {
    let success = callback();

    if (success) {
      success = --repeats > 0;
    }

    if (!success) {
      clearInterval(timer);

      if (finalCallback) finalCallback();
    }
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

  //
  let gameFinished;

  // cell column size
  let columnSize;
  let rowSize;

  // image column size
  let imageColumnSize;
  let imageRowSize;

  // image ratio conversion to match canvas size
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
    gameState = GAME_STATES.Normal;
    updateButtonStates();

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

  var GAME_STATES = {
    Normal: 1,
    AutoRun: 2,
    Finished: 3,
  };

  let gameState = GAME_STATES.New;

  let autoRun = function () {
    if (gameState !== GAME_STATES.AutoRun) return false;

    clickShowCell();

    return true;
  };

  function updateButtonStates() {
    console.log(`gameState: ${gameState}`);

    if (gameState === GAME_STATES.Normal) {
      document.getElementById("clear").removeAttribute("disabled");
      document.getElementById("partial").removeAttribute("disabled");
      document.getElementById("full").removeAttribute("disabled");
      document.getElementById("auto-run").removeAttribute("disabled");
    } else if (gameState === GAME_STATES.AutoRun) {
      document.getElementById("clear").setAttribute("disabled", "");
      document.getElementById("partial").setAttribute("disabled", "");
      document.getElementById("full").setAttribute("disabled", "");
      document.getElementById("auto-run").removeAttribute("disabled");
    } else if (gameState === GAME_STATES.Finished) {
      document.getElementById("clear").removeAttribute("disabled");
      document.getElementById("partial").setAttribute("disabled", "");
      document.getElementById("full").setAttribute("disabled", "");
      document.getElementById("auto-run").setAttribute("disabled", "");
    }
  }

  let finishedAutoRun = function () {
    if (gameState === GAME_STATES.AutoRun) gameState = GAME_STATES.Finished;
    updateButtonStates();
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
      newGame();
    };

    document.getElementById("auto-run").onclick = function () {
      if (gameState === GAME_STATES.AutoRun) {
        gameState = GAME_STATES.Normal;
        updateButtonStates();
        return;
      }

      const remainingCount = board.remainingCells();
      if (remainingCount == 0) return;

      repeatXI(
        autoRun,
        100 /* wait time */,
        remainingCount,
        false,
        finishedAutoRun
      );
      gameState = GAME_STATES.AutoRun;
      updateButtonStates();
    };

    document.getElementById("partial").onclick = function () {
      const remainingCount = board.remainingCells();
      if (remainingCount == 0) {
        gameState = GAME_STATES.Finished;
        updateButtonStates();
        return;
      }
      clickShowCell();
    };

    document.getElementById("full").onclick = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.stroke();

      gameState = GAME_STATES.Finished;
      updateButtonStates();
    };
  };

  let start = function () {
    canvas.height = canvas.getBoundingClientRect().height;
    canvas.width = canvas.getBoundingClientRect().width;

    // make canvas same ratio as
    canvas.height = canvas.width * (imageElement.height / imageElement.width);
    imageRatio = canvas.width / imageElement.width;

    console.log(`canvas: ${canvas.width}, ${canvas.height}`);
    console.log(`image: ${imageElement.width}, ${imageElement.height}`);
    console.log(`ratio: ${imageRatio}`);

    columnSize = Math.ceil(canvas.width / COLS);
    rowSize = Math.ceil(canvas.height / ROWS);

    imageColumnSize = Math.ceil(imageElement.width / COLS);
    imageRowSize = Math.ceil(imageElement.height / COLS);

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

  function getCellBlock(x, y, colSize, rowSize, maxWidth, maxHeight) {
    const posX = x * colSize;
    const posY = y * rowSize;

    // if last row/column then use the remainder width
    const width = x + 1 === COLS ? maxWidth - posX : colSize;
    const height = y + 1 === ROWS ? maxHeight - posY : rowSize;

    const posX2 = posX + width;
    const posY2 = posY + height;

    return {
      posX,
      posY,
      width,
      height,
      posX2,
      posY2,
    };
  }

  var showCell = function (position) {
    if (position === null) return;

    const cellBlock = getCellBlock(
      position.x,
      position.y,
      columnSize,
      rowSize,
      canvas.width,
      canvas.height
    );

    const imageBlock = getCellBlock(
      position.x,
      position.y,
      imageColumnSize,
      imageRowSize,
      imageElement.width,
      imageElement.height
    );

    board.showCell(position.x, position.y, true);
    progressElement.innerText =
      board.remainingCells() == 0
        ? ""
        : board.remainingCells() + " / " + board.totalCells();
    progressElement.style = "width: " + board.remainingCells() + "%;";

    ctx.drawImage(
      imageElement,
      imageBlock.posX,
      imageBlock.posY,
      imageBlock.width,
      imageBlock.height,
      cellBlock.posX,
      cellBlock.posY,
      cellBlock.width,
      cellBlock.height
    );

    if (!position.topSet) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.moveTo(cellBlock.posX, cellBlock.posY);
      ctx.lineTo(cellBlock.posX2, cellBlock.posY);
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.stroke();
    }

    if (!position.leftSet) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.moveTo(cellBlock.posX, cellBlock.posY);
      ctx.lineTo(cellBlock.posX, cellBlock.posY2);
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.stroke();
    }

    if (!position.rightSet) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.moveTo(cellBlock.posX2, cellBlock.posY);
      ctx.lineTo(cellBlock.posX2, cellBlock.posY2);
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.stroke();
    }

    if (!position.bottomSet) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.moveTo(cellBlock.posX, cellBlock.posY2);
      ctx.lineTo(cellBlock.posX2, cellBlock.posY2);
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
      newGame();
      imageElement.onload = start;
    },
  };
})(imageBoard);

app.init();
