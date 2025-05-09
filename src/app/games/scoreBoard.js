'use client';
import React, { useEffect } from 'react';
import Button from '../../components/Button';

const ScoreBoard = ({ gameName, setScoreBoard, scoreBoard }) => {
  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem(gameName)) || [];
    setScoreBoard(storedScores);
  }, [gameName, setScoreBoard]);

  const resetScores = () => {
    const confirmation = window.confirm(
      `Are you sure you want to erase the scores for ${gameName}?`
    );

    if (confirmation) {
      localStorage.removeItem(gameName);
      setScoreBoard([]);
    }
  };

  return (
    <div className='mq-score-wrapper'>
      <div>
        <div className='mq-score-header'>
          <p className='mq-label'>Top Scores</p>
        </div>
        <div className='mq-score-title-container'>
          <div className='mq-score-title'>SCORE</div>
          <div className='mq-score-title'>TIME</div>
        </div>

        <div className='mq-score-details'>
          {scoreBoard &&
            scoreBoard
              .sort((a, b) => b.score - a.score || a.time.localeCompare(b.time))
              .slice(0, 10)
              .map((entry, index) => (
                <div
                  key={index}
                  className='mq-score-entry'
                >
                  <span className='mq-score'>{entry.score}</span>
                  <span className='mq-time'>{entry.time}</span>
                </div>
              ))}
        </div>
      </div>
      <Button
        text='Reset Scores'
        onClick={resetScores}
      />
    </div>
  );
};

export default ScoreBoard;
