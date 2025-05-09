import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Tic Tac Toe',
  slug: 'tic-tac-toe-quest',
  mode: 'multiplayer'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function TicTacToeQuest() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Tic Tac Toe Adventure'
        GameComponent={Game}
        gameClass={'mq-tic-tac-toe-game'}
        gameId='9'
        chatTitle={'Tic Tac Toe Chat Room'}
      />
    </>
  );
}
