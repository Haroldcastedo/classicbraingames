
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

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

  this.textContent = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCount += 2;
    if (matchedCount === cards.length) {
      stopTimer();
      setTimeout(() => {
        document.getElementById('win-message').classList.remove('hidden');
      }, 800);
    }
    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
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
