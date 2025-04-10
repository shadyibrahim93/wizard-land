import GameStart from '../../gamestart';
import Game from './template';

const PuzzleQuest = () => {
  return (
    <GameStart
      title='Puzzle Quest'
      GameComponent={Game}
      gameClass={'mq-puzzle-game'}
      gameChatRoomId='6'
      chatTitle={'Jigsaw Chat Room'}
    />
  );
};

export default PuzzleQuest;
