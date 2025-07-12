
document.addEventListener("DOMContentLoaded", () => {
  const suits = ['♠', '♣', '♥', '♦'];
  const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

  function createDeck() {
    const deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ value, suit });
      }
    }
    return shuffle(deck);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderDeck(deck) {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    deck.forEach(card => {
      const div = document.createElement('div');
      div.classList.add('card');
      if (card.suit === '♥' || card.suit === '♦') {
        div.classList.add('red');
      }
      div.innerText = `${card.value}${card.suit}`;
      container.appendChild(div);
    });
  }

  document.getElementById('restart').addEventListener('click', () => {
    const newDeck = createDeck();
    renderDeck(newDeck);
  });

  // Initial game start
  const startingDeck = createDeck();
  renderDeck(startingDeck);
});
