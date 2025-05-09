import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Connect 4',
  slug: 'connect-four-quest',
  mode: 'multiplayer'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function Connect4Quest() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Connect 4 Adventure'
        GameComponent={Game}
        gameClass='mq-connect-four-game'
        gameId='4'
        chatTitle='Connect4 Chat Room'
      />
    </>
  );
}
