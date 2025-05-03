import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const DropZoneQuest = () => {
  return (
    <GameStart
      title='Matching Tales'
      GameComponent={Game}
      gameClass={'mq-match-game'}
      gameId='1'
      chatTitle={'Matching Chat Room'}
    />
  );
};

export default DropZoneQuest;
