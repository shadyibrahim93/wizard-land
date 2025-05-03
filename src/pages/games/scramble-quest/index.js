import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const WordScrambleGame = () => {
  return (
    <GameStart
      title='Scramble Saga'
      GameComponent={Game}
      gameClass={'mq-scramble-game'}
      gameId='7'
      chatTitle={'Scramble Chat Room'}
    />
  );
};

export default WordScrambleGame;
