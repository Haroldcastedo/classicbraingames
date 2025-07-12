
const gameBoard = document.getElementById("game-board");
const restartBtn = document.getElementById("restart");
const timerDisplay = document.getElementById("timer");
const winContainer = document.getElementById("win-message-container");

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let timer = 0;
let interval;

const emojis = ["🍎", "🍌", "🍇", "🍒", "🍓", "🥝", "🍍", "🥥"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(content) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.content = content;
  card.addEventListener("click", () => handleFlip(card));
  return card;
}


function showFirework(type) {
  const fw = document.createElement("img");
  fw.src = type === 'win' ? "win-firework.gif" : "match-firework.gif";
  fw.style.position = "absolute";
  fw.style.left = "50%";
  fw.style.top = "50%";
  fw.style.transform = "translate(-50%, -50%)";
  fw.style.width = type === 'win' ? "300px" : "100px";
  fw.style.pointerEvents = "none";
  document.body.appendChild(fw);
  setTimeout(() => fw.remove(), 1500);
}

function handleFlip(card) {

  if (flippedCards.length >= 2 || card.classList.contains("matched") || flippedCards.includes(card)) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.content;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.content === second.dataset.content) {
      first.classList.add("matched");
      showFirework("match");
      second.classList.add("matched");
      matchedCards += 2;
      flippedCards = [];

      if (matchedCards === 16) setTimeout(() => {
        winContainer.innerHTML = "<h2>You Won!</h2>";
        showFirework("win");
        clearInterval(interval);
      }, 800);
    } else {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        first.textContent = "";
        second.textContent = "";
        flippedCards = [];
      }, 1000);
    }
  }
}

function startTimer() {
  timer = 0;
  timerDisplay.innerText = "Time: 0s";
  interval = setInterval(() => {
    timer++;
    timerDisplay.innerText = "Time: " + timer + "s";
  }, 1000);
}

function startGame() {
  gameBoard.innerHTML = "";
  winContainer.innerHTML = "";
  matchedCards = 0;
  flippedCards = [];
  clearInterval(interval);
  startTimer();

  const shuffled = shuffle([...emojis, ...emojis]);
  shuffled.forEach(content => {
    const card = createCard(content);
    gameBoard.appendChild(card);
  });
}

restartBtn.addEventListener("click", startGame);
startGame();
