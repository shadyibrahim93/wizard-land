import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Jigsaw',
  slug: 'puzzle-quest',
  mode: 'solo'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function PuzzleQuest() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Puzzle Quest'
        GameComponent={Game}
        gameClass='mq-puzzle-game'
        gameId='6'
        chatTitle='Jigsaw Chat Room'
      />
    </>
  );
}
