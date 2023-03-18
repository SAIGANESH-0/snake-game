const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const highScoreElement = document.getElementById("high-score");
const eatSound = new Audio('/eat.mp3');

const gridSize = { width: 32, height: 22 }; // Updated grid size
const tileSize = {
  width: canvas.width / gridSize.width,
  height: canvas.height / gridSize.height,
};

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = createFood();
let highScore = 0;
let bestHighScore = 0;
const bestHighScoreElement = document.getElementById("best-high-score");

function gameLoop() {
  updateSnake();
  checkCollision();
  updateCanvas();

  setTimeout(gameLoop, 100);
}

function playEatSound() {
  const soundInstance = eatSound.cloneNode();
  soundInstance.currentTime = 0;
  soundInstance.play();
}


function updateSnake() {
  const newX = snake[0].x + direction.x;
  const newY = snake[0].y + direction.y;

  if (newX === food.x && newY === food.y) {
    snake.unshift({ x: newX, y: newY });
    food = createFood();
    updateHighScore();
    playEatSound();
  } else {
    snake.pop();
    snake.unshift({ x: newX, y: newY });
  }
}


function updateHighScore() {
  highScore = snake.length - 1;
  highScoreElement.textContent = `High Score: ${highScore}`;

  if (highScore > bestHighScore) {
    bestHighScore = highScore;
    bestHighScoreElement.textContent = `Best Score: ${bestHighScore}`;
  }
}

function checkCollision() {
  if (
    snake[0].x < 0 ||
    snake[0].x >= gridSize.width ||
    snake[0].y < 0 ||
    snake[0].y >= gridSize.height
  ) {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    resetHighScore();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      snake = [{ x: 10, y: 10 }];
      direction = { x: 0, y: 0 };
      resetHighScore();
    }
  }
}


function resetHighScore() {
  highScore = 0;
  highScoreElement.textContent = `High Score: ${highScore}`;
}

function updateCanvas() {
  ctx.fillStyle = "#BBC43F";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#6F611C";
  for (const part of snake) {
    ctx.fillRect(part.x * tileSize.width, part.y * tileSize.height, tileSize.width, tileSize.height);
  }

  ctx.fillStyle = "white";
  ctx.fillRect(food.x * tileSize.width, food.y * tileSize.height, tileSize.width, tileSize.height);
}


function createFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize.width);
    y = Math.floor(Math.random() * gridSize.height);
  } while (isSnakeAtPosition(x, y));

  return { x, y };
}

function isSnakeAtPosition(x, y) {
  return snake.some(part => part.x === x && part.y === y);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction.y === 0) {
    direction = { x: 0, y: - 1 };
  } else if (e.key === "ArrowDown" && direction.y === 0) {
    direction = { x: 0, y: 1 };
  } else if (e.key === "ArrowLeft" && direction.x === 0) {
    direction = { x: -1, y: 0 };
  } else if (e.key === "ArrowRight" && direction.x === 0) {
    direction = { x: 1, y: 0 };
  }
});

// const canvasContainer = document.getElementById('canvas-container');
// canvasContainer.style.backgroundImage = 'url(gamebg.jpg)';
// canvasContainer.style.backgroundSize = 'cover';
// canvasContainer.style.backgroundPosition = 'center';

gameLoop();