import './memoryGame.css';
import { clear } from '../utils/functions';
import { CreateButton } from '../components/Button';

const accessKey = 'xwtr23PvziPGTf6A4Aoa8aYkhvWyt_MWecs4whcUXqA';
const query = 'nature';
const numberOfPairs = 6;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let attempts = 0;

const startGameMemory = () => {
  clear();
  createDisplay();
  fetchImages().then((duplicatedImages) => {
    displayCards(duplicatedImages);
    loadGameState();
    setupEventListeners();
  });
};

const createDisplay = () => {
  const container = document.createElement('section');
  container.className = 'container';

  const nameGame = document.createElement('label');
  nameGame.className = 'nameGame';
  nameGame.innerHTML = 'Memory Game';
  container.appendChild(nameGame);

  const gameBoard = document.createElement('div');
  gameBoard.id = 'gameBoard';

  const coountMatched = document.createElement('p');
  coountMatched.className = 'matched-pairs';
  coountMatched.innerHTML = `Parejas encontradas: ${matchedPairs}/${numberOfPairs}`;

  const spanAttempts = document.createElement('span');
  spanAttempts.id = 'spanAttempts';
  spanAttempts.innerHTML = `Intentos: ${attempts}`;

  const restartBtn = CreateButton(
    'Restart',
    restart,
    'btn-controls',
    'restart'
  );

  container.append(gameBoard, coountMatched, spanAttempts, restartBtn);
  app.appendChild(container);
};

const fetchImages = async () => {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${numberOfPairs}&query=${query}`
  );
  const data = await response.json();
  const images = data.map((photo) => ({
    id: photo.id,
    url: photo.urls.small
  }));

  const duplicatedImages = [...images, ...images];
  shuffleArray(duplicatedImages);

  return duplicatedImages;
};

//Barajar las cartas, algoritmo Fisher-Yates
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const displayCards = (images) => {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';

  images.forEach((image, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = image.id;
    card.dataset.index = index;

    const frontFace = document.createElement('img');
    frontFace.src = image.url;
    frontFace.classList.add('front-face');

    const backFace = document.createElement('div');
    backFace.classList.add('back-face');
    backFace.innerText = '📷';

    card.appendChild(frontFace);
    card.appendChild(backFace);

    gameBoard.appendChild(card);
  });
};

const flipCard = (event) => {
  if (lockBoard) return;
  const clickedCard = event.currentTarget;

  if (clickedCard === firstCard) return;
  clickedCard.classList.add('flip');

  if (!firstCard) {
    firstCard = clickedCard;
  } else {
    secondCard = clickedCard;
    checkForMatch();
    saveGameState();
  }
};

const setupEventListeners = () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => card.addEventListener('click', flipCard));
};

const disableCards = () => {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetSelection();
};

const unflipCards = () => {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetSelection();
  }, 1000);
};

const resetSelection = () => {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
};

const resetBoard = () => {
  matchedPairs = 0;
  attempts = 0;
  startGameMemory();
};

const updateAttempts = () => {
  attempts++;
  let attemptsElement = document.getElementById('spanAttempts');
  attemptsElement.innerHTML = `Intentos: ${attempts}`;
};

const checkForMatch = () => {
  let isMatch = firstCard.dataset.id === secondCard.dataset.id;
  updateAttempts();

  if (isMatch) {
    disableCards();
    matchedPairs++;
    let matchedPairsElement = document.querySelector('.matched-pairs');
    matchedPairsElement.innerHTML = `Parejas encontradas: ${matchedPairs}/${numberOfPairs}`;
  } else {
    unflipCards();
  }
  saveGameState();
};

const saveGameState = () => {
  const cards = Array.from(document.querySelectorAll('.card')).map((card) => ({
    id: card.dataset.id,
    index: card.dataset.index,
    classes: card.className,
    imageUrl: card.querySelector('.front-face').src
  }));

  localStorage.setItem('memoryGameState', JSON.stringify(cards));
  localStorage.setItem('matchedPairs', matchedPairs);
  localStorage.setItem('attempts', attempts);
};

const loadGameState = () => {
  const savedState = localStorage.getItem('memoryGameState');
  if (savedState) {
    const gameState = JSON.parse(savedState);
    gameState.forEach((state) => {
      const card = document.querySelector(`.card[data-index='${state.index}']`);
      if (card) {
        card.dataset.id = state.id;
        card.className = state.classes;
        card.querySelector('.front-face').src = state.imageUrl;
      }
    });
    matchedPairs = parseInt(localStorage.getItem('matchedPairs'), 10) || 0;
    attempts = parseInt(localStorage.getItem('attempts'), 10) || 0;

    document.querySelector(
      '.matched-pairs'
    ).innerHTML = `Parejas encontradas: ${matchedPairs}/${numberOfPairs}`;
    document.getElementById('spanAttempts').innerHTML = `Intentos: ${attempts}`;
  }
};

const restart = () => {
  resetBoard();
  localStorage.clear();
};

export { startGameMemory };
