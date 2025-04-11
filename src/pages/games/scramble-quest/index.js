import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const WordScrambleGame = () => {
  return (
    <GameStart
      title='Scramble Quest'
      GameComponent={Game}
      gameClass={'mq-scramble-game'}
      gameChatRoomId='7'
      chatTitle={'Scramble Chat Room'}
    />
  );
};

export default WordScrambleGame;
