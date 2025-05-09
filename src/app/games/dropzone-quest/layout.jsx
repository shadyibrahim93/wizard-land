import { generateGameMetadata } from '../../../utils/metadata.js';

export const metadata = generateGameMetadata({
  name: 'Perfect Fit',
  slug: 'dropzone-quest',
  mode: 'solo'
});

import GameStart from '../../../components/gameFlow/gamestart.jsx';
import Game from './template.jsx';

export default function DropZoneQuestPage() {
  return (
    <>
      <head>{metadata}</head>
      <GameStart
        title='DropZone Quest'
        GameComponent={Game}
        gameClass='mq-dropzone-game'
        gameId='10'
        chatTitle='Dropzone Chat Room'
      />
    </>
  );
}
