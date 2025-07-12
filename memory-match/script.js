
const emojis = ['🍎','🍌','🍇','🍉','🍓','🍍','🥝','🍒'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let timer = 0;
let interval;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  cards = [...emojis, ...emojis];
  shuffle(cards);
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerHTML = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function startTimer() {
  timer = 0;
  document.getElementById('timer').textContent = `Time: 0s`;
  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = `Time: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function restartGame() {
  document.getElementById('win-message').classList.add('hidden');
  matchedCount = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  createBoard();
  stopTimer();
  startTimer();
}

function showFirework(type) {
  const fw = document.createElement("img");
  fw.src = type === "win" ? "win-firework.gif" : "match-firework.gif";
  fw.style.position = "absolute";
  fw.style.left = "50%";
  fw.style.top = "50%";
  fw.style.transform = "translate(-50%, -50%)";
  fw.style.width = type === "win" ? "200px" : "100px";
  fw.style.pointerEvents = "none";
  document.body.appendChild(fw);
  setTimeout(() => fw.remove(), 1500);
}

function flipCard(e) {
  if (lockBoard) return;
  const card = e.currentTarget;
  if (card === firstCard || card.classList.contains('matched')) return;

  card.textContent = card.dataset.emoji;
  card.classList.add('revealed');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCount += 2;
    showFirework("match");

    if (matchedCount === cards.length) {
      stopTimer();
      setTimeout(() => {
        document.getElementById('win-message').classList.remove('hidden');
        showFirework("win");
      }, 800);
    }
    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
      firstCard.classList.remove('revealed');
      secondCard.classList.remove('revealed');
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

document.addEventListener('DOMContentLoaded', () => {
  restartGame();
});
