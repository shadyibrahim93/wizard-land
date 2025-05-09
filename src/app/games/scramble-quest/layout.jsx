import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Scramble',
  slug: 'scramble-quest',
  mode: 'solo'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function WordScrambleGame() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Scramble Saga'
        GameComponent={Game}
        gameClass='mq-scramble-game'
        gameId='7'
        chatTitle='Scramble Chat Room'
      />
    </>
  );
}
