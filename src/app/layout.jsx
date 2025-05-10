import { UserProvider } from '../context/UserContext.js';
import '../styles/sass/main.scss';
import Script from 'next/script';
import { generateHomeMetadata } from '../utils/metadata.js';

export const metadata = generateHomeMetadata({
  name: 'Unleash the Magic of Ad-Free Multiplayer Board Games – Join Us on June 1st, 2025!'
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        {/* Google Tag Manager */}
        {metadata}
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
