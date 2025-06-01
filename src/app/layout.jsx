import { UserProvider } from '../context/UserContext.js';
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
  return (
    <html
      lang='en'
      data-theme='fantasy'
    >
      <head>
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
        </div>
      </body>
    </html>
  );
}
