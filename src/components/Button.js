import './Button.css';

const CreateButton = (buttonText, onClickFunction, className = 'btn', id) => {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.className = className;
  button.onclick = onClickFunction;
  button.id = id;
  return button;
};

export { CreateButton };
