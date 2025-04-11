import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const DropZoneQuest = () => {
  return (
    <GameStart
      title='DropZone Quest'
      GameComponent={Game}
      gameClass={'mq-dropzone-game'}
      gameId='10'
      chatTitle={'Dropzone Chat Room'}
    />
  );
};

export default DropZoneQuest;
