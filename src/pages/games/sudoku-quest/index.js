import GameStart from '../../gamestart';
import Game from './template';

const SuDokuQuest = () => {
  return (
    <GameStart
      title='Sudoku Quest'
      GameComponent={Game}
      gameClass={'mq-sudoku-game'}
    />
  );
};

export default SuDokuQuest;
