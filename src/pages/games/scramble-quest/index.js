import GameStart from '../../gamestart';
import Game from './template';

const WordScrambleGame = () => {
  return (
    <GameStart
      title='Scramble Quest'
      GameComponent={Game}
      gameClass={'mq-scramble-game'}
    />
  );
};

export default WordScrambleGame;
