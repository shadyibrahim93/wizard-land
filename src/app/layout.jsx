import { UserProvider } from '../context/UserContext.js';
import '../styles/sass/main.scss';
import Script from 'next/script';
import { generateHomeMetadata } from '../utils/metadata.js';
import ThemeInitializer from '../components/ThemeInitializer.jsx';

export const metadata = generateHomeMetadata({
  name: 'Play Ad-Free Multiplayer Board Games June 1st 2025'
});

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      data-theme='fantasy'
    >
      <head>
        {metadata}
        <UserProvider>
          <ThemeInitializer />
        </UserProvider>

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
      </head>
      <body>
        <div id='root'>
          <UserProvider>{children}</UserProvider>
        </div>
      </body>
    </html>
  );
}
