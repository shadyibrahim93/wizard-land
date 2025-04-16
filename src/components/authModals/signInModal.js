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
    <div className='mq-modal-overlay'>
      <div className='mq-container mq-signin-page'>
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>Sign In</h1>
          <button
            className='mq-close-btn'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <hr />
        <div className='mq-modal-body'>
          <div className='mq-wrapper'>
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
              {message && (
                <div className={`mq-message mq-${message.type}`}>
                  {message.text}
                </div>
              )}
              <Button
                type='submit'
                text='Log In'
                className='mq-button'
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Log In'}
              </Button>
            </form>
          </div>
        </div>
        <div className='mq-modal-footer'></div>
      </div>
    </div>
  );
}
