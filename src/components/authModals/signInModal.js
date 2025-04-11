import { useState } from 'react';
import { signIn } from '../../apiService'; // assumes it returns a Supabase session/user
import Button from '../Button';

export default function SignInModal({ showSignInModal, onClose }) {
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
        setMessage({
          type: 'success',
          text: 'Sign-in successful! Redirecting...'
        });
        setEmail('');
        setPassword('');
        onClose();

        // ✅ Optional: Refresh to trigger `useUser()` to re-read session
        window.location.reload();
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
    </div>
  );
}
