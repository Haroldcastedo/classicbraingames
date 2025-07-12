
const board = document.getElementById('game-board');
const winMessage = document.getElementById('win-message');
const timerDisplay = document.getElementById('timer');
let cards = [];
let flipped = [];
let matched = [];
let time = 0;
let timer;

const emojis = ['🍎','🍌','🍇','🍓','🍍','🥝','🍒','🍉'];

function shuffle(array) {
  return array.concat(array).sort(() => Math.random() - 0.5);
}

function startTimer() {
  timer = setInterval(() => {
    time++;
    timerDisplay.textContent = `Time: ${time}s`;
  }, 1000);
}

function createBoard() {
  board.innerHTML = '';
  cards = shuffle(emojis);
  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = i;
    card.dataset.emoji = emoji;
    card.addEventListener('click', handleClick);
    board.appendChild(card);
  });
}

function handleClick(e) {
  const card = e.currentTarget;
  const index = card.dataset.index;
  if (flipped.includes(index) || matched.includes(index)) return;

  card.textContent = card.dataset.emoji;
  card.classList.add('revealed');
  flipped.push(index);

  if (flipped.length === 2) {
    const [i1, i2] = flipped;
    const c1 = board.querySelector(`[data-index="${i1}"]`);
    const c2 = board.querySelector(`[data-index="${i2}"]`);
    if (c1.dataset.emoji === c2.dataset.emoji) {
      matched.push(i1, i2);
      flipped = [];
      if (matched.length === cards.length) {
        clearInterval(timer);
        winMessage.innerHTML = `🎉 You<br>Won! 🎉<br>${time}s`;
        winMessage.classList.add('show');
      }
    } else {
      setTimeout(() => {
        c1.textContent = '';
        c2.textContent = '';
        c1.classList.remove('revealed');
        c2.classList.remove('revealed');
        flipped = [];
      }, 1000);
    }
  }
}

window.onload = () => {
  startTimer();
  createBoard();
};
