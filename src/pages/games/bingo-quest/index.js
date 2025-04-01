import GameStart from '../../gamestart';
import Game from './template';

const BingoQuest = () => {
  return (
    <GameStart
      title='Bingo Quest'
      GameComponent={Game}
      gameClass={'mq-bingo-game'}
    />
  );
};

export default BingoQuest;
