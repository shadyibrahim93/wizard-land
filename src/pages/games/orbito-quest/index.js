import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const Orbito = () => {
  return (
    <GameStart
      title='Orbito Adventure'
      GameComponent={Game}
      gameClass={'mq-orbito-game'}
      gameId='12'
      chatTitle={'Orbito Chat Room'}
    />
  );
};

export default Orbito;
