import GameStart from '../../gamestart';
import Game from './template';

const PuzzleQuest = () => {
  return (
    <GameStart
      title='Puzzle Quest'
      GameComponent={Game}
      gameClass={'mq-puzzle-game'}
    />
  );
};

export default PuzzleQuest;
