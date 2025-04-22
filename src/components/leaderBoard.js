import { useEffect, useState } from 'react';
import { supabase } from '../apiService';

const fetchAllUserProgressGroupedByGame = async () => {
  const { data, error } = await supabase.from('user_progress').select(`
      user_id,
      game_id,
      wins,
      losses,
      profiles ( full_name ),
      games ( game_name )
    `);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return data;
};

const gameEmojis = {
  4: '⚪',
  3: '🙾',
  12: '↺',
  9: '🎲'
};

const LeaderBoard = () => {
  const [groupedProgress, setGroupedProgress] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await fetchAllUserProgressGroupedByGame();

      const grouped = rawData.reduce((acc, item) => {
        const gameId = item.game_id;
        const gameName = item.games?.game_name || 'Unknown Game';
        const emoji = gameEmojis[gameId] || '';

        if (!acc[gameId]) {
          acc[gameId] = {
            gameId,
            gameName,
            emoji,
            players: []
          };
        }

        acc[gameId].players.push(item);
        return acc;
      }, {});

      Object.values(grouped).forEach((group) => {
        group.players.sort((a, b) => b.wins - a.wins);
        group.players = group.players.slice(0, 10); // limit to top 10
      });

      setGroupedProgress(grouped);
    };

    fetchData();
  }, []);

  return (
    <section className='mq-leaderboard-section'>
      <h2 className='mq-section-title mq-section-title--multiplayer'>
        🏆 Daily Leaderboard
      </h2>
      <div className='mq-leaderboard-container'>
        {Object.entries(groupedProgress).map(
          ([gameId, { gameName, players, emoji }]) => (
            <div
              key={gameId}
              className='mq-leaderboard-game'
            >
              <h3 className='mq-leaderboard-game-title'>
                {gameName}
                <span>{emoji}</span>
              </h3>
              <hr></hr>
              {players.map((player, index) => (
                <div
                  key={player.user_id}
                  className='mq-leaderboard-player-container'
                >
                  <div>
                    <p className='mq-leaderboard-player'>
                      {player.profiles?.full_name || 'Unknown'}
                    </p>
                  </div>
                  <span className='mq-leaderboard-player-stats'>
                    <span className='mq-leaderboard-player-wins'>
                      {player.wins}
                    </span>
                    /
                    <span className='mq-leaderboard-player-losses'>
                      {player.losses}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default LeaderBoard;
