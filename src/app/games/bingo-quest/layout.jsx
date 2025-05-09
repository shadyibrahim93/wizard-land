import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

import { generateGameMetadata } from '../../../utils/metadata.js';
export const metadata = generateGameMetadata({
  name: 'Bingo',
  slug: 'bingo-quest',
  mode: 'solo'
});

export default function LayOut({ children }) {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Bingo Quest'
        GameComponent={Game}
        gameClass='mq-bingo-game'
        gameId='2'
        chatTitle='Bingo Chat Room'
      />
    </>
  );
}
