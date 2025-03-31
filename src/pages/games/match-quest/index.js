import GameStart from '../../gamestart';
import Game from './template';

const DropZoneQuest = () => {
  return (
    <GameStart
      title='Match Quest'
      GameComponent={Game}
      gameClass={'mq-match-game'}
    />
  );
};

export default DropZoneQuest;
