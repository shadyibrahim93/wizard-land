import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const PuzzleQuest = () => {
  return (
    <GameStart
      title='Puzzle Quest'
      GameComponent={Game}
      gameClass={'mq-puzzle-game'}
      gameId='6'
      chatTitle={'Jigsaw Chat Room'}
    />
  );
};

export default PuzzleQuest;
