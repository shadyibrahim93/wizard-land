import React, { useState, useEffect } from 'react';
import { supabase } from '../apiService.js';
/**
 * LandingPage component
 */
export default function LandingPage({
  launchDate = '06/01/2025',
  screenshots = [
    {
      src: '/assets/images/launch/1.png',
      alt: 'Gameplay: Character selecting tools'
    },
    { src: '/assets/images/launch/2.png', alt: 'Gameplay: First level puzzle' },
    {
      src: '/assets/images/launch/3.png',
      alt: 'Gameplay: Boss fight animation'
    },
    {
      src: '/assets/images/launch/4.png',
      alt: 'Gameplay: Boss fight animation'
    }
  ],
  buyMeACoffeeLink = '#',
  facebookLink = 'https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
}) {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const openModal = (idx) => setCurrentIdx(idx);
  const closeModal = () => setCurrentIdx(-1);
  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((i) => (i > 0 ? i - 1 : screenshots.length - 1));
  };
  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((i) => (i < screenshots.length - 1 ? i + 1 : 0));
  };
  const modalImage = currentIdx >= 0 ? screenshots[currentIdx] : null;
  const [interestedCount, setInterestedCount] = useState(0);

  const [countdownDays, setCountdownDays] = useState('');
  const [countdownHours, setCountdownHours] = useState('');
  const [countdownMins, setCountdownMins] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState('');

  useEffect(() => {
    const launch = new Date(launchDate);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = launch - now;

      if (diff <= 0) {
        setCountdownDays('Launching Tomorrow!');
        setCountdownHours(null);
        setCountdownMins(null);
        setCountdownSeconds(null);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdownDays(`${days}d`);
      setCountdownHours(`${hours}h`);
      setCountdownMins(`${minutes}m`);
      setCountdownSeconds(`${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  // Load initial count
  useEffect(() => {
    async function fetchCount() {
      const { data, error } = await supabase
        .from('launch')
        .select('interested')
        .single();
      if (error) {
        console.error('Error fetching interested count:', error);
      } else {
        setInterestedCount(data.interested);
      }
    }
    fetchCount();
  }, []);

  // RPC increment
  async function markInterested() {
    try {
      // 1) get IP address
      const res = await fetch('https://api.ipify.org?format=json');
      const { ip } = await res.json();

      // 2) call your new RPC with that IP
      const { data: newCount, error } = await supabase.rpc(
        'increment_interested_if_new',
        { ip_text: ip }
      );

      if (error) throw error;
      console.log('New interested count:', newCount);
      setInterestedCount(newCount);
    } catch (err) {
      console.error('Could not mark interest:', err);
    }
  }

  return (
    <>
      <div className='mq-landing-page'>
        <header className='wizard-header'>
          <div className='magic-overlay'></div>
          <h1 className='landing-page-title'>
            <span className='title-glitch'>Wizard Land</span>
            <span className='subtitle'> A Magical Journey Begins</span>
          </h1>
          <div className='countdown-timer-container'>
            <strong className='countdown-timer'>{countdownDays}</strong>
            {countdownHours && (
              <strong className='countdown-timer'>{countdownHours}</strong>
            )}
            {countdownMins && (
              <strong className='countdown-timer'>{countdownMins}</strong>
            )}
            {countdownSeconds && (
              <strong className='countdown-timer'>{countdownSeconds}</strong>
            )}
          </div>
          <div className='interested-button-container'>
            <button
              className='mq-btn'
              onClick={markInterested}
            >
              Count Me In <span className='plus-icon'>+</span>
            </button>
            <span className='interested-count'>{interestedCount} onboard</span>
          </div>
          <div className='launch-date-container'>
            <div className='crystal-divider'></div>
            <p className='landing-page-launch-date'>
              <strong>{launchDate}</strong>
            </p>
            <div className='crystal-divider flipped'></div>
          </div>
        </header>
        <section className='landing-page-intro'>
          <div className='parchment-effect'>
            <p>
              🧙 Greetings, brave mage! Wizard Land opens soon, an ad-free,
              online multiplayer realm where you can challenge friends and foes
              alike in classic board games like Connect 4, Tic Tac Toe, Chess,
              Orbito, and Checkers, all set against glittering forests and
              frosty isles with magical soundscapes.
            </p>
            <p>
              🔮 Climb our enchanted leaderboards for glory and rare artifacts.
              Ready your spells, gather your allies, and circle{' '}
              <strong>{launchDate}</strong> - your destiny in the ultimate
              online board-game adventure awaits! ✨
            </p>
          </div>
        </section>
        <section className='screenshot-grid'>
          {screenshots.map((shot, idx) => (
            <div
              key={idx}
              className='screenshot-card'
              onClick={() => openModal(idx)}
            >
              <div className='frame-glow'>
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className='screenshot-thumb'
                />
              </div>
              <div className='rune-overlay'>
                <span>ᛞ</span>
                <span>ᚦ</span>
                <span>ᛟ</span>
              </div>
            </div>
          ))}
        </section>
        {/* Modal remains structurally same with enhanced styling */}
        {modalImage && (
          <div
            className='modal-overlay'
            onClick={closeModal}
          >
            <div
              className='modal-content'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className='modal-arrow left'
                onClick={showPrev}
              >
                〈
              </button>
              <div className='portal-effect'>
                <img
                  src={modalImage.src}
                  alt={modalImage.alt}
                  className='modal-image'
                />
              </div>
              <button
                className='modal-arrow right'
                onClick={showNext}
              >
                〉
              </button>
              <button
                onClick={closeModal}
                className='modal-close'
              >
                ⨯
              </button>
            </div>
          </div>
        )}
        <footer className='landing-page-footer'>
          <a
            href={facebookLink}
            className='landing-page-button'
          >
            <span className='wand-icon'>⚡</span>
            Follow Our Magical Journey
          </a>
        </footer>
      </div>
    </>
  );
}
