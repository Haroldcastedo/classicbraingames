
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
  if (
    flippedCards.length === 2 ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  card.classList.add("flipped");
  card.textContent = card.dataset.content;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.content === second.dataset.content) {
      first.classList.add("matched");
      second.classList.add("matched");
      flippedCards = [];
      matchedCards += 2;
      showFirework("match");

      if (matchedCards === 16) {
        clearInterval(interval);
        setTimeout(() => {
          showFirework("win");
          gameBoard.innerHTML = "<h2 style='color:white'>🎉 You Won! 🎉</h2>";
        }, 800);
      }
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

function startGame() {
  cards = [];
  flippedCards = [];
  matchedCards = 0;
  timer = 0;
  clearInterval(interval);
  timerDisplay.textContent = "Time: 0s";

  const doubled = shuffle([...emojis, ...emojis]);
  doubled.forEach((emoji) => {
    cards.push(createCard(emoji));
  });

  gameBoard.innerHTML = "";
  cards.forEach((card) => gameBoard.appendChild(card));

  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function showFirework(type) {
  const fw = document.createElement("img");
  fw.src = type === "win" ? "win-firework.gif" : "match-firework.gif";
  fw.style.position = "absolute";
  fw.style.left = "50%";
  fw.style.top = type === "win" ? "50%" : "40%";
  fw.style.transform = "translate(-50%, -50%)";
  fw.style.width = type === "win" ? "150px" : "80px";
  document.body.appendChild(fw);
  setTimeout(() => fw.remove(), 1500);
}

restartBtn.addEventListener("click", startGame);
window.onload = startGame;
