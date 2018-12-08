let gameOver = false;
let pause = true;
var hp = document.getElementById("health");
let scoreSpan = document.getElementById("score");
let cdSpan = document.getElementById("cd");
let timeSpan = document.getElementById("time");
let siSpan = document.getElementById("si");
var score = 0;
var scarecrowCD = 0;
var time = 0;
var startDelay = 0;
class Character {
  constructor(x, y, color, radius, speed) {
    Object.assign(this, { x, y, color, radius, speed });
  }
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
  move(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
}

const player = new Character(60, 60, "red", 30, 0.05);
const teleporter = new Character(400, 400, "black", 100, 0);
const enemies = [
  new Character(600, 40, "red", 30, 0.05),
  new Character(600, 600, "green", 34, 0.03),
  new Character(400, 400, "purple", 40, 0.01),
  new Character(40, 600, "lightblue", 24, 0.1),
];
let scarecrow;

function setup()  {
  createCanvas(800, 800);
  noStroke();
}

function draw() {
  background("orange");
  player.draw();
  teleporter.draw();
  enemies.forEach(enemy => enemy.draw());
  player.move({x: mouseX, y: mouseY});
  enemies.forEach(enemy => enemy.move(scarecrow || player));
  adjust();
  if (!pause) {
    cdSpan.textContent = Math.floor(scarecrowCD / 30);
  }
  else {
    cdSpan.textContent = siSpan.textContent
  }
  time += 1;
  timeSpan.textContent = Math.floor(time / 30);
  if (startDelay < 90) {
    startDelay += 1;
    hp.value = 100;
    siSpan.textContent = Math.floor(3 - (time/30))
    if (startDelay === 90) {
      siSpan.textContent = 0;
      pause = false;
    }
  }
  if (scarecrowCD > 0) {
    scarecrowCD -= 1;
  }
  if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--; 
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
  scoreSpan.textContent = score;
  if (gameOver) {
    text("Game Over", 370,405);
    noLoop();
  }
  else {
    text("Teleporter", 370, 405)
  }
}

function adjust() {
  const characters = [player, teleporter, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i+1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (c1.x <= 0) {
    c1.x = 1;
    if (c1 === player) {
      hp.value -= 1;
    }
  }
  if (c1.y <= 0) {
    c1.y = 1;
    if (c1 === player) {
      hp.value -= 1;
    }
  }
  if (c1.x >= 800) {
    c1.x = 799;
    if (c1 === player) {
      hp.value -= 1;
    }
  }
  if (c1.y >= 800) {
    c1.y = 799;
    if (c1 === player) {
      hp.value -= 1;
    }
  }
  if (overlap > 0) {
    const adjustX = (overlap / 2) * (dx / distance);
    const adjustY = (overlap / 2) * (dy / distance);
    if (c1 === teleporter) {
      c2.x += (Math.floor(Math.random() * 400) - 200);
      c2.y += (Math.floor(Math.random() * 400) - 200);
      if (c2 === player) {
        hp.value += 3;
        score += 1;
      }
    }
    else if (c2 === teleporter) {
      c1.x += (Math.floor(Math.random() * 400) - 200);
      c1.y += (Math.floor(Math.random() * 400) - 200);
      if (c1 === player) {
        hp.value += 3;
        score += 1;
      }
    }
    else { 
      c1.x -= adjustX;
      c1.y -= adjustY;
      c2.x += adjustX;
      c2.y += adjustY;
      if (c1 === player) {
        if (c2.color === "blue") {
          hp.value -= 5;
        }
        else if (c2.color === "green") {
          hp.value -= 3;
        }
        else if (c2.color === "purple") {
          hp.value -= 2;
        }
        else {
          hp.value -= 1;
        }
        if (hp.value <= 0) {
          gameOver = true;
        }
      }
    }
  }
}
function mouseClicked() {
  if (!scarecrow && scarecrowCD === 0 && !pause) {
    scarecrow = new Character(player.x, player.y, "white", 10, 0);
    scarecrow.ttl = frameRate();
    scarecrowCD = 180;
  }
}
