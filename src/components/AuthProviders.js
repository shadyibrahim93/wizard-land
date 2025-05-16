import React from 'react';
import { FaDiscord } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { FaTwitch } from 'react-icons/fa';
import { signInWithProvider } from '../apiService';

const AuthProviders = () => {
  const handleOAuthSignIn = async (provider) => {
    const { success, url, error } = await signInWithProvider(provider);
    if (success && url) window.location.href = url;
    else console.error(error);
  };

  return (
    <>
      <div className='mq-oauth-buttons'>
        <button
          type='button'
          className='mq-button mq-google-btn'
          onClick={() => handleOAuthSignIn('google')}
        >
          <FcGoogle size={20} />
        </button>

        {/* <button
          type='button'
          className='mq-button mq-apple-btn'
          onClick={() => handleOAuthSignIn('apple')}
        >
          <FaApple size={20} />
        </button> */}

        <button
          type='button'
          className='mq-button mq-discord-btn'
          onClick={() => handleOAuthSignIn('discord')}
        >
          <FaDiscord size={20} />
        </button>
        <button
          type='button'
          className='mq-button mq-twitch-btn'
          onClick={() => handleOAuthSignIn('twitch')}
        >
          <FaTwitch size={20} />
        </button>
      </div>
      <div className='mq-or-separator'>or</div>
    </>
  );
};

export default AuthProviders;
