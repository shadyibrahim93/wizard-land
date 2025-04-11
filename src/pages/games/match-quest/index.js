import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const DropZoneQuest = () => {
  return (
    <GameStart
      title='Match Quest'
      GameComponent={Game}
      gameClass={'mq-match-game'}
      gameChatRoomId='1'
      chatTitle={'Matching Chat Room'}
    />
  );
};

export default DropZoneQuest;
