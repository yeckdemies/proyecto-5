import './ticTacToe.css';
import { CreateButton } from '../components/Button';
import { clear } from '../utils/functions';

const player_O = 'O';
const player_X = 'X';
let currentPlayer = player_X;
const spaces = Array(9).fill(null);
let gameOverTTT = false;
const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const startGameTicTacToe = () => {
  clear();
  const container = document.createElement('section');
  const table = document.createElement('div');
  const playerText = document.createElement('label');

  const restartBtn = CreateButton(
    'Restart',
    restart,
    'btn-controls',
    'restart'
  );

  container.id = 'tictactoe';
  container.classList.add('container');
  table.classList.add('tablero');
  playerText.id = 'playerText';
  playerText.className = 'player';
  playerText.innerHTML = 'Tic Tac Toe';

  for (let i = 0; i < 9; i += 1) {
    const casilla = document.createElement('div');
    casilla.classList.add('casilla');
    casilla.id = `${i}`;
    table.appendChild(casilla);
    casilla.addEventListener('click', casillaClick);
  }

  container.append(playerText, table, restartBtn);
  app.appendChild(container);

  loadLocalStorageValues();
};

const casillaClick = (e) => {
  const id = e.target.id;

  if (spaces[id]) return;
  spaces[id] = currentPlayer;
  e.target.innerText = currentPlayer;
  localStorage.setItem(id, e.target.innerText);

  if (theWinnerIs()) {
    playerText.innerHTML = `El ganador es el jugador ${currentPlayer}`;
    gameOverTTT = true;
    localStorage.setItem('gameOverTTT', gameOverTTT);
    localStorage.setItem('playerText', playerText.innerHTML);
    disableAllCasillas();
  } else {
    currentPlayer = currentPlayer === player_X ? player_O : player_X;
  }
};

const theWinnerIs = () => {
  for (const condition of winningCombination) {
    let [a, b, c] = condition;

    if (spaces[a] && spaces[a] == spaces[b] && spaces[a] == spaces[c]) {
      return [a, b, c];
    } else if (!spaces.includes(null)) {
      playerText.innerHTML = 'Empate!';
      localStorage.setItem('playerText', playerText.innerHTML);
      gameOverTTT = true;
      localStorage.setItem('gameOver', gameOverTTT);
      disableAllCasillas();
    }
  }
  return false;
};

const disableAllCasillas = () => {
  const casillas = document.querySelectorAll('.casilla');
  casillas.forEach((casilla) => {
    casilla.classList.add('disabled');
  });
};

const restart = () => {
  const casillas = document.querySelectorAll('.casilla');
  spaces.fill(null);

  casillas.forEach((casilla) => {
    casilla.innerText = '';
  });

  playerText.innerHTML = 'Tic Tac Toe';
  casillas.forEach((casilla) => {
    casilla.classList.remove('disabled');
  });

  currentPlayer = player_X;
  localStorage.clear();
};

const loadLocalStorageValues = () => {
  for (let i = 0; i < 9; i += 1) {
    const casilla = document.getElementById(`${i}`);
    casilla.innerText = localStorage.getItem(i);
    spaces[i] = localStorage.getItem(i);
  }

  if (localStorage.getItem('gameOverTTT') === 'true') {
    playerText.innerHTML = localStorage.getItem('playerText');
    disableAllCasillas();
  }
};

export { startGameTicTacToe };
