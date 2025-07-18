function showFirework(type) {
  const img = document.createElement('img');
  img.src = type === 'win' ? 'win-firework.gif' : 'match-firework.gif';
  Object.assign(img.style, {
    position:  'fixed',
    left:      '50%',
    top:       '50%',
    transform: 'translate(-50%, -50%)',
    width:     type === 'win' ? '300px' : '100px',
    pointerEvents: 'none',
    zIndex:    9999,
    animation: 'fadeOut 1.5s forwards'
  });
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 1500);
}

const options = {
  draw: 1,
  theme: 'classic',
  showTimer: true,
  showScore: true,
  onMoveToFoundation: () => showFirework('match'),
  onWin: () => showFirework('win')
};

const game = new Solitaire('#solitaire-root', options);
