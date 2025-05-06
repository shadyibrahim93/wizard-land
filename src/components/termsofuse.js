import React from 'react';

const TermsOfUse = ({ onClose }) => (
  <div className='mq-modal-overlay'>
    <div className='mq-container'>
      <div className='mq-modal-header'>
        <h1 className='mq-modal-title'>Terms of Use - Wizard Land</h1>
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
            <strong>Terms of Use</strong>
            <br />
            Welcome to Wizard Land! By accessing or using our website and
            services, you agree to be bound by the following terms and
            conditions. If you do not agree, please refrain from using our
            services.
            <br />
            <br />
            <strong>1. Usage of Content</strong>
            <br />
            All content on Wizard Land, including but not limited to games,
            images, text, and media, is protected by copyright and intellectual
            property laws. You may not copy, modify, distribute, or use any
            content from Wizard Land without proper authorization.
            <br />
            <br />
            <strong>2. Account Responsibility</strong>
            <br />
            You are responsible for maintaining the confidentiality of your
            account and any activities associated with it. Wizard Land is not
            liable for any loss or damage caused by unauthorized use of your
            account.
            <br />
            <br />
            <strong>3. Purchases</strong>
            <br />
            All sales are final, and there are no refunds. By making a purchase
            on Wizard Land, you acknowledge and accept that you will not be
            eligible for any refund or exchange under any circumstances.
            <br />
            <br />
            <strong>4. Limitation of Liability</strong>
            <br />
            Wizard Land is not liable for any direct, indirect, incidental,
            special, consequential, or punitive damages that may arise from your
            use of our website or services. This includes but is not limited to
            any errors, interruptions, or loss of data.
            <br />
            <br />
            <strong>5. Modifications</strong>
            <br />
            We reserve the right to modify or update these terms at any time. It
            is your responsibility to review these terms periodically for any
            changes. By continuing to use the services, you agree to any
            modifications made.
            <br />
            <br />
            <strong>6. Governing Law</strong>
            <br />
            These terms are governed by the laws of [Your Country/State], and
            any disputes shall be subject to the exclusive jurisdiction of the
            courts in [Your City/State].
            <br />
            <br />
            If you have any questions or concerns about these terms, please
            contact us through our website.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TermsOfUse;
