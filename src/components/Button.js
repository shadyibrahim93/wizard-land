import { playButtonHover } from '../hooks/useSound';

const Button = ({ isDisabled, text, onClick, className }) => {
  return (
    <button
      className={`mq-btn ${className || ''}`}
      onClick={onClick}
      disabled={isDisabled}
      onMouseEnter={() => playButtonHover()}
    >
      {text}
    </button>
  );
};

export default Button;
