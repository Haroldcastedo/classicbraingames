
const gameBoard = document.getElementById("game-board");
const restartBtn = document.getElementById("restart");
const timerDisplay = document.getElementById("timer");
const winContainer = document.getElementById("win-message-container");

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let timer = 0;
let interval;

const emojis = ["🍎", "🍌", "🍇", "🍒", "🍓", "🥝"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)];
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(content) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerText = content;
  card.dataset.content = content;
  card.addEventListener("click", () => handleFlip(card));
  return card;
}

function handleFlip(card) {
  if (flippedCards.length >= 2 || card.classList.contains("matched") || flippedCards.includes(card)) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.content === second.dataset.content) {
      first.classList.add("matched");
      second.classList.add("matched");
      matchedCards += 2;
      showMatchEffect(first);
      flippedCards = [];

      if (matchedCards === 12) setTimeout(showWinMessage, 800);
    } else {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        flippedCards = [];
      }, 1000);
    }
  }
}

function showMatchEffect(card) {
  const effect = document.createElement("div");
  effect.classList.add("firework");
  card.appendChild(effect);
  setTimeout(() => effect.remove(), 1500);
}

function showWinMessage() {
  clearInterval(interval);
  gameBoard.innerHTML = '<h2 style="text-align:center;">🎉 You Won!</h2><img src="win.gif" width="150" />';
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
