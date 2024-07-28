import { pauseWAM } from '../whakAMole/whackAMole';

const toggleGameButtons = (clickedButtonId) => {
  const gameButtons = document.querySelectorAll('.btn');

  gameButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove('btn-clicked');
  });

  if (clickedButtonId !== 'restart') {
    const clickedButton = document.querySelector(`#${clickedButtonId}`);
    if (clickedButton) {
      clickedButton.disabled = true;
      clickedButton.classList.add('btn-clicked');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const gameButtons = document.querySelectorAll('.btn');
  gameButtons.forEach((button) => {
    button.addEventListener('click', () => toggleGameButtons(button.id));
  });
});

const clear = () => {
  const section = document.querySelector('section');

  if (section) {
    section.remove();
  }
};

const changeGame = (game) => {
  if (game != 'WAM') {
    pauseWAM();
  }
};

export { toggleGameButtons, clear, changeGame };
