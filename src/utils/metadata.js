export function generateGameMetadata({ name, slug, mode = 'solo' }) {
  const isMultiplayer = mode === 'multiplayer';
  const baseTitle = `Play ${name} Online – Free ${
    isMultiplayer ? 'Multiplayer' : 'Solo'
  } Ad-Free Games`;
  const titleSuffix = '| Wizard Land';

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
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Play ${name} Online ${
        isMultiplayer ? 'with Friends' : 'Solo'
      } – Ad-Free ${titleSuffix}`,
      description: isMultiplayer
        ? `Jump into ad-free multiplayer fun with ${name} on Wizard Land – no signup needed!`
        : `Take on the ad-free solo challenge in ${name}. Play now on Wizard Land.`
    }
  };

  // Generate the meta tags as JSX
  return (
    <>
      <meta
        name='description'
        content={metadata.description}
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
      <title>{metadata.title}</title>
    </>
  );
}

export function generateHomeMetadata({ name }) {
  const baseTitle = `${name}`;
  const titleSuffix = '| Wizard Land';

  const metadata = {
    title: `${baseTitle} ${titleSuffix}`,
    description:
      'Enjoy ad-free gameplay on Wizard Land, where you can play a collection of classic online board games like Chess, Checkers, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.',
    openGraph: {
      title: `${baseTitle} ${titleSuffix}`,
      description:
        'Join Wizard Land and play your favorite classic online board games with friends or solo, all for free and ad-free!',
      url: 'https://wizardland.net', // Assuming this is the homepage URL
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${baseTitle} ${titleSuffix}`,
      description:
        'Enjoy free, ad-free online board games at Wizard Land. Challenge your friends or play solo today!'
    }
  };

  // Generate the meta tags as JSX
  return (
    <>
      <meta
        name='description'
        content={metadata.description}
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
      <title>{metadata.title}</title>
    </>
  );
}
