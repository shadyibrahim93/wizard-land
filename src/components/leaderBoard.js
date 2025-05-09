import { useEffect, useState } from 'react';
import { supabase } from '../apiService';
import firstPlaceMedal from '../assets/images/elements/rank/firstplace.png';
import secondPlaceMedal from '../assets/images/elements/rank/secondplace.png';
import thirdPlaceMedal from '../assets/images/elements/rank/thirdplace.png';
import defaultPlayerImage from '../assets/images/elements/rank/defaultplace.png';

const fetchAllUserProgressGroupedByGame = async (timeFrame = 'daily') => {
  // Determine the correct table based on time frame
  const tableName = {
    daily: 'user_progress',
    weekly: 'user_weekly_progress',
    monthly: 'user_monthly_progress'
  }[timeFrame];

  const { data, error } = await supabase.from(tableName).select(`
      user_id,
      game_id,
      wins,
      losses,
      created_at,
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
  3: '🧠',
  12: '🕹️',
  9: '🎲',
  14: '♖'
};

const LeaderBoard = () => {
  const [groupedProgress, setGroupedProgress] = useState({});
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [isLoading, setIsLoading] = useState(false);

  const medalImages = [
    firstPlaceMedal, // 1st place
    secondPlaceMedal, // 2nd place
    thirdPlaceMedal // 3rd place
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const rawData = await fetchAllUserProgressGroupedByGame(timeFrame);

      const grouped = rawData.reduce((acc, item) => {
        const gameId = item.game_id;
        const gameName = (
          item.games?.game_name.replace(/Quest/gi, '') || 'Unknown Game'
        ).trim();
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
      setIsLoading(false);
    };

    fetchData();
  }, [timeFrame]);

  const getTimeFrameTitle = () => {
    switch (timeFrame) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return 'Leaderboard';
    }
  };

  return (
    <section className='mq-leaderboard-section'>
      <h2 className='mq-section-title mq-section-title--multiplayer'>
        🏆 {getTimeFrameTitle()} Leaderboard
      </h2>

      {/* Time Frame Buttons */}
      <div className='mq-leaderboard-timeframes'>
        <button
          className={`mq-leaderboard-timeframe-btn ${
            timeFrame === 'daily' ? 'active' : ''
          }`}
          onClick={() => setTimeFrame('daily')}
        >
          Daily
        </button>
        <button
          className={`mq-leaderboard-timeframe-btn ${
            timeFrame === 'weekly' ? 'active' : ''
          }`}
          onClick={() => setTimeFrame('weekly')}
        >
          Weekly
        </button>
        <button
          className={`mq-leaderboard-timeframe-btn ${
            timeFrame === 'monthly' ? 'active' : ''
          }`}
          onClick={() => setTimeFrame('monthly')}
        >
          Monthly
        </button>
      </div>

      {isLoading ? (
        <div className='mq-loading'>Loading...</div>
      ) : (
        <div className='mq-leaderboard-container'>
          {groupedProgress && Object.keys(groupedProgress).length === 0 && (
            <h3>No data available... Start playing!</h3>
          )}
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
                    <div className='mq-leaderboard-player-info'>
                      <span className='mq-leaderboard-player-rank'>
                        {index + 1}
                      </span>
                      <img
                        src={
                          index < 3 ? medalImages[index] : defaultPlayerImage
                        }
                        alt={
                          index < 3 ? `${index + 1}st place medal` : 'Player'
                        }
                        className='mq-leaderboard-medal'
                        loading='lazy'
                      />
                      <p className='mq-leaderboard-player'>
                        {player.profiles?.full_name || 'Unknown'}
                      </p>
                    </div>
                    <span className='mq-leaderboard-player-stats'>
                      <span
                        className={`${
                          player.wins > 0 ? 'mq-leaderboard-player-wins' : ''
                        }`}
                      >
                        {player.wins}
                      </span>
                      /
                      <span
                        className={`${
                          player.losses > 0
                            ? 'mq-leaderboard-player-losses'
                            : ''
                        }`}
                      >
                        {player.losses}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default LeaderBoard;
