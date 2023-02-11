const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() method會回傳一個canvas的drawing context
//drawing context可以用來在canvas內畫圖
const unit = 25;
const row = canvas.height / unit; //500 / 25 = 20
const column = canvas.width / unit; //500 / 25 = 20

let snake = []; //array中的每個元素，都是一個物件
function createSnake() {
  //物件的工作室，儲存身體的x,y座標
  snake[0] = {
    x: 100,
    y: 0,
  };
  snake[1] = {
    x: 75,
    y: 0,
  };

  snake[2] = {
    x: 50,
    y: 0,
  };

  snake[3] = {
    x: 25,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    //不能和蛇的位置重疊
    let overlapping = false;
    let newX;
    let newY;

    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;
  }
}
//初始設定
createSnake();
let myFruit = new Fruit();
let score = 0;
let highestScore;
loadHighestScore();
document.getElementById("myScore").innerHTML = `遊戲分數:${score}`;
document.getElementById("myScore2").innerHTML = `最高分數:${highestScore}`;

window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowUp" && d != "Down") {
    //當蛇再向上走時，不能向下走。
    d = "Up";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  }

  //每次按上下左右鍵之後，在下一幀被畫出來之前
  //不接受任何keydown事件
  //這樣可以防止連續按鍵導致蛇在邏輯上自殺

  window.removeEventListener("keydown", changeDirection);
}

function draw() {
  //每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  //在每次畫之前，背景全部設定成黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "rgb(62,255,36)";
    } else {
      ctx.fillStyle = "rgb(153,255,93)"; //要填滿的顏色
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //以目前d變數的方向，來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //重新選定一個新的隨機位置
    myFruit.pickALocation();
    //畫出新果實
    myFruit.drawFruit();
    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = `遊戲分數:${score}`;
    document.getElementById("myScore2").innerHTML = `遊戲分數:${highestScore}`;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
