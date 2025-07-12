
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

function handleFlip(card) {
  if (flippedCards.length >= 2 || card.classList.contains("matched") || flippedCards.includes(card)) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.content;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.content === second.dataset.content) {
      first.classList.add("matched");
      second.classList.add("matched");
      matchedCards += 2;
      flippedCards = [];

      if (matchedCards === 16) setTimeout(() => {
        winContainer.innerHTML = '<h2>You Won!</h2>';
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
