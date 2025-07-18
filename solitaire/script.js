const suits = ['♠','♥','♦','♣'];
const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

let deck = [], stock = [], waste = [], foundations = {}, tableau = [], history = [], score = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showFirework(type) {
  const img = document.createElement('img');
  img.src = type === 'win' ? 'win-firework.gif' : 'match-firework.gif';
  Object.assign(img.style, {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: type === 'win' ? '200px' : '100px',
    pointerEvents: 'none',
    zIndex: '9999',
    animation: 'fadeOut 1.5s ease-out forwards'
  });
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 1500);
}

function initGame() {
  deck = [];
  suits.forEach(s => values.forEach(v => deck.push({suit: s, value: v, faceUp: false})));
  shuffle(deck);
  tableau = Array.from({length:7}, () => []);
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      let card = deck.pop();
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }
  stock = deck.slice();
  waste = [];
  foundations = {};
  suits.forEach(s => foundations[s] = []);
  history = [];
  score = 0;
  render();
  updateScore();
}

function render() {
  renderStock();
  renderWaste();
  renderFoundations();
  renderTableau();
}

function renderStock() {
  const stockDiv = document.getElementById('stock');
  stockDiv.innerHTML = '';
  if (stock.length) {
    let slot = document.createElement('div');
    slot.className = 'card face-down';
    stockDiv.appendChild(slot);
  }
  stockDiv.onclick = drawCard;
}

function renderWaste() {
  const wasteDiv = document.getElementById('waste');
  wasteDiv.innerHTML = '';
  if (waste.length) {
    const c = waste[waste.length - 1];
    let slot = document.createElement('div');
    slot.className = 'card';
    slot.textContent = c.value + c.suit;
    wasteDiv.appendChild(slot);
  }
}

function renderFoundations() {
  document.querySelectorAll('.foundation').forEach(el => {
    const s = el.dataset.suit, arr = foundations[s];
    el.innerHTML = '';
    if (arr.length) {
      const top = arr[arr.length - 1];
      let slot = document.createElement('div');
      slot.className = 'card';
      slot.textContent = top.value + top.suit;
      el.appendChild(slot);
    }
  });
}

function renderTableau() {
  const tbl = document.getElementById('tableau');
  tbl.innerHTML = '';
  tableau.forEach((col, i) => {
    const pileDiv = document.createElement('div');
    pileDiv.className = 'pile';
    col.forEach((card, idx) => {
      const cd = document.createElement('div');
      cd.className = 'card' + (card.faceUp ? '' : ' face-down');
      cd.textContent = card.faceUp ? card.value + card.suit : '';
      cd.style.top = (idx * 25) + 'px';
      cd.draggable = card.faceUp;
      cd.addEventListener('dragstart', e => dragStart(e, i, idx));
      pileDiv.appendChild(cd);
    });
    pileDiv.addEventListener('dragover', e => e.preventDefault());
    pileDiv.addEventListener('drop', e => dropOnTableau(e, i));
    tbl.appendChild(pileDiv);
  });
}

function drawCard() {
  if (!stock.length) {
    stock = waste.reverse().map(c => { c.faceUp = false; return c; });
    waste = [];
  } else {
    const c = stock.pop(); c.faceUp = true; waste.push(c);
  }
  recordState();
  updateScore(5);
  showFirework('match');
  render();
}

function dragStart(e, col, idx) {
  e.dataTransfer.setData('text', JSON.stringify({col, idx}));
}

function dropOnTableau(e, targetCol) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text'));
  const fromCol = data.col, startIdx = data.idx;
  const moving = tableau[fromCol].slice(startIdx);
  const targetPile = tableau[targetCol];
  const top = targetPile[targetPile.length - 1];
  if (canPlaceOnTableau(moving[0], top)) {
    recordState();
    tableau[fromCol] = tableau[fromCol].slice(0, startIdx);
    tableau[targetCol] = targetPile.concat(moving);
    flipTop(fromCol);
    updateScore(5);
    showFirework('match');
    render();
    checkWin();
  }
}

function canPlaceOnTableau(card, top) {
  if (!top) return card.value === 'K';
  const isRed = (card.suit === '♥' || card.suit === '♦');
  const isTopRed = (top.suit === '♥' || top.suit === '♦');
  return values.indexOf(card.value) + 1 === values.indexOf(top.value) && isRed !== isTopRed;
}

function dropOnFoundation(e) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text'));
  const col = data.col, idx = data.idx;
  if (idx !== tableau[col].length - 1) return;
  const card = tableau[col].pop();
  const pile = foundations[card.suit];
  if (canPlaceOnFoundation(card, pile)) {
    recordState();
    pile.push(card);
    flipTop(col);
    updateScore(10);
    showFirework('match');
    render();
    checkWin();
  } else {
    tableau[col].push(card);
  }
}

function canPlaceOnFoundation(card, pile) {
  if (!pile.length) return card.value === 'A';
  const top = pile[pile.length - 1];
  return card.suit === top.suit && values.indexOf(card.value) === values.indexOf(top.value) + 1;
}

function flipTop(col) {
  const pile = tableau[col];
  if (pile.length && !pile[pile.length - 1].faceUp) pile[pile.length - 1].faceUp = true;
}

function recordState() {
  history.push(JSON.stringify({stock, waste, foundations, tableau, score}));
  if (history.length > 50) history.shift();
}

function undo() {
  if (!history.length) return;
  const state = JSON.parse(history.pop());
  stock = state.stock; waste = state.waste; foundations = state.foundations; tableau = state.tableau; score = state.score;
  render(); updateScore(0);
}

function updateScore(delta = 0) {
  score += delta;
  document.getElementById('score').textContent = 'Score: ' + score;
}

function checkWin() {
  if (suits.every(s => foundations[s].length === 13)) {
    document.getElementById('win-overlay').classList.remove('hidden');
    showFirework('win');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('restart').addEventListener('click', initGame);
  document.getElementById('undo').addEventListener('click', undo);
  document.querySelectorAll('.foundation').forEach(el => {
    el.addEventListener('dragover', e => e.preventDefault());
    el.addEventListener('drop', dropOnFoundation);
  });
  initGame();
});
