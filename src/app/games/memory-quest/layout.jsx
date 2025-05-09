import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Memory',
  slug: 'memory-quest',
  mode: 'solo'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function MemoryQuestPage() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Memory Quest'
        GameComponent={Game}
        gameClass='mq-memory-game'
        gameId='11'
        chatTitle='Memory Chat Room'
      />
    </>
  );
}
