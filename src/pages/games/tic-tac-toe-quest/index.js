import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const TicTacToe = () => {
  return (
    <GameStart
      title='Tic Tac Toe Quest'
      GameComponent={Game}
      gameClass={'mq-tic-tac-toe-game'}
      gameChatRoomId='9'
      chatTitle={'Tic Tac Toe Chat Room'}
    />
  );
};

export default TicTacToe;
