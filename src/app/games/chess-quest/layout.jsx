import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Chess',
  slug: 'chess-quest',
  mode: 'multiplayer'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function ChessQuest() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Chess Adventure'
        GameComponent={Game}
        gameClass='mq-chess-game'
        gameId='14'
        chatTitle='Chess Chat Room'
      />
    </>
  );
}
