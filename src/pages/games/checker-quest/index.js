import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const CheckerQuest = () => {
  return (
    <GameStart
      title='Checker Quest'
      GameComponent={Game}
      gameClass={'mq-checker-game'}
      gameId='3'
      chatTitle={'Checker Chat Room'}
    />
  );
};

export default CheckerQuest;
