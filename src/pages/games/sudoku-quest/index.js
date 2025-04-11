import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const SuDokuQuest = () => {
  return (
    <GameStart
      title='Sudoku Quest'
      GameComponent={Game}
      gameClass={'mq-sudoku-game'}
      gameChatRoomId='8'
      chatTitle={'Sudoku Chat Room'}
    />
  );
};

export default SuDokuQuest;
