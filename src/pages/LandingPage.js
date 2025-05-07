import React, { useState, useEffect } from 'react';
import { supabase } from '../apiService.js';
import Footer from '../components/Footer.js';
import SignUpModal from '../components/authModals/signUpModal.js';
import Button from '../components/Button.js';
/**
 * LandingPage component
 */
export default function LandingPage({
  launchDate = '06/01/2025',
  screenshots = [
    {
      src: '/assets/images/launch/1.png',
      alt: 'Home screen with game selection'
    },
    {
      src: '/assets/images/launch/2.png',
      alt: 'Gameplay: Tic Tac Toe Multiplayer'
    },
    {
      src: '/assets/images/launch/3.png',
      alt: 'Gameplay: Winning animation'
    },
    {
      src: '/assets/images/launch/4.png',
      alt: 'Gameplay: Restart game'
    },
    {
      src: '/assets/images/launch/5.png',
      alt: 'Gameplay: Connect4 Multiplayer'
    },
    {
      src: '/assets/images/launch/6.png',
      alt: 'Gameplay: Confirm room exist'
    },
    {
      src: '/assets/images/launch/7.png',
      alt: 'Home Screen showing leaderboard'
    },
    {
      src: '/assets/images/launch/8.png',
      alt: 'Shop: Purchase Board Pieces'
    },
    {
      src: '/assets/images/launch/9.png',
      alt: 'Shop: Purchase Board Themes'
    },
    {
      src: '/assets/images/launch/10.png',
      alt: 'Inventory: Board Pieces'
    },
    {
      src: '/assets/images/launch/11.png',
      alt: 'Gameplay: Room Creation and Joining'
    },
    {
      src: '/assets/images/launch/12.png',
      alt: 'Home Page: Mobile View'
    }
  ],
  facebookLink = 'https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
}) {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [activeGroup, setActiveGroup] = useState(0);
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
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Calculate groups of 4 screenshots
  const groups = [];
  for (let i = 0; i < screenshots.length; i += 4) {
    groups.push(screenshots.slice(i, i + 4));
  }
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
      {/* VideoGame Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            'name': `Wizard Land: The Magic Begins - June 1st, 2025`,
            'url': 'https://wizardland.net',
            'image': screenshots.map((s) => `https://wizardland.net${s.src}`),
            'author': {
              '@type': 'Organization',
              'name': 'Wizard Land'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land'
            },
            'datePublished': '2025-06-01',
            'description':
              'Wizard Land is an ad-free, online multiplayer board game world where players can challenge friends in magical games like Connect 4, Chess, and Tic Tac Toe.',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'All',
            'gamePlatform': [
              'Web',
              'Mobile',
              'Desktop',
              'IOS',
              'Android',
              'Tablet'
            ],
            'playMode': ['SinglePlayer', 'Multiplayer'],
            'numberOfPlayers': {
              '@type': 'QuantitativeValue',
              'minValue': 1,
              'maxValue': 2
            },
            'genre': [
              'Board Game',
              'Multiplayer',
              'SinglePlayer',
              'Online',
              'Competitive',
              'Fantasy',
              'Tic Tac Toe',
              'Connect 4',
              'Memory Game',
              'Matching Game',
              'Chess',
              'Checkers',
              'Orbito',
              'Puzzle',
              'Strategy',
              'Adventure',
              'Fantasy Adventure',
              'Casual'
            ]
          })
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': `Wizard Land: The Magic Begins - June 1st, 2025`,
            'url': typeof window !== 'undefined' ? window.location.href : '',
            'hasPart': [
              {
                '@type': 'WebPage',
                'name': 'Privacy Policy',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'Terms of Service',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'Contact Us',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'About Us',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'Login',
                'url': 'https://wizardland.net'
              }
            ]
          })
        }}
      />
      <div className='mq-landing-page'>
        <header className='wizard-header'>
          <div className='magic-overlay'></div>
          <h1 className='landing-page-title brand'>
            <span className='title-glitch'>Wizard Land</span>
          </h1>
          <h1 className='landing-page-title'>
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
              online board-game adventure awaits! ✨ Sign up before June 1st,
              2025, to receive exclusive in-game rewards and be the first to
              know about our launch! 🧙‍♂️
            </p>
            <Button
              text='Sign Up Early for a Special Reward!'
              onClick={() => setShowSignUpModal(true)}
            />
          </div>
        </section>
        <section className='screenshot-grid'>
          {groups.map((group, idx) => (
            <React.Fragment key={idx}>
              {idx === activeGroup && (
                <>
                  {group.map((shot, i) => {
                    const globalIdx = idx * 4 + i;
                    return (
                      <div
                        key={globalIdx}
                        className='screenshot-card'
                        onClick={() => openModal(globalIdx)}
                      >
                        <div className='frame-glow'>
                          <img
                            src={shot.src}
                            alt={shot.alt}
                            className='screenshot-thumb'
                            loading='lazy'
                          />
                        </div>
                        <div className='rune-overlay'>
                          <span>ᛞ</span>
                          <span>ᚦ</span>
                          <span>ᛟ</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </React.Fragment>
          ))}
        </section>
        <div className='carousel-dots'>
          {groups.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === activeGroup ? 'active' : ''}`}
              onClick={() => setActiveGroup(idx)}
            />
          ))}
        </div>
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
            target='_blank'
          >
            <span className='wand-icon'>⚡</span>
            Follow Our Magical Journey
          </a>
        </footer>
        <Footer />
      </div>
      <SignUpModal
        showSignUpModal={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
      />
    </>
  );
}
