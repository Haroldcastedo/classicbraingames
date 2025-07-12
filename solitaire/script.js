
const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [];
let tableau = [[], [], [], [], [], [], []];
let foundations = { "♠": [], "♥": [], "♦": [], "♣": [] };
let waste = [];
let stock = [];

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value, color: suit === "♥" || suit === "♦" ? "red" : "black" });
    }
  }
  shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function deal() {
  tableau = [[], [], [], [], [], [], []];
  foundations = { "♠": [], "♥": [], "♦": [], "♣": [] };
  waste = [];
  stock = [];

  // Deal cards to tableau
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      let card = deck.pop();
      card.faceUp = j === i;
      tableau[i].push(card);
    }
  }

  // Remaining to stock
  while (deck.length) {
    let card = deck.pop();
    card.faceUp = false;
    stock.push(card);
  }

  render();
}

function render() {
  renderTableau();
  renderStock();
  renderWaste();
  renderFoundations();
}

function renderTableau() {
  const tableauArea = document.getElementById("tableau");
  tableauArea.innerHTML = "";
  tableau.forEach((stack, i) => {
    const col = document.createElement("div");
    col.className = "pile tableau-col";
    stack.forEach((card, index) => {
      const cardDiv = createCardElement(card);
      cardDiv.style.top = `${index * 25}px`;
      cardDiv.dataset.col = i;
      cardDiv.dataset.index = index;
      col.appendChild(cardDiv);
    });
    tableauArea.appendChild(col);
  });
}

function createCardElement(card) {
  const div = document.createElement("div");
  div.classList.add("card");
  if (!card.faceUp) {
    div.classList.add("back");
  } else {
    div.textContent = card.value + card.suit;
    if (card.color === "red") div.classList.add("red");
  }
  return div;
}

function renderStock() {
  const stockEl = document.getElementById("stock");
  stockEl.innerHTML = "";
  if (stock.length > 0) {
    const cardBack = document.createElement("div");
    cardBack.classList.add("card", "back");
    stockEl.appendChild(cardBack);
  } else {
    stockEl.textContent = "";
  }
  stockEl.onclick = drawFromStock;
}

function drawFromStock() {
  if (stock.length === 0) {
    stock = waste.reverse().map(card => ({ ...card, faceUp: false }));
    waste = [];
  }
  if (stock.length > 0) {
    const card = stock.pop();
    card.faceUp = true;
    waste.push(card);
  }
  render();
}

function renderWaste() {
  const wasteEl = document.getElementById("waste");
  wasteEl.innerHTML = "";
  const topCard = waste[waste.length - 1];
  if (topCard) {
    const cardDiv = createCardElement(topCard);
    wasteEl.appendChild(cardDiv);
  }
}

function renderFoundations() {
  document.querySelectorAll(".foundation").forEach(el => {
    const suit = el.dataset.suit;
    el.innerHTML = "";
    const stack = foundations[suit];
    if (stack.length > 0) {
      const topCard = stack[stack.length - 1];
      const div = createCardElement(topCard);
      el.appendChild(div);
    }
  });
}

document.getElementById("restart").addEventListener("click", () => {
  createDeck();
  deal();
});

window.onload = () => {
  createDeck();
  deal();
};
