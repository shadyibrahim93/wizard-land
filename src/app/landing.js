import React, { useState, useEffect } from 'react';
import { supabase } from '../apiService.js';
import Footer from '../components/Footer.jsx';
import SignUpModal from '../components/authModals/signUpModal.js';
import Button from '../components/Button.js';
import Head from 'next/head';

// Static Schema Definitions (moved outside component)
const VIDEO_GAME_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Wizard Land | The Magic Begins - June 1st, 2025',
  url: 'https://wizardland.net',
  image: Array.from(
    { length: 12 },
    (_, i) => `https://wizardland.net/assets/images/launch/${i + 1}.png`
  ),
  author: { '@type': 'Organization', name: 'Wizard Land' },
  publisher: { '@type': 'Organization', name: 'Wizard Land' },
  datePublished: '2025-06-01',
  description:
    'Wizard Land is an ad-free, online multiplayer board game world where players can challenge friends in magical games like Connect 4, Chess, and Tic Tac Toe.',
  applicationCategory: 'GameApplication',
  operatingSystem: 'All',
  gamePlatform: ['Web', 'Mobile', 'Desktop', 'iOS', 'Android', 'Tablet'],
  playMode: ['SinglePlayer', 'Multiplayer'],
  numberOfPlayers: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 2
  },
  genre: [
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
};

const WEB_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Wizard Land | The Magic Begins - June 1st, 2025',
  url: 'https://wizardland.net',
  hasPart: [
    {
      '@type': 'WebPage',
      name: 'Privacy Policy',
      url: 'https://wizardland.net/privacy'
    },
    {
      '@type': 'WebPage',
      name: 'Terms of Service',
      url: 'https://wizardland.net/terms'
    },
    {
      '@type': 'WebPage',
      name: 'Contact Us',
      url: 'https://wizardland.net/contact'
    },
    {
      '@type': 'WebPage',
      name: 'About Us',
      url: 'https://wizardland.net/about'
    },
    { '@type': 'WebPage', name: 'Login', url: 'https://wizardland.net/login' }
  ]
};

export default function LandingPage({
  launchDate = '06/01/2025',
  screenshotCount = 12,
  screenshotAlts = [
    'Home screen with game selection',
    'Gameplay: Tic Tac Toe Multiplayer',
    'Gameplay: Winning animation',
    'Gameplay: Restart game',
    'Gameplay: Connect4 Multiplayer',
    'Gameplay: Confirm room exist',
    'Home Screen showing leaderboard',
    'Shop: Purchase Board Pieces',
    'Shop: Purchase Board Themes',
    'Inventory: Board Pieces',
    'Gameplay: Room Creation and Joining',
    'Home Page: Mobile View'
  ],
  facebookLink = 'https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
}) {
  // State management
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [activeGroup, setActiveGroup] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [countdownDays, setCountdownDays] = useState('');
  const [countdownHours, setCountdownHours] = useState('');
  const [countdownMins, setCountdownMins] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState('');
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Screenshot data
  const screenshots = Array.from({ length: screenshotCount }, (_, i) => ({
    src: `/assets/images/launch/${i + 1}.webp`,
    alt: screenshotAlts[i] ?? `Launch screenshot ${i + 1}`
  }));

  // Group screenshots
  const groups = [];
  for (let i = 0; i < screenshots.length; i += 4) {
    groups.push(screenshots.slice(i, i + 4));
  }

  // Image modal control
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

  // Countdown timer
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

  // Fetch initial interest count
  useEffect(() => {
    async function fetchCount() {
      const { data, error } = await supabase
        .from('launch')
        .select('interested')
        .single();
      if (!error && data) {
        setInterestedCount(data.interested);
      }
    }
    fetchCount();
  }, []);

  // Handle interest submission
  async function markInterested() {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const { ip } = await res.json();
      const { data: newCount, error } = await supabase.rpc(
        'increment_interested_if_new',
        { ip_text: ip }
      );
      if (!error) setInterestedCount(newCount);
    } catch (err) {
      console.error('Error marking interest:', err);
    }
  }

  return (
    <>
      <Head>
        <title>Wizard Land | The Magic Begins - June 1st, 2025</title>
        <meta
          name='description'
          content='Online multiplayer gaming platform offering a captivating collection of board games'
        />
        <meta
          property='og:type'
          content='website'
        />
        <meta
          property='og:title'
          content='Wizard Land | The Magic Begins - June 1st, 2025'
        />
        <meta
          property='og:description'
          content='Online multiplayer platform offering board games'
        />
        <meta
          name='twitter:card'
          content='summary_large_image'
        />
        <meta
          name='twitter:title'
          content='Wizard Land | The Magic Begins - June 1st, 2025'
        />
        <meta
          name='twitter:description'
          content='Online multiplayer platform offering board games'
        />

        {/* Structured Data */}
        <script
          id='videogame-schema'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(VIDEO_GAME_SCHEMA)
          }}
        />
        <script
          id='webpage-schema'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_PAGE_SCHEMA) }}
        />
      </Head>

      <div className='mq-landing-page'>
        <header className='wizard-header'>
          <div className='magic-overlay'></div>
          <h1 className='landing-page-title brand'>
            <span className='title-glitch'>Wizard Land</span>
          </h1>
          <h1 className='landing-page-title'>
            <span className='subtitle'>A Magical Journey Begins</span>
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
              alike in classic board games...
            </p>
            <Button
              text='Sign Up Early for a Special Reward!'
              onClick={() => setShowSignUpModal(true)}
            />
          </div>
        </section>

        <section className='screenshot-grid'>
          {groups[activeGroup].map((shot, i) => {
            const globalIdx = activeGroup * 4 + i;
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
            rel='noopener noreferrer'
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

// Static generation with schema validation
export async function getStaticProps() {
  // Validate schemas at build time
  try {
    JSON.stringify(VIDEO_GAME_SCHEMA);
    JSON.stringify(WEB_PAGE_SCHEMA);
  } catch (e) {
    console.error('Schema validation error:', e);
  }

  return {
    props: {
      launchDate: '06/01/2025',
      screenshotCount: 12,
      screenshotAlts: [
        'Home screen with game selection',
        'Gameplay: Tic Tac Toe Multiplayer',
        'Gameplay: Winning animation',
        'Gameplay: Restart game',
        'Gameplay: Connect4 Multiplayer',
        'Gameplay: Confirm room exist',
        'Home Screen showing leaderboard',
        'Shop: Purchase Board Pieces',
        'Shop: Purchase Board Themes',
        'Inventory: Board Pieces',
        'Gameplay: Room Creation and Joining',
        'Home Page: Mobile View'
      ]
    }
  };
}
