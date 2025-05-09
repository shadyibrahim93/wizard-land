'use client';

import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import Button from '../Button';
import { useUser } from '../../context/UserContext';

export default function SendEmailModal({ showEmailModal, onClose }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { userName } = useUser();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await emailjs.send(
        'service_hbyy29m', // From EmailJS dashboard
        'template_o5dg0wa', // From EmailJS template
        {
          to_email: email,
          subject: subject,
          message: messageBody,
          from_name: userName // Add any additional fields
        }
      );

      setSuccessMessage('Email sent successfully!');
      setTimeout(() => {
        onClose();
        // Reset form
        setEmail('');
        setSubject('');
        setMessageBody('');
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (showEmailModal) {
      // Clear messages and reset form when modal opens
      setErrorMessage('');
      setSuccessMessage('');
      setEmail('');
      setSubject('');
      setMessageBody('');
    }
  }, [showEmailModal]);

  if (!showEmailModal) return null;

  return (
    <div className='mq-modal-overlay'>
      <div className='mq-container mq-send-email-page'>
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>Send Feedback</h1>
          <button
            className='mq-close-btn'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <hr />
        <div className='mq-modal-body'>
          <form
            onSubmit={handleSendEmail}
            className='mq-form'
          >
            <div className='mq-form-group'>
              <label className='mq-label'>Recipient Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mq-input'
                placeholder='e.g. support@yourdomain.com'
                required
              />
            </div>
            <div className='mq-form-group'>
              <label className='mq-label'>Subject</label>
              <input
                type='text'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className='mq-input'
                required
              />
            </div>
            <div className='mq-form-group'>
              <label className='mq-label'>Message</label>
              <textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className='mq-input'
                rows={5}
                required
              />
            </div>
            {errorMessage && <div className={`mq-message`}>{errorMessage}</div>}
            {successMessage && (
              <div className='mq-message'>{successMessage}</div>
            )}
            <Button
              type='submit'
              text={isSending ? 'Sending...' : 'Send Email'}
              className='mq-button'
              disabled={isSending}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
