/* =========================================================
   SPACE SHOOTER — vanilla JS
   Same core rules as the original Python terminal game:
     - track has positions 0-10
     - player starts at 5, enemy starts at 3
     - 'a' moves left, 'd' moves right (can't leave 0-10)
     - 's' shoots: hit only if player position === enemy position
     - 'q' quits
   The web version adds a score counter: each hit respawns a
   new enemy and adds a point, instead of ending after one shot.
========================================================= */

// ---- Game state ----
const TRACK_LENGTH = 11; // positions 0 through 10

let player = 5;
let enemy = 3;
let score = 0;
let gameActive = false; // true once "Start Game" has been pressed and game not over

// ---- DOM references ----
const trackEl = document.getElementById("track");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnShoot = document.getElementById("btn-shoot");
const btnQuit = document.getElementById("btn-quit");
const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");

const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const endTitle = document.getElementById("end-title");
const endText = document.getElementById("end-text");
const endScoreEl = document.getElementById("end-score");

// =========================================================
// STARFIELD — purely decorative, generated once on load
// =========================================================
function buildStarfield() {
  const field = document.getElementById("starfield");
  const STAR_COUNT = 90;
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2 + 1; // 1px - 3px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    field.appendChild(star);
  }
}

// =========================================================
// RENDERING
// =========================================================
function renderTrack() {
  trackEl.innerHTML = "";
  for (let i = 0; i < TRACK_LENGTH; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    const isPlayer = i === player;
    const isEnemy = i === enemy;

    if (isPlayer && isEnemy) {
      cell.classList.add("cell--both");
      cell.textContent = "💥";
    } else if (isPlayer) {
      cell.classList.add("cell--player");
      cell.textContent = "🚀";
    } else if (isEnemy) {
      cell.classList.add("cell--enemy");
      cell.textContent = "👾";
    } else {
      cell.textContent = "·";
    }

    trackEl.appendChild(cell);
  }
}

function renderScore() {
  scoreEl.textContent = String(score).padStart(3, "0");
}

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.classList.remove("hit", "missed");
  if (type) messageEl.classList.add(type);
}

// =========================================================
// GAME ACTIONS (mirrors the original if/elif logic)
// =========================================================
function movePlayer(direction) {
  if (!gameActive) return;

  if (direction === "left" && player > 0) {
    player -= 1;
  } else if (direction === "right" && player < TRACK_LENGTH - 1) {
    player += 1;
  }
  renderTrack();
}

function shoot() {
  if (!gameActive) return;

  if (player === enemy) {
    setMessage("🎯 Enemy Destroyed!", "hit");
    score += 1;
    renderScore();
    gameActive = false; // briefly pause input while the new enemy spawns
    setTimeout(() => {
      spawnEnemy();
      gameActive = true;
      setMessage("New enemy incoming…");
    }, 800);
  } else {
    setMessage("Missed!", "missed");
  }
}

function spawnEnemy() {
  // Pick a new enemy position that is not the player's current spot
  let newPos;
  do {
    newPos = Math.floor(Math.random() * TRACK_LENGTH);
  } while (newPos === player);
  enemy = newPos;
  renderTrack();
}

function quitGame() {
  if (!gameActive) return;
  gameActive = false;
  showEndScreen("GAME OVER", "You quit the mission. Final score:");
}

// =========================================================
// GAME FLOW / SCREENS
// =========================================================
function startGame() {
  player = 5;
  enemy = 3;
  score = 0;
  gameActive = true;

  renderTrack();
  renderScore();
  setMessage("Line up with the enemy and fire!");

  startScreen.classList.add("overlay--hidden");
  endScreen.classList.add("overlay--hidden");
}

function showEndScreen(title, text) {
  endTitle.textContent = title;
  endText.textContent = text;
  endScoreEl.textContent = String(score).padStart(3, "0");
  endScreen.classList.remove("overlay--hidden");
}

// =========================================================
// EVENT LISTENERS
// =========================================================
btnLeft.addEventListener("click", () => movePlayer("left"));
btnRight.addEventListener("click", () => movePlayer("right"));
btnShoot.addEventListener("click", shoot);
btnQuit.addEventListener("click", quitGame);
btnStart.addEventListener("click", startGame);
btnRestart.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "a") movePlayer("left");
  else if (key === "d") movePlayer("right");
  else if (key === "s") shoot();
  else if (key === "q") quitGame();
});

// =========================================================
// INIT
// =========================================================
buildStarfield();
renderTrack();
renderScore();