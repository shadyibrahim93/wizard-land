import React from 'react';

const PrivacyPolicy = ({ onClose }) => (
  <div className='mq-modal-overlay'>
    <div className='mq-container'>
      <div className='mq-modal-header'>
        <h1 className='mq-modal-title'>Privacy Policy - Wizard Land</h1>
        <button
          onClick={onClose}
          className='mq-close-btn'
        >
          ✕
        </button>
      </div>
      <hr />
      <div className='mq-modal-body'>
        <div className='mq-terms-content'>
          <p className='mq-terms-text'>
            <strong>Privacy Policy</strong>
            <br />
            At Wizard Land, your privacy is important to us. This Privacy Policy
            outlines the types of personal information we collect and how we
            use, share, and protect it. By using our website and services, you
            agree to the terms of this Privacy Policy.
            <br />
            <br />
            <strong>1. Information We Collect</strong>
            <br />
            We collect information when you use our website, create an account,
            or interact with our features. This may include personal information
            such as your name, email address, and any other information you
            provide to us.
            <br />
            <br />
            <strong>2. Payment Information</strong>
            <br />
            We do not collect any payment information directly. All payment
            transactions are securely processed by Buy Me a Coffee, and we do
            not store or have access to your payment details. Please refer to
            Buy Me a Coffee's privacy policy by visiting{' '}
            <a
              href='https://buymeacoffee.com/wizardland'
              target='_blank'
              rel='noopener noreferrer'
            >
              Buy Me a Coffee
            </a>
            .
            <br />
            <br />
            <strong>3. How We Use Your Information</strong>
            <br />
            The information we collect is used to provide, improve, and
            personalize our services. This may include sending notifications,
            saving your game progress, and responding to your inquiries. We do
            not process any transactions ourselves.
            <br />
            <br />
            <strong>4. Sharing Your Information</strong>
            <br />
            We do not sell, trade, or rent your personal information to third
            parties. However, we may share your information with trusted
            partners who assist us in providing our services, such as payment
            processors, and who are bound by confidentiality agreements.
            <br />
            <br />
            <strong>5. Data Security</strong>
            <br />
            We implement various security measures to protect your personal
            information from unauthorized access, alteration, or destruction.
            While we strive to protect your data, no method of transmission over
            the Internet or electronic storage is completely secure.
            <br />
            <br />
            <strong>6. Cookies</strong>
            <br />
            Our website uses cookies to enhance your experience. Cookies help us
            remember your preferences and understand how you use our services.
            You can control cookie settings through your browser.
            <br />
            <br />
            <strong>7. Third-Party Links</strong>
            <br />
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites, and
            we encourage you to review their privacy policies.
            <br />
            <br />
            <strong>8. Your Rights</strong>
            <br />
            You have the right to access, correct, or delete your personal
            information. If you wish to exercise these rights, please contact us
            through our website.
            <br />
            <br />
            <strong>9. Changes to This Privacy Policy</strong>
            <br />
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and we encourage you to review it
            periodically for updates.
            <br />
            <br />
            <strong>10. Contact Us</strong>
            <br />
            If you have any questions about this Privacy Policy or our
            practices, please contact us through our website.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
