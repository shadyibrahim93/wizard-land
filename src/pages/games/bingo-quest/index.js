import GameStart from '../../gamestart';
import Game from './template';

const BingoQuest = () => {
  return (
    <GameStart
      title='Bingo Quest'
      GameComponent={Game}
      gameClass={'mq-bingo-game'}
      gameChatRoomId='2'
      chatTitle={'Bingo Chat Room'}
    />
  );
};

export default BingoQuest;
