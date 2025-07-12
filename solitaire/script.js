let deck = [];
let waste = [];
let tableau = [[], [], [], [], [], [], []];
let foundations = [[], [], [], []];
let moveHistory = [];
let score = 0;

const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function shuffleDeck() {
  deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ suit, rank, color: (suit === "♥" || suit === "♦") ? "red" : "black", faceUp: false });
    });
  });
  deck.sort(() => Math.random() - 0.5);
}

function setupBoard() {
  shuffleDeck();
  for (let i = 0; i < 7; i++) {
    tableau[i] = [];
    for (let j = 0; j <= i; j++) {
      const card = deck.pop();
      card.faceUp = (j === i);
      tableau[i].push(card);
    }
  }
  waste = [];
  foundations = [[], [], [], []];
  score = 0;
  moveHistory = [];
  renderGame();
  updateScore(0);
}

function updateScore(amount) {
  score += amount;
  document.getElementById("scoreDisplay").innerText = "Score: " + score;
}

function recordMove() {
  moveHistory.push({
    deck: JSON.parse(JSON.stringify(deck)),
    waste: JSON.parse(JSON.stringify(waste)),
    tableau: JSON.parse(JSON.stringify(tableau)),
    foundations: JSON.parse(JSON.stringify(foundations)),
    score
  });
}

function undoMove() {
  if (moveHistory.length === 0) return;
  const last = moveHistory.pop();
  deck = last.deck;
  waste = last.waste;
  tableau = last.tableau;
  foundations = last.foundations;
  score = last.score;
  updateScore(0);
  renderGame();
}

function drawCard() {
  if (deck.length === 0) {
    deck = waste.reverse().map(card => ({ ...card, faceUp: false }));
    waste = [];
  } else {
    const drawn = deck.pop();
    drawn.faceUp = true;
    waste.push(drawn);
    updateScore(5);
  }
  recordMove();
  renderGame();
}

function renderGame() {
  const tableauContainer = document.getElementById("tableau-piles");
  tableauContainer.innerHTML = "";
  tableau.forEach((pile, pileIndex) => {
    const pileDiv = document.createElement("div");
    pileDiv.className = "pile";
    pileDiv.dataset.pileIndex = pileIndex;
    pile.forEach((card, i) => {
      const cardDiv = createCardDiv(card, i);
      cardDiv.setAttribute("draggable", card.faceUp);
      cardDiv.ondragstart = dragStart;
      pileDiv.appendChild(cardDiv);
    });
    pileDiv.ondragover = allowDrop;
    pileDiv.ondrop = dropCard;
    tableauContainer.appendChild(pileDiv);
  });

  const drawPile = document.getElementById("draw-pile");
  drawPile.innerHTML = "";
  drawPile.onclick = drawCard;
  const drawPlaceholder = document.createElement("div");
  drawPlaceholder.className = "card back";
  drawPile.appendChild(drawPlaceholder);

  const wastePile = document.getElementById("waste-pile");
  wastePile.innerHTML = "";
  if (waste.length > 0) {
    const top = waste[waste.length - 1];
    const cardDiv = createCardDiv(top, 0);
    cardDiv.setAttribute("draggable", true);
    cardDiv.ondragstart = dragStart;
    wastePile.appendChild(cardDiv);
  }

  const foundationContainer = document.getElementById("foundation-piles");
  foundationContainer.innerHTML = "";
  foundations.forEach((pile, pileIndex) => {
    const pileDiv = document.createElement("div");
    pileDiv.className = "pile";
    pileDiv.dataset.foundation = pileIndex;
    if (pile.length > 0) {
      const card = pile[pile.length - 1];
      const cardDiv = createCardDiv(card, 0);
      pileDiv.appendChild(cardDiv);
    }
    pileDiv.ondragover = allowDrop;
    pileDiv.ondrop = dropCard;
    foundationContainer.appendChild(pileDiv);
  });

  checkWin();
}

function createCardDiv(card, offset) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  if (!card.faceUp) cardDiv.classList.add("back");
  if (card.color === "red") cardDiv.classList.add("red");
  cardDiv.textContent = card.faceUp ? (card.rank + card.suit) : "";
  cardDiv.style.top = offset * 20 + "px";
  cardDiv.dataset.rank = card.rank;
  cardDiv.dataset.suit = card.suit;
  cardDiv.dataset.color = card.color;
  return cardDiv;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function dragStart(ev) {
  ev.dataTransfer.setData("text", JSON.stringify({
    rank: ev.target.dataset.rank,
    suit: ev.target.dataset.suit,
    color: ev.target.dataset.color
  }));
}

function dropCard(ev) {
  ev.preventDefault();
  const data = JSON.parse(ev.dataTransfer.getData("text"));
  const targetPile = ev.currentTarget;

  // This example accepts all drops for now. Full legal move checks will go here.
  updateScore(10);
  renderGame();
}

function checkWin() {
  const total = foundations.reduce((acc, pile) => acc + pile.length, 0);
  if (total === 52) {
    setTimeout(() => alert("🎉 You won!"), 100);
  }
}

document.getElementById("restartBtn").addEventListener("click", setupBoard);
document.getElementById("undoBtn").addEventListener("click", undoMove);

setupBoard();

// Continuation of previously structured logic
// Adds rule validation and auto-move to foundation

function isValidMove(card, targetPile) {
  if (targetPile.length === 0) {
    return card.rank === "K";
  }
  const topCard = targetPile[targetPile.length - 1];
  const nextRankIndex = ranks.indexOf(topCard.rank) - 1;
  return (
    card.color !== topCard.color &&
    ranks.indexOf(card.rank) === nextRankIndex
  );
}

function isValidFoundationMove(card, foundationPile) {
  if (foundationPile.length === 0) {
    return card.rank === "A";
  }
  const top = foundationPile[foundationPile.length - 1];
  const nextRankIndex = ranks.indexOf(top.rank) + 1;
  return (
    card.suit === top.suit &&
    ranks.indexOf(card.rank) === nextRankIndex
  );
}

function dropCard(ev) {
  ev.preventDefault();
  const data = JSON.parse(ev.dataTransfer.getData("text"));
  const sourceCard = findCard(data.rank, data.suit);
  if (!sourceCard) return;

  const pileType = ev.currentTarget.dataset.pileIndex !== undefined ? 'tableau' : 'foundation';
  const pileIndex = pileType === 'tableau' ? parseInt(ev.currentTarget.dataset.pileIndex) : parseInt(ev.currentTarget.dataset.foundation);
  const targetPile = pileType === 'tableau' ? tableau[pileIndex] : foundations[pileIndex];

  const isValid = pileType === 'tableau'
    ? isValidMove(sourceCard.card, targetPile)
    : isValidFoundationMove(sourceCard.card, targetPile);

  if (!isValid) return;

  recordMove();
  sourceCard.pile.splice(sourceCard.index, 1);
  targetPile.push(sourceCard.card);

  if (sourceCard.pile.length && !sourceCard.pile[sourceCard.pile.length - 1].faceUp) {
    sourceCard.pile[sourceCard.pile.length - 1].faceUp = true;
    updateScore(5);
  } else {
    updateScore(10);
  }

  renderGame();
}

function findCard(rank, suit) {
  const piles = [...tableau, waste];
  for (let pile of piles) {
    for (let i = 0; i < pile.length; i++) {
      const card = pile[i];
      if (card.rank === rank && card.suit === suit && card.faceUp) {
        return { card, pile, index: i };
      }
    }
  }
  return null;
}

function autoMoveToFoundation() {
  tableau.forEach((pile, i) => {
    if (pile.length === 0) return;
    const topCard = pile[pile.length - 1];
    if (!topCard.faceUp) return;
    foundations.forEach((fPile, fIndex) => {
      if (isValidFoundationMove(topCard, fPile)) {
        recordMove();
        pile.pop();
        fPile.push(topCard);
        updateScore(10);
      }
    });
  });
  renderGame();
}

function checkWin() {
  const total = foundations.reduce((acc, pile) => acc + pile.length, 0);
  if (total === 52) {
    const board = document.getElementById("solitaire-board");
    board.innerHTML = '<h2 style="font-size:2em;">🎉 You Won!</h2><img src="win.gif" style="width:300px;" />';
  }
}
