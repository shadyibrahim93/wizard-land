import GameStart from '../../gamestart';
import Game from './template';

const TicTacToe = () => {
  return (
    <GameStart
      title='Tic Tac Toe Quest'
      GameComponent={Game}
      gameClass={'mq-tic-tac-toe-game'}
    />
  );
};

export default TicTacToe;
