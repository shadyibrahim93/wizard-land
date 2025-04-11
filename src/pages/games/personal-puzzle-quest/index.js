import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const PersonalPuzzleQuest = () => {
  return (
    <GameStart
      title='Personal Puzzle Quest'
      GameComponent={Game}
      gameClass={'mq-puzzle-game'}
      gameId='5'
      chatTitle={'Personal Jigsaw Chat Room'}
    />
  );
};

export default PersonalPuzzleQuest;
