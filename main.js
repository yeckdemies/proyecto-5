import './style.css';
import { CreateButton } from './src/components/Button';
import { startGameTicTacToe } from './src/ticTacToe/ticTacToe';
import { startGameWhackAMole } from './src/whakAMole/whackAMole';
import { startGameMemory } from './src/memoryGame/memoryGame';
import { toggleGameButtons, changeGame } from './src/utils/functions';

const initializeGameButtons = () => {
  const gameButtonsContainer = document.createElement('div');
  gameButtonsContainer.classList.add('button-container');

  const game1Button = CreateButton(
    'Tic Tac Toe',
    () => {
      changeGame('TTT');
      toggleGameButtons('ttt');
      startGameTicTacToe();
    },
    'btn',
    'ttt'
  );

  const game2Button = CreateButton(
    'Wack A Mole',
    () => {
      changeGame('WAM');
      toggleGameButtons('wam');
      startGameWhackAMole();
    },
    'btn',
    'wam'
  );

  const game3Button = CreateButton(
    'Memory Game',
    () => {
      changeGame('MG');
      toggleGameButtons('mg');
      startGameMemory();
    },
    'btn',
    'mg'
  );

  gameButtonsContainer.appendChild(game1Button);
  gameButtonsContainer.appendChild(game2Button);
  gameButtonsContainer.appendChild(game3Button);

  app.appendChild(gameButtonsContainer);
};

window.onload = initializeGameButtons;
