'use client';

import { useState, useRef, useEffect } from 'react';
import { signUp } from '../../apiService';
import Button from '../Button';
import PrivacyPolicy from '../privacypolicy.js';
import TermsOfUse from '@components/termsofuse.js';
import AuthProviders from '@components/AuthProviders.js';

export default function SignUpModal({
  showSignUpModal,
  onClose,
  onSignUpSuccess,
  successMessage = 'Signup successful! No email verification needed — enjoy your experience!'
}) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); // raw Turnstile token
  const [isHuman, setIsHuman] = useState(false); // verified by your API
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [successMessageText] = useState(successMessage);

  const widgetRef = useRef(null);

  // 1) Render Turnstile widget whenever modal opens:
  useEffect(() => {
    if (!showSignUpModal) return;

    // grab the container
    const container = widgetRef.current;
    if (!container) return;

    // remove any previous widget markup
    container.innerHTML = '';

    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = onTurnstileLoaded;
      document.body.appendChild(script);
    } else {
      onTurnstileLoaded();
    }

    // when showSignUpModal flips false, cleanup the widget
    return () => {
      container.innerHTML = '';
    };
  }, [showSignUpModal]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await signUp({ email, password, fullName });
      if (result.success) {
        setMessage({ type: 'success', text: successMessageText });
        setEmail('');
        setFullName('');
        setPassword('');
        setTimeout(() => onClose(), 4000);
        onSignUpSuccess?.();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!showSignUpModal) return null;

  return (
    <div
      className='mq-modal-overlay'
      onClick={onClose}
    >
      <div
        className='mq-container mq-signup-page'
        onClick={(e) => e.stopPropagation()}
      >
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
            <>
              <AuthProviders />

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

                <div className='mq-form-actions'>
                  <p className='signup-disclaimer'>
                    By signing up, you agree to our{' '}
                    <button
                      className='mq-link-btn'
                      onClick={() => setShowTermsOfUse(true)}
                    >
                      Terms of Use
                    </button>{' '}
                    and acknowledge our{' '}
                    <button
                      className='mq-link-btn'
                      onClick={() => setShowPrivacyPolicy(true)}
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>

                <Button
                  type='submit'
                  className='mq-button'
                  disabled={loading}
                  text={loading ? 'Signing up…' : 'Sign Up'}
                />
              </form>
            </>
          </div>
        </div>
      </div>

      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}
      {showTermsOfUse && (
        <TermsOfUse onClose={() => setShowTermsOfUse(false)} />
      )}
    </div>
  );
}
