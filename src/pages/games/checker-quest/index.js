import GameStart from '../../gamestart';
import Game from './template';

const CheckerQuest = () => {
  return (
    <GameStart
      title='Checker Quest'
      GameComponent={Game}
      gameClass={'mq-checker-game'}
    />
  );
};

export default CheckerQuest;
