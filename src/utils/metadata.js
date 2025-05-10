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

      {/* OpenGraph/Facebook */}
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

      {/* Twitter */}
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

      {/* Google/Schema.org */}
      <link
        rel='image_src'
        href={socialImages.google}
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
      'Enjoy ad-free gameplay on Wizard Land with classic online board games',
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

      {/* OpenGraph/Facebook */}
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

      {/* Twitter */}
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

      {/* Google/Schema.org */}
      <link
        rel='image_src'
        href={socialImages.google}
      />
    </>
  );
}
