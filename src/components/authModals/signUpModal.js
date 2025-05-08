import { useState, useRef, useEffect } from 'react';
import { signUp } from '../../apiService';
import Button from '../Button';
import PrivacyPolicy from '../privacypolicy.js';
import TermsOfUse from '../termsofuse.js';
import { Link } from 'react-router-dom';

export default function SignUpModal({
  showSignUpModal,
  onClose,
  onSignUpSuccess
}) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [token, setToken] = useState('');

  const widgetRef = useRef(null);

  useEffect(() => {
    if (!showSignUpModal) return;

    const onTurnstileCallback = () => {
      if (widgetRef.current && widgetRef.current.childNodes.length === 0) {
        window.turnstile.render(widgetRef.current, {
          sitekey: '0x4AAAAAABbXDRlf7XHHdt4W',
          callback: (token) => setToken(token)
        });
      }
    };

    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = onTurnstileCallback;
      document.body.appendChild(script);
    } else {
      onTurnstileCallback();
    }
  }, [showSignUpModal]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Await the signUp function and get the response result
      const result = await signUp({ email, password, fullName });

      if (result && result.success) {
        setMessage({
          type: 'success',
          text: 'Signup successful! No email verification needed — enjoy your experience!'
        });
        setEmail('');
        setFullName('');
        setPassword('');
        if (typeof onClose === 'function') {
          setTimeout(() => {
            onClose();
            setMessage({ type: '', text: '' });
          }, 4000);
        }
        if (typeof onSignUpSuccess === 'function') onSignUpSuccess();
      } else {
        throw new Error(result.error || 'Something went wrong during signup.');
      }
    } catch (error) {
      console.log(error);
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong during signup.'
      });
    }
    setLoading(false);
  };

  if (!showSignUpModal) return null;

  return (
    <>
      <div className='mq-modal-overlay'>
        <div className='mq-container mq-signup-page'>
          <div className='mq-modal-header'>
            <h1 className='mq-modal-title'>Sign Up</h1>
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
                onSubmit={handleSignup}
                className='mq-form'
              >
                <div className='mq-form-group'>
                  <label className='mq-label'>Nickname</label>
                  <input
                    type='text'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='mq-input'
                    required
                  />
                </div>
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
                <p class='signup-disclaimer'>
                  By signing up, you agree to our{' '}
                  <Link
                    onClick={() => {
                      setShowTermsOfUse(true);
                    }}
                  >
                    Terms of Use{' '}
                  </Link>
                  and acknowledge our{' '}
                  <Link
                    onClick={() => {
                      setShowPrivacyPolicy(true);
                    }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <div
                  ref={widgetRef}
                  className='captcha-widget'
                />
                <Button
                  type='submit'
                  text={loading ? 'Signing up...' : 'Sign Up'}
                  className='mq-button'
                  disabled={loading}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      {showPrivacyPolicy && (
        <PrivacyPolicy
          showPrivacyPolicy={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
        />
      )}
      {showTermsOfUse && (
        <TermsOfUse
          showTermsOfUse={showTermsOfUse}
          onClose={() => setShowTermsOfUse(false)}
        />
      )}
    </>
  );
}
