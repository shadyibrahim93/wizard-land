import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const ThreeMenMorris = () => {
  return (
    <GameStart
      title={`Three Men's Morris`}
      GameComponent={Game}
      gameClass={'mq-three-men-morris-game'}
      gameId='15'
      chatTitle={`Three Men's Morris Chat Room`}
    />
  );
};

export default ThreeMenMorris;
