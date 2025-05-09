import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Personal Jigsaw',
  slug: 'personal-puzzle-quest',
  mode: 'solo'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function PersonalPuzzleQuest() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Personal Puzzle Quest'
        GameComponent={Game}
        gameClass='mq-puzzle-game'
        gameId='5'
        chatTitle='Personal Jigsaw Chat Room'
      />
    </>
  );
}
