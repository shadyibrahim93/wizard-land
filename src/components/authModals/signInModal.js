'use client';

import { useState } from 'react';
import { supabase } from '../../apiService';
import Button from '../Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInModal({ showSignInModal, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Sign-in successful! Redirecting...'
      });
      setEmail('');
      setPassword('');
      onClose();
      router.refresh();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Sign-in failed. Please check your credentials.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Password reset link sent! Check your email.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send reset link. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setMessage(null);
  };

  if (!showSignInModal) return null;

  return (
    <div className='mq-modal-overlay'>
      <div className='mq-container mq-signin-page'>
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>
            {showForgotPassword ? 'Reset Password' : 'Sign In'}
          </h1>
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
              onSubmit={showForgotPassword ? handlePasswordReset : handleSignIn}
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

              {!showForgotPassword && (
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
              )}

              {message && (
                <div className={`mq-message mq-${message.type}`}>
                  {message.text}
                </div>
              )}

              <Button
                type='submit'
                className='mq-button'
                disabled={loading}
                text={
                  loading
                    ? showForgotPassword
                      ? 'Sending...'
                      : 'Signing in...'
                    : showForgotPassword
                    ? 'Send Reset Link'
                    : 'Log In'
                }
              ></Button>
              <div className='mq-form-actions'>
                {!showForgotPassword ? (
                  <button
                    type='button'
                    onClick={toggleForgotPassword}
                    className='mq-link-btn'
                  >
                    Forgot password?
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={toggleForgotPassword}
                    className='mq-link-btn'
                  >
                    Back To Sign In
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className='mq-modal-footer'></div>
      </div>
    </div>
  );
}
