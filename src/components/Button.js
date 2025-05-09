import { playButtonHover } from '../hooks/useSound';

const Button = ({ isDisabled, text, onClick, className, secondaryButton }) => {
  return (
    <button
      className={`mq-btn${secondaryButton ? '--secondary' : ''} ${
        className || ''
      }`}
      onClick={onClick}
      disabled={isDisabled}
      onMouseEnter={() => playButtonHover()}
    >
      {text}
    </button>
  );
};

export default Button;
