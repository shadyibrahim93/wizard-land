import React from 'react';

export function generateGameMetadata({ name, slug, mode = 'solo' }) {
  const isMultiplayer = mode === 'multiplayer';
  const baseTitle = `Play ${name} Online – Free ${
    isMultiplayer ? 'Multiplayer' : 'Solo'
  } Ad-Free Games`;
  const titleSuffix = '| Wizard Land';

  // Image configuration
  const socialImages = {
    default: 'https://wizardland.net/assets/images/background.jpg',
    twitter: 'https://wizardland.net/assets/images/logo.png',
    facebook: 'https://wizardland.net/assets/images/logo.png',
    google: 'https://wizardland.net/assets/images/logo.png',
    openGraph: 'https://wizardland.net/assets/images/logo.png'
  };

  // Metadata content
  const metadata = {
    title: `${baseTitle} ${titleSuffix}`,
    description: isMultiplayer
      ? `Play ${name} online with friends – totally free and ad-free! Enjoy real-time multiplayer fun on Wizard Land.`
      : `Play ${name} solo online for free with no ads. Challenge yourself in this relaxing and ad-free experience on Wizard Land!`,
    openGraph: {
      title: `${name} – Free ${
        isMultiplayer ? 'Multiplayer' : 'Single Player'
      } Ad-Free Game Online ${titleSuffix}`,
      description: isMultiplayer
        ? `Compete with friends in ${name}, ad-free multiplayer game on Wizard Land. Enjoy seamless gameplay, strategy, and friendly competition without interruptions, all in an immersive online environment. Challenge your friends and experience the excitement of multiplayer fun on Wizard Land.`
        : `Enjoy ad-free solo gameplay in ${name}, a relaxing, stress-free online game on Wizard Land. Perfect for unwinding or challenging yourself at your own pace, without ads or distractions. Dive into a peaceful game environment, available for free whenever you're ready to play.`,
      url: `https://wizardland.net/games/${slug}`,
      type: 'website',
      keywords: `${name}, online board games, ${
        isMultiplayer ? 'Multiplayer board' : 'Single Player'
      }  games, ad-free games, classic board games online, play board games with friends, free online games, Wizard Land, Chess online, Checkers online, Orbito online, Connect 4 online, Tic Tac Toe online, online puzzle games, online memory games`,
      images: [
        {
          url: socialImages.openGraph || socialImages.default,
          width: '1200',
          height: '630',
          alt: `${name} game screenshot`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Play ${name} Online ${
        isMultiplayer ? 'with Friends' : 'Solo'
      } – Ad-Free ${titleSuffix}`,
      description: isMultiplayer
        ? `Jump into ad-free multiplayer fun with ${name} on Wizard Land – no signup needed!`
        : `Take on the ad-free solo challenge in ${name}. Play now on Wizard Land.`,
      images: [socialImages.twitter || socialImages.default]
    }
  };

  return (
    <>
      <title>{metadata.title}</title>
      <meta
        name='description'
        content={metadata.description}
      />
      <link
        rel='canonical'
        href={metadata.openGraph.url}
      />
      <meta
        name='keywords'
        content={metadata.keywords}
      />
      <meta
        name='robots'
        content='index, follow'
      />
      <meta
        property='og:title'
        content={metadata.openGraph.title}
      />
      <meta
        property='og:description'
        content={metadata.openGraph.description}
      />
      <meta
        property='og:url'
        content={metadata.openGraph.url}
      />
      <meta
        property='og:type'
        content={metadata.openGraph.type}
      />
      <meta
        property='og:image'
        content={metadata.openGraph.images[0].url}
      />
      <meta
        property='og:image:width'
        content={metadata.openGraph.images[0].width}
      />
      <meta
        property='og:image:height'
        content={metadata.openGraph.images[0].height}
      />
      <meta
        property='og:image:alt'
        content={metadata.openGraph.images[0].alt}
      />

      <meta
        name='twitter:card'
        content={metadata.twitter.card}
      />
      <meta
        name='twitter:title'
        content={metadata.twitter.title}
      />
      <meta
        name='twitter:description'
        content={metadata.twitter.description}
      />
      <meta
        name='twitter:image'
        content={metadata.twitter.images[0]}
      />

      <link
        rel='image_src'
        href={socialImages.google}
      />
      <meta
        name='publisher'
        content='Wizard Land'
      />
      <meta
        name='publisher-url'
        content='https://wizardland.net'
      />
      <meta
        name='publisher-logo'
        content='https://wizardland.net/assets/images/logo.png'
      />
      <meta
        name='author'
        content='Wizard Land'
      />
      <meta
        name='author-url'
        content='https://wizardland.net'
      />
      <meta
        name='author-logo'
        content='https://wizardland.net/assets/images/logo.png'
      />
      <meta
        name='author-facebook'
        content='https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
      />
      <meta
        name='author-discord'
        content='https://discord.com/channels/1369090826109452368/1369092092579680276'
      />
      <meta
        name='author-buymeacoffee'
        content='https://buymeacoffee.com/wizardland'
      />
    </>
  );
}

export function generateHomeMetadata({ name }) {
  const baseTitle = `${name}`;
  const titleSuffix = '| Wizard Land';

  // Image configuration
  const socialImages = {
    default: 'https://wizardland.net/assets/images/background.jpg',
    twitter: 'https://wizardland.net/assets/images/logo.png',
    facebook: 'https://wizardland.net/assets/images/logo.png',
    google: 'https://wizardland.net/assets/images/logo.png',
    openGraph: 'https://wizardland.net/assets/images/logo.png'
  };

  // Metadata content
  const metadata = {
    title: `${baseTitle} ${titleSuffix}`,
    description:
      'Get ready for Wizard Land, an ad-free online multiplayer board game platform launching on June 1st, 2025! Sign up for early access and challenge friends in magical board games.',
    openGraph: {
      title: `${baseTitle} ${titleSuffix}`,
      description: 'Play classic online board games with friends or solo',
      url: 'https://wizardland.net',
      type: 'website',
      images: [
        {
          url: socialImages.openGraph,
          width: '1200',
          height: '630',
          alt: 'Wizard Land - Online Board Games'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${baseTitle} ${titleSuffix}`,
      description: 'Enjoy free, ad-free online board games at Wizard Land',
      images: [socialImages.twitter]
    }
  };

  return (
    <>
      <title>{metadata.title}</title>
      <meta
        name='description'
        content={metadata.description}
      />
      <meta
        property='og:title'
        content={metadata.openGraph.title}
      />
      <meta
        name='keywords'
        content='online board games, multiplayer board games, ad-free games, classic board games online, play board games with friends, free online games, Wizard Land, Chess online, Checkers online, Orbito online, Connect 4 online, Tic Tac Toe online, online puzzle games, online memory games'
      />
      <link
        rel='canonical'
        href={metadata.openGraph.url}
      />
      <meta
        property='og:description'
        content={metadata.openGraph.description}
      />
      <meta
        name='robots'
        content='index, follow'
      />
      <meta
        name='publisher'
        content='Wizard Land'
      />
      <meta
        name='publisher-url'
        content='https://wizardland.net'
      />
      <meta
        name='publisher-logo'
        content='https://wizardland.net/assets/images/logo.png'
      />
      <meta
        property='og:url'
        content={metadata.openGraph.url}
      />
      <meta
        property='og:type'
        content={metadata.openGraph.type}
      />
      <meta
        property='og:image'
        content={metadata.openGraph.images[0].url}
      />
      <meta
        property='og:image:width'
        content={metadata.openGraph.images[0].width}
      />
      <meta
        property='og:image:height'
        content={metadata.openGraph.images[0].height}
      />
      <meta
        property='og:image:alt'
        content={metadata.openGraph.images[0].alt}
      />

      <meta
        name='twitter:card'
        content={metadata.twitter.card}
      />
      <meta
        name='twitter:title'
        content={metadata.twitter.title}
      />
      <meta
        name='twitter:description'
        content={metadata.twitter.description}
      />
      <meta
        name='twitter:image'
        content={metadata.twitter.images[0]}
      />

      <link
        rel='image_src'
        href={socialImages.google}
      />
      <meta
        name='author'
        content='Shady Ibrahim'
      />
      <meta
        name='author-url'
        content='https://www.linkedin.com/in/shady-ibrahim'
      />
      <meta
        name='author-logo'
        content='https://wizardland.net/assets/images/profile.jpg'
      />
      <meta
        name='author-facebook'
        content='https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
      />
      <meta
        name='author-discord'
        content='https://discord.com/channels/1369090826109452368/1369092092579680276'
      />
      <meta
        name='author-buymeacoffee'
        content='https://buymeacoffee.com/wizardland'
      />
    </>
  );
}
