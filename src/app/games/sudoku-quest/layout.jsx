import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Sudoku',
  slug: 'sudoku-quest',
  mode: 'solo'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function SuDokuQuest() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Sudoku Quest'
        GameComponent={Game}
        gameClass='mq-sudoku-game'
        gameId='8'
        chatTitle='Sudoku Chat Room'
      />
    </>
  );
}
