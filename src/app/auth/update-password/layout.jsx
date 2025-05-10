'use client';

import Header from '../../../components/Header.jsx';
import Footer from '../../../components/Footer.jsx';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../apiService.js';
import Button from '../../../components/Button.js';
import Link from 'next/link';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is in recovery mode
      } else if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        title='Update Password'
        backTarget='/'
      />

      <div className='mq-modal-overlay'>
        <div className='mq-container mq-signup-page'>
          <div className='mq-modal-header'>
            <h1 className='mq-modal-title'>Set new password</h1>
          </div>
          <hr />
          <div className='mq-modal-body'>
            <div className='mq-wrapper'>
              <form
                onSubmit={handleUpdate}
                className='mq-form'
              >
                <div className='mq-form-group'>
                  <label className='mq-label'>Next Password</label>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='new-password'
                    required
                    placeholder='Enter new password'
                    className='mq-input'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className='mq-form-group'>
                  <label className='mq-label'>Confirm Password</label>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    required
                    className='mq-input'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {message && (
                  <div
                    className={`p-3 rounded-md ${
                      message.includes('successfully')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {message}
                  </div>
                )}
                <Button
                  type='Update Password'
                  text={loading ? 'Updating...' : 'Update Password'}
                  className='mq-button'
                  disabled={loading}
                />
                <div className='mq-form-actions'>
                  <Link
                    type='button'
                    href='/'
                    className='mq-link-btn'
                  >
                    Home Page
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
