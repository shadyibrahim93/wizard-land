import { useState } from 'react';
import { signIn } from '../apiService'; // make sure to import signIn method
import Button from '../components/Button';

export default function SignInModal({
  showSignInModal,
  onClose,
  setUserFullName
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const user = await signIn({ email, password });

      if (user) {
        const fullName = user.full_name;
        const userId = user.id;

        // Store the full name in localStorage with an expiration of 24 hours
        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        localStorage.setItem(
          'userFullName',
          JSON.stringify({ fullName, userId, expirationTime })
        );

        // Pass the full name to the parent component
        setUserFullName(fullName);

        setMessage({
          type: 'success',
          text: 'Sign-in successful! Redirecting...'
        });
        setEmail('');
        setPassword('');
        onClose();
      } else {
        setMessage({
          type: 'error',
          text: 'Sign-in failed. Please check your credentials.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong during sign-in.'
      });
    }

    setLoading(false);
  };

  if (!showSignInModal) return null;

  return (
    <div className='mq-overlay mq-signin-page'>
      <div className='mq-wrapper'>
        <button
          onClick={onClose}
          className='mq-close-button'
        >
          ×
        </button>
        <form
          onSubmit={handleSignIn}
          className='mq-form'
        >
          <div className='mq-form-group'>
            <label className='mq-label'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mq-input'
              required
            />
          </div>
          <div className='mq-form-group'>
            <label className='mq-label'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mq-input'
              required
            />
          </div>
          <Button
            type='submit'
            text='Log In'
            className='mq-button'
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Log In'}
          </Button>
          {message && (
            <div className={`mq-message mq-${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
      <svg>
        <filter id='wavy2'>
          <feTurbulence
            x='0'
            y='0'
            baseFrequency='0.005'
            numOctaves='10'
            seed='20'
          />
          <feDisplacementMap
            in='SourceGraphic'
            scale='10'
          />
        </filter>
      </svg>
    </div>
  );
}
