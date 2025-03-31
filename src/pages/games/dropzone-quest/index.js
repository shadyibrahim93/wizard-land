import GameStart from '../../gamestart';
import Game from './template';

const DropZoneQuest = () => {
  return (
    <GameStart
      title='DropZone Quest'
      GameComponent={Game}
      gameClass={'mq-dropzone-game'}
    />
  );
};

export default DropZoneQuest;
