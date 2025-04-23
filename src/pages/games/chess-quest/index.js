import GameStart from '../../gameFlow/gamestart';
import Game from './template';

const ChessQuest = () => {
  return (
    <GameStart
      title='Chess Quest'
      GameComponent={Game}
      gameClass={'mq-chess-game'}
      gameId='14'
      chatTitle={'Chess Chat Room'}
    />
  );
};

export default ChessQuest;
