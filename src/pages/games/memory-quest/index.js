import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const DropZoneQuest = () => {
  return (
    <GameStart
      title='Memory Quest'
      GameComponent={Game}
      gameClass={'mq-memory-game'}
      gameId='11'
      chatTitle={'Memory Chat Room'}
    />
  );
};

export default DropZoneQuest;
