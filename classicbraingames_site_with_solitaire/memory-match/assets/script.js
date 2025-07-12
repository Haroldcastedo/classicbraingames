
const board = document.getElementById('game-board');
const symbols = ['🍎', '🍌', '🍇', '🍒', '🍎', '🍌', '🍇', '🍒'];
let shuffled = symbols.sort(() => 0.5 - Math.random());
let selected = [];
let matchedCount = 0;

shuffled.forEach((symbol, i) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.innerText = '';
    card.addEventListener('click', () => {
        if (card.classList.contains('flipped') || card.classList.contains('matched') || selected.length === 2) return;
        card.classList.add('flipped');
        card.innerText = symbol;
        selected.push(card);
        if (selected.length === 2) {
            if (selected[0].dataset.symbol === selected[1].dataset.symbol) {
                selected.forEach(c => c.classList.add('matched'));
                matchedCount += 1;
                if (matchedCount === symbols.length / 2) alert('You win!');
            } else {
                setTimeout(() => {
                    selected.forEach(c => {
                        c.classList.remove('flipped');
                        c.innerText = '';
                    });
                }, 1000);
            }
            selected = [];
        }
    });
    board.appendChild(card);
});
