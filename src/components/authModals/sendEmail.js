import { useState } from 'react';
import Button from '../Button';

export default function SendEmailModal({ showEmailModal, onClose }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const handleSendEmail = (e) => {
    e.preventDefault();
    // build the mailto: link using the form inputs
    const mailtoLink = [
      `mailto:shadyaziz72@gmail.com`,
      `subject=Wizard Land Inquiry: ${encodeURIComponent(subject)}`,
      `body=${encodeURIComponent(messageBody)}`
    ]
      .join('?')
      .replace('?&', '?');

    // open default mail client
    window.location.href = mailtoLink;
    onClose();
  };

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
            <Button
              type='submit'
              text='Send Email'
              className='mq-button'
            />
          </form>
        </div>
      </div>
    </div>
  );
}
