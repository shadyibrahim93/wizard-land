import React, { useState, useEffect } from 'react';
import { supabase } from '../apiService.js';
import Footer from '../components/Footer.jsx';
import SignUpModal from '../components/authModals/signUpModal.js';
import Button from '../components/Button.js';
import Head from 'next/head';
import Script from 'next/script'; // Import Script

// Static Schema Definitions (WIZARD_LAND_ORGANIZATION_SCHEMA,
// UPCOMING_VIDEO_GAME_ENTITY_SCHEMA, LANDING_PAGE_SCHEMA,
// LAUNCH_EVENT_SCHEMA defined above this component)

export default function LandingPage({
  launchDate = '2025-06-01T00:00:00-04:00', // Consider passing date in ISO 8601 format if possible
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
    src: `/assets/images/launch/${i + 1}.webp`, // Ensure this path is correct and matches images in schema
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
  // Create a Date object from the ISO 8601 string
  const launchDateObj = new Date(launchDate);

  // Get the month, day, and year
  const month = launchDateObj.getMonth() + 1; // getMonth() is 0-indexed, so add 1
  const day = launchDateObj.getDate();
  const year = launchDateObj.getFullYear();

  // Format the month and day to ensure two digits (e.g., "06" instead of "6")
  const formattedMonth = month < 10 ? '0' + month : month;
  const formattedDay = day < 10 ? '0' + day : day;

  // Create the MM/DD/YYYY string
  const launchDateDisplay = `${formattedMonth}/${formattedDay}/${year}`;

  // Countdown timer
  useEffect(() => {
    const launch = new Date(launchDate);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = launch - now;

      if (diff <= 0) {
        setCountdownDays('Launching Soon!'); // Adjusted text
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
        <title>Wizard Land | The Magic Begins - June 1st, 2025</title>{' '}
        {/* Keep this title for the landing page */}
        <meta
          name='description'
          content='Get ready for Wizard Land, an ad-free online multiplayer board game platform launching on June 1st, 2025! Sign up for early access and challenge friends in magical board games.' // Updated description
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
          content='Get ready for Wizard Land, an ad-free online multiplayer board game platform launching on June 1st, 2025! Sign up for early access and challenge friends in magical board games.' // Updated OG description
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
          content='Get ready for Wizard Land, an ad-free online multiplayer board game platform launching on June 1st, 2025! Sign up for early access and challenge friends in magical board games.' // Updated Twitter description
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
              <strong>{launchDateDisplay}</strong>
            </p>
            <div className='crystal-divider flipped'></div>
          </div>
        </header>

        <section className='landing-page-intro'>
          <div className='parchment-effect'>
            <p>
              🧙 Prepare your spells, brave mage! The portals to Wizard Land
              swing open on <strong>June 1st, 2025</strong>! This isn't just a
              game; it's an ad-free, online multiplayer realm where classic
              board games are infused with magic. Be among the first to step
              through the portal on launch day, and{' '}
              <strong>
                sign up early to receive the exclusive Magical Broom Board
                Piece!
              </strong>{' '}
              Challenge friends, outwit foes, and claim your place (and your
              magical broom!) in this new world.
            </p>
            <Button
              text='Sign Up Early for Your Magical Broom!'
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
                〈
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
                〉
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
        <script
          id='landing-page-schema' // Unique ID for this script
          type='application/ld+json'
          strategy='beforeInteractive' // Or "afterInteractive". Test which works best.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LANDING_PAGE_SCHEMA) // Use the combined landing page schema
          }}
        />

        <script
          id='launch-event-schema' // Unique ID for this script
          type='application/ld+json'
          strategy='beforeInteractive' // Or "afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LAUNCH_EVENT_SCHEMA) // Include the event schema
          }}
        />
        <Footer />
      </div>

      <SignUpModal
        showSignUpModal={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        successMessage='Signup successful! Enjoy your magical broom!'
      />
    </>
  );
}

// Static generation with schema validation
export async function getStaticProps() {
  // It's good practice to validate schemas at build time if possible
  try {
    // Using the objects here to ensure they are defined when getStaticProps runs
    JSON.stringify(LANDING_PAGE_SCHEMA);
    // If including the event schema, uncomment the line below:
    // JSON.stringify(LAUNCH_EVENT_SCHEMA);
  } catch (e) {
    console.error('Schema validation error:', e);
  }

  return {
    props: {
      launchDate: '2025-06-01T00:00:00-04:00', // Consider passing date in ISO 8601 format if possible
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

const WIZARD_LAND_ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Wizard Land',
  'url': 'https://wizardland.net',
  'logo': {
    '@type': 'ImageObject',
    'url': 'https://wizardland.net/assets/images/logo.png'
  },
  'sameAs': [
    'https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/',
    'https://discord.com/channels/1369090826109452368/1369092092579680276',
    'https://buymeacoffee.com/wizardland'
  ]
};

const UPCOMING_VIDEO_GAME_ENTITY_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['VideoGame', 'WebApplication'],
  'name': 'Wizard Land',
  'url': 'https://wizardland.net',
  'description':
    'Wizard Land is an ad-free, online multiplayer board game world where players can challenge friends in magical games like Connect 4, Chess, and Tic Tac Toe. Launching June 1st, 2025.', // Describe the upcoming platform
  'image': Array.from(
    { length: 12 },
    (_, i) => `https://wizardland.net/assets/images/launch/${i + 1}.png`
  ),
  'applicationCategory': 'GameApplication',
  'operatingSystem': 'Any',
  'browserRequirements': 'Requires a modern web browser with HTML5 support',
  'gamePlatform': ['http://schema.org/BrowserApplication'],
  'playMode': [
    'https://schema.org/SinglePlayer',
    'https://schema.org/MultiPlayer'
  ],
  'numberOfPlayers': {
    '@type': 'QuantitativeValue',
    'minValue': 1,
    'maxValue': 2
  },
  'genre': [
    'Board Game',
    'Multiplayer Game',
    'Single Player Game',
    'Online Game',
    'Competitive Game',
    'Fantasy Game',
    'Puzzle Game',
    'Strategy Game',
    'Casual Game',
    'Memory Game',
    'Word Game',
    'Logic Game',
    'Classic Game'
  ],
  'author': WIZARD_LAND_ORGANIZATION_SCHEMA,
  'publisher': WIZARD_LAND_ORGANIZATION_SCHEMA,
  'datePublished': '2025-06-01',
  'creativeWorkStatus': 'https://schema.org/ComingSoon'
};

const LANDING_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['WebPage', 'AboutPage'],
  'name': 'Wizard Land | The Magic Begins - June 1st, 2025',
  'url': 'https://wizardland.net',
  'description':
    'Get ready for Wizard Land, an ad-free online multiplayer board game platform launching on June 1st, 2025! Sign up for early access and challenge friends in magical board games.', // Description for this specific landing page
  'mainEntity': UPCOMING_VIDEO_GAME_ENTITY_SCHEMA,
  'publisher': WIZARD_LAND_ORGANIZATION_SCHEMA,
  'keywords': [
    'Wizard Land launch',
    'online board games coming soon',
    'multiplayer board games 2025',
    'ad-free online games',
    'new online games',
    'game launch June 2025',
    'coming soon games',
    'online gaming platform',
    'board games with friends online',
    'sign up early access'
  ]
};

const LAUNCH_EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  'name': 'Wizard Land Grand Launch',
  'startDate': '2025-06-01T00:00:00-04:00',
  'location': {
    '@type': 'VirtualLocation',
    'url': 'https://wizardland.net'
  },
  'description':
    'Join us for the official launch of Wizard Land, an exciting new ad-free online multiplayer board game platform!',
  'organizer': WIZARD_LAND_ORGANIZATION_SCHEMA,
  'eventStatus': 'https://schema.org/EventScheduled',
  'performer': WIZARD_LAND_ORGANIZATION_SCHEMA,
  'image': UPCOMING_VIDEO_GAME_ENTITY_SCHEMA.image[0]
};
