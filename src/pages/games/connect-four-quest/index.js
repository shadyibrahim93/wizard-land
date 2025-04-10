import GameStart from '../../gamestart';
import Game from './template';

const TicTacToe = () => {
  return (
    <GameStart
      title='Connect 4 Quest'
      GameComponent={Game}
      gameClass={'mq-connect-four-game'}
      gameChatRoomId='4'
      chatTitle={'Connect4 Chat Room'}
    />
  );
};

export default TicTacToe;
