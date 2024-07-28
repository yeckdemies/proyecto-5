import './whakAMole.css';
import { CreateButton } from '../components/Button';
import { clear } from '../utils/functions';

let score = localStorage.getItem('score') || 0;
let isPaused = localStorage.getItem('isPaused') || false;
let isGameOver = localStorage.getItem('isGameOver') || false;
let isStart = localStorage.getItem('isStart') || false;
const initialTime = 30;
let timeLeft = localStorage.getItem('timeLeft') || 0;
let gameInterval;
let timerInterval;
let timerPaused = localStorage.getItem('timerPaused') || 0;

const startGameWhackAMole = () => {
  clear();
  createDisplay();
};

const createDisplay = () => {
  const container = document.createElement('section');
  container.className = 'container';

  const nameGame = document.createElement('label');
  nameGame.className = 'nameGame';
  nameGame.innerHTML = 'Whack a mole';
  container.appendChild(nameGame);

  const gameContainer = document.createElement('div');
  gameContainer.id = 'game-container';
  container.appendChild(gameContainer);

  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'score';
  scoreDisplay.textContent = `Puntuación: ${score}`;
  container.appendChild(scoreDisplay);

  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timer';
  timerDisplay.textContent = `Tiempo restante: ${timeLeft}s`;
  container.appendChild(timerDisplay);

  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');

    const mole = document.createElement('img');
    mole.src =
      'https://res.cloudinary.com/dszffglcl/image/upload/v1720544944/zpah6xpz0mqy5un02mx8.png';
    mole.classList.add('mole');
    hole.appendChild(mole);

    mole.addEventListener('click', () => {
      if (mole.style.display === 'block') {
        score++;
        scoreDisplay.textContent = `Puntuación: ${score}`;
        mole.style.display = 'none';
        localStorage.setItem('score', score);
      }
    });

    gameContainer.appendChild(hole);
    app.appendChild(container);
  }
  const controls = document.createElement('div');
  controls.classList.add('controls');

  const startBtn = CreateButton('Start', start, 'btn-controls', 'start');
  const pauseBtn = CreateButton(
    'Pause',
    pauseWAM,
    'btn-controls',
    'pause-continue'
  );
  const restartBtn = CreateButton(
    'Restart',
    restart,
    'btn-controls',
    'restart'
  );

  controls.append(startBtn, pauseBtn, restartBtn);
  container.appendChild(controls);

  checkedStatus();
  if (isGameOver) {
    showGameOverMessage(score);
  }
};

const start = () => {
  if (isStart) return;
  if (isGameOver) return;
  if (isPaused) return;
  isStart = true;
  isPaused = false;
  timeLeft = initialTime;
  gameInterval = setInterval(showMole, 1500);
  controlTime(timeLeft);

  localStorage.setItem('isStart', isStart);
  localStorage.setItem('isPaused', isPaused);
  localStorage.setItem('timeLeft', timeLeft);

  const startBtn = document.getElementById('start');
  startBtn.classList.add('btn-controls-clicked');
};

const showMole = () => {
  const holes = document.querySelectorAll('.hole');
  const randomHole = holes[Math.floor(Math.random() * holes.length)];
  const mole = randomHole.querySelector('.mole');
  mole.style.display = 'block';

  setTimeout(() => {
    mole.style.display = 'none';
  }, 1000);
};

const showGameOverMessage = (score) => {
  const gameOverMessage = document.createElement('div');
  gameOverMessage.id = 'game-over-message';
  gameOverMessage.innerHTML = `Game Over! Tu puntuación es: ${score}`;

  const gameContainer = document.getElementById('game-container');
  gameContainer.appendChild(gameOverMessage);

  const pcBtn = document.getElementById('pause-continue');
  pcBtn.classList.add('btn-controls-clicked');
};

const pauseWAM = () => {
  if (isGameOver) return;
  if (!isStart) return;
  if (isPaused) return;
  isPaused = true;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  timerPaused = timeLeft;
  checkedStatus();

  localStorage.setItem('isPaused', isPaused);
  localStorage.setItem('timerPaused', timerPaused);
};

const controlTime = (timer) => {
  const timerDisplay = document.getElementById('timer');

  timerInterval = setInterval(() => {
    timer--;
    timeLeft = timer;
    timerDisplay.textContent = `Tiempo restante: ${timer}s`;

    if (timer == 0) {
      showGameOverMessage(score);
      isGameOver = true;
      isStart = false;
      isPaused = true;
      clearInterval(gameInterval);
      clearInterval(timerInterval);

      localStorage.setItem('isGameOver', isGameOver);
      localStorage.setItem('isStart', isStart);
      localStorage.setItem('isPaused', isPaused);
    }

    localStorage.setItem('timeLeft', timeLeft);
  }, 1000);
};

const continueGame = () => {
  if (isGameOver) return;
  if (!isPaused) return;
  isPaused = false;
  const newTime = timerPaused;
  gameInterval = setInterval(showMole, 1500);
  controlTime(newTime);
  checkedStatus();
  localStorage.setItem('isPaused', isPaused);
  localStorage.setItem('newTime', newTime);
};

const restart = () => {
  if (isStart) {
    isPaused = true;
  }
  if (isGameOver || isPaused) {
    const gameOverMessage = document.getElementById('game-over-message');
    if (gameOverMessage) {
      gameOverMessage.remove();
    }

    const pcBtn = document.getElementById('pause-continue');
    if (pcBtn) {
      pcBtn.classList.remove('btn-controls-clicked');
    }

    isGameOver = false;
    isStart = false;
    isPaused = false;
    score = 0;
    timeLeft = initialTime;
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.textContent = `Puntuación: ${score}`;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = `Tiempo restante: ${timeLeft}s`;
    const moles = document.querySelectorAll('.mole');
    moles.forEach((mole) => (mole.style.display = 'none'));
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    checkedStatus();

    localStorage.clear();

    start();
  }
};

const checkedStatus = () => {
  if (isStart) {
    const startBtn = document.getElementById('start');
    startBtn.classList.add('btn-controls-clicked');
  }
  if (isPaused) {
    const pauseBtn = document.getElementById('pause-continue');
    pauseBtn.textContent = 'Continue';
    pauseBtn.onclick = continueGame;
  } else {
    const continueBtn = document.getElementById('pause-continue');
    continueBtn.textContent = 'Pause';
    continueBtn.onclick = pauseWAM;
  }
};

window.addEventListener('beforeunload', pauseWAM);

export { startGameWhackAMole, pauseWAM };
