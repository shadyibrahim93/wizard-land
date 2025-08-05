import { UserProvider, useUser } from '../context/UserContext.js';
import '../styles/sass/main.scss';
import Script from 'next/script';
import { generateHomeMetadata } from '../utils/metadata.js';
import ThemeInitializer from '../components/ThemeInitializer.jsx';
import AudioManager from '../components/AudioManager.jsx';
import { ToastContainer } from 'react-toastify';

export const metadata = generateHomeMetadata({
  name: 'Play Ad-Free Multiplayer Family Board Games Today'
});

export default function RootLayout({ children }) {
  const homePageSchemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Website', 'CollectionPage'],
    'name': 'Wizard Land - Play Classic Board Games Online',
    'url': 'https://shadyibrahim93.github.io/wizard-land',
    'description':
      'Discover a world of online board games! Enjoy classic puzzle games and more, including Tic Tac Toe, Connect 4, Chess, and Checkers, directly on your mobile device. Play with friends and family globally for an engaging multiplayer gaming adventure.',
    'keywords': [
      'online board games',
      'multiplayer board games',
      'ad-free games',
      'classic board games online',
      'play board games with friends',
      'free online games',
      'Wizard Land',
      'Chess online',
      'Checkers online',
      'Orbito online',
      'Connect 4 online',
      'Tic Tac Toe online',
      'online puzzle games',
      'online memory games'
    ],
    'publisher': {
      '@type': 'Organization',
      'name': 'Wizard Land',
      'url': 'https://shadyibrahim93.github.io/wizard-land',
      'logo': {
        '@type': 'ImageObject',
        'url':
          'https://shadyibrahim93.github.io/wizard-land/assets/images/logo.png'
      },
      'sameAs': [
        'https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/',
        'https://www.instagram.com/wizardland_game/',
        'https://x.com/WizardLandGame',
        'https://discord.com/channels/1369090826109452368/1369092092579680276',
        'https://buymeacoffee.com/wizardland'
      ]
    },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Bingo',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/bingo-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/bingo.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Board Game',
              'Single Player Game',
              'Casual Game',
              'Family Game'
            ],
            'description': 'Play the online game Bingo on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Orbito',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/orbito-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/orbito.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/MultiPlayer',
            'genre': [
              'Board Game',
              'Multiplayer Game',
              'Strategy Game',
              'Online Game',
              'Social Game',
              'Competitive Game',
              'Family Game'
            ],
            'description': 'Play the online game Orbito on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Chess',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/chess-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/chess.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/MultiPlayer',
            'genre': [
              'Board Game',
              'Multiplayer Game',
              'Strategy Game',
              'Classic Game',
              'Online Game',
              'Social Game',
              'Competitive Game',
              'Family Game'
            ],
            'description': 'Play the online game Chess on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Connect 4',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/connect-four-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/connect_four.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/MultiPlayer',
            'genre': [
              'Board Game',
              'Multiplayer Game',
              'Casual Game',
              'Online Game',
              'Social Game',
              'Competitive Game',
              'Family Game'
            ],
            'description': 'Play the online game Connect 4 on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 5,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Tic Tac Toe',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/tic-tac-toe-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/tictactoe.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/MultiPlayer',
            'genre': [
              'Board Game',
              'Multiplayer Game',
              'Casual Game',
              'Classic Game',
              'Online Game',
              'Social Game',
              'Competitive Game',
              'Family Game'
            ],
            'description': 'Play the online game Tic Tac Toe on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 6,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Checkers',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/checker-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/checkers.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/MultiPlayer',
            'genre': [
              'Board Game',
              'Multiplayer Game',
              'Strategy Game',
              'Classic Game',
              'Online Game',
              'Social Game',
              'Competitive Game',
              'Family Game'
            ],
            'description': 'Play the online game Checkers on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 7,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Scrambled',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/scramble-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/scramble.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Puzzle Game',
              'Single Player Game',
              'Word Game',
              'Family Game'
            ],
            'description': 'Play the online game Scrambled on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 8,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Sudoku',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/sudoku-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/sudoku.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Puzzle Game',
              'Single Player Game',
              'Logic Game',
              'Family Game'
            ],
            'description': 'Play the online game Sudoku on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 9,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Jigsaw',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/puzzle-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/jigsaw.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Puzzle Game',
              'Single Player Game',
              'Casual Game',
              'Family Game'
            ],
            'description': 'Play the online game Jigsaw on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 10,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Personal Jigsaw',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/personal-puzzle-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/personal_jigsaw.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Puzzle Game',
              'Single Player Game',
              'Casual Game',
              'Family Game'
            ],
            'description':
              'Play the online game Personal Jigsaw on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 11,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Pair Pursuit',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/match-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/matching.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Puzzle Game',
              'Single Player Game',
              'Memory Game',
              'Family Game'
            ],
            'description': 'Play the online game Pair Pursuit on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 12,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Brain Vault',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/memory-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/memory.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Puzzle Game',
              'Single Player Game',
              'Memory Game',
              'Family Game'
            ],
            'description': 'Play the online game Brain Vault on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 13,
          'item': {
            '@type': ['VideoGame', 'WebApplication'],
            'name': 'Perfect Fit',
            'url':
              'https://shadyibrahim93.github.io/wizard-land/games/dropzone-quest',
            'image':
              'https://shadyibrahim93.github.io/wizard-land/assets/images/games/dropzone.jpg',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements':
              'Requires a modern web browser with HTML5 support',
            'playMode': 'https://schema.org/SinglePlayer',
            'genre': [
              'Puzzle Game',
              'Single Player Game',
              'Casual Game',
              'Family Game'
            ],
            'description': 'Play the online game Perfect Fit on Wizard Land.',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://shadyibrahim93.github.io/wizard-land'
            }
          }
        }
      ]
    }
  };

  return (
    <html
      lang='en'
      data-theme='cartoonia'
    >
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homePageSchemaJsonLd)
          }}
          strategy='beforeInteractive'
        />

        {metadata}

        <meta
          name='yandex-verification'
          content='b2322af06ef76ab8'
        />

        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-TWQ14MBMGM'
          strategy='afterInteractive'
        />
        <Script
          id='google-analytics'
          strategy='afterInteractive'
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TWQ14MBMGM');
          `}
        </Script>
        <Script
          id='twitter-base'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){
                e.twq||(s=e.twq=function(){
                  s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                },
                s.version='1.1',
                s.queue=[],
                u=t.createElement(n),
                u.async=!0,
                u.src='https://static.ads-twitter.com/uwt.js',
                a=t.getElementsByTagName(n)[0],
                a.parentNode.insertBefore(u,a))
              }(window,document,'script');
              twq('config','puznb');
            `
          }}
        />
        <Script
          id='twitter-event'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `twq('event', 'tw-puznb-puznb', {});`
          }}
        />
      </head>
      <body>
        <div id='root'>
          {UserProvider && (
            <UserProvider>
              <AudioManager />
              <ToastContainer
                position='top-center'
                autoClose={2000}
                theme='colored'
                closeOnClick='true'
              />
              <ThemeInitializer />
              {children}
            </UserProvider>
          )}
        </div>
      </body>
    </html>
  );
}
