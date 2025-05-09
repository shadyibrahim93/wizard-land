import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Orbito',
  slug: 'orbito-quest',
  mode: 'multiplayer'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function OrbitoQuestPage() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Orbito Adventure'
        GameComponent={Game}
        gameClass='mq-orbito-game'
        gameId='12'
        chatTitle='Orbito Chat Room'
      />
    </>
  );
}
