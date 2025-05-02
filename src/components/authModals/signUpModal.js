import { useState } from 'react';
import { signUp } from '../../apiService';
import Button from '../Button';

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
          text: 'Signup successful! Please check your email to confirm your account.'
        });
        setEmail('');
        setFullName('');
        setPassword('');
        onClose(); // Only close the modal if signUp was successful
        onSignUpSuccess(); // Show the About modal after successful signup
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
    </>
  );
}
