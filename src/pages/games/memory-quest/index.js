import GameStart from '../../gamestart';
import Game from './template';

const DropZoneQuest = () => {
  return (
    <GameStart
      title='Memory Quest'
      GameComponent={Game}
      gameClass={'mq-memory-game'}
    />
  );
};

export default DropZoneQuest;
