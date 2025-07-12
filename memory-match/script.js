const board = document.getElementById("game-board");
const restartBtn = document.getElementById("restart");
const timerDisplay = document.getElementById("timer");
const winContainer = document.getElementById("win-message-container");

const emojis = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🥝", "🍉"];
let cards = [];
let revealed = [];
let matched = [];
let startTime;
let timerInterval;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createCard(emoji, index) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.emoji = emoji;
  div.dataset.index = index;
  div.addEventListener("click", () => handleCardClick(div));
  return div;
}

function startGame() {
  board.innerHTML = "";
  winContainer.innerHTML = "";
  clearInterval(timerInterval);
  timerDisplay.textContent = "Time: 0s";
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  revealed = [];
  matched = [];

  const deck = shuffle([...emojis, ...emojis]);
  deck.forEach((emoji, i) => {
    const card = createCard(emoji, i);
    board.appendChild(card);
    cards[i] = card;
  });
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = `Time: ${seconds}s`;
}

function handleCardClick(card) {
  if (
    card.classList.contains("revealed") ||
    revealed.length === 2 ||
    matched.includes(card.dataset.index)
  )
    return;

  card.textContent = card.dataset.emoji;
  card.classList.add("revealed");
  revealed.push(card);

  if (revealed.length === 2) {
    const [first, second] = revealed;
    if (first.dataset.emoji === second.dataset.emoji) {
      matched.push(first.dataset.index, second.dataset.index);
      showFirework(first);
      showFirework(second);
      revealed = [];

      if (matched.length === cards.length) {
        setTimeout(showWinMessage, 800);
        clearInterval(timerInterval);
      }
    } else {
      setTimeout(() => {
        first.textContent = "";
        second.textContent = "";
        first.classList.remove("revealed");
        second.classList.remove("revealed");
        revealed = [];
      }, 1000);
    }
  }
}

function showFirework(card) {
  const gif = document.createElement("img");
  gif.src = "fireworks/match.gif";
  gif.className = "firework";
  card.appendChild(gif);
  setTimeout(() => gif.remove(), 1000);
}

function showWinMessage() {
  const time = Math.floor((Date.now() - startTime) / 1000);

  const msg = document.createElement("div");
  msg.id = "win-message";
  msg.innerHTML = `🎉 You won in ${time} seconds! 🎉`;

  const gif = document.createElement("img");
  gif.src = "fireworks/win.gif";
  gif.id = "final-firework";

  winContainer.appendChild(gif);
  winContainer.appendChild(msg);
}

restartBtn.addEventListener("click", startGame);
startGame();
