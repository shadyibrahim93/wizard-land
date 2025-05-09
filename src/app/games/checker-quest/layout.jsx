import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Checker',
  slug: 'checker-quest',
  mode: 'multiplayer'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function CheckerQuest() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='Checker Adventure'
        GameComponent={Game}
        gameClass='mq-checker-game'
        gameId='3'
        chatTitle='Checker Chat Room'
      />
    </>
  );
}
