import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Mystic Match',
  slug: 'match-quest',
  mode: 'solo'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function MatchQuestPage() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Matching Tales'
        GameComponent={Game}
        gameClass='mq-match-game'
        gameId='1'
        chatTitle='Matching Chat Room'
      />
    </>
  );
}
