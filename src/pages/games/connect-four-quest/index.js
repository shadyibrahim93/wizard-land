import GameStart from '../../gamestart';
import Game from './template';

const TicTacToe = () => {
  return (
    <GameStart
      title='Connect Four Quest'
      GameComponent={Game}
      gameClass={'mq-connect-four-game'}
    />
  );
};

export default TicTacToe;
