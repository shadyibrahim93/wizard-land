import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaFacebookSquare, FaLinkedin, FaDiscord } from 'react-icons/fa'; // Import only Facebook and LinkedIn icons
import { DiCoffeescript } from 'react-icons/di';
import TermsOfUse from './termsofuse'; // Import the TermsOfUse component
import About from './about';
import ContactForm from './authModals/sendEmail'; // Import the SendEmailModal component
import PrivacyPolicy from './privacypolicy'; // Import the PrivacyPolicy component
import SignInModal from './authModals/signInModal.js';

const Footer = () => {
  const [showTermsOfUse, setShowTermsOfUse] = useState(false); // Manage the modal visibility
  const [showAbout, setShowAbout] = useState(false); // Manage the modal visibility
  const [showContactForm, setShowContactForm] = useState(false); // Manage the modal visibility
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false); // Manage the modal visibility
  const [showSignInModal, setShowSignInModal] = useState(false); // Manage the modal visibility

  return (
    <footer className='mq-footer'>
      <div className='mq-footer-content'>
        <h2>Wizard Land</h2>
        <hr></hr>
        <div className='mq-footer-links'>
          <ul>
            <li>
              <Link onClick={() => setShowPrivacyPolicy(true)}>
                Privacy Policy
              </Link>{' '}
            </li>
            <span>|</span>
            <li>
              <Link onClick={() => setShowTermsOfUse(true)}>
                Terms of Service
              </Link>{' '}
            </li>
            <span>|</span>
            <li>
              <Link onClick={() => setShowContactForm(true)}>Contact Us</Link>{' '}
            </li>
            <span>|</span>
            <li>
              <Link onClick={() => setShowAbout(true)}>About Us</Link>{' '}
            </li>
            <span>|</span>
            <li>
              <Link onClick={() => setShowSignInModal(true)}>Login</Link>{' '}
            </li>
          </ul>
        </div>
        <h3 className='mq-follow-us'>Follow Us</h3>
        <hr></hr>
        <div className='mq-social-media'>
          <a
            href='https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaFacebookSquare className='mq-social-icon' />
          </a>
          {/* <a
            href='https://www.linkedin.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin className='mq-social-icon' />
          </a> */}
          <a
            href='https://discord.com/channels/1369090826109452368/1369092092579680276'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaDiscord className='mq-social-icon' />
          </a>
          <a
            href='https://buymeacoffee.com/wizardland'
            target='_blank'
            rel='noopener noreferrer'
          >
            <DiCoffeescript className='mq-social-icon' />
          </a>
        </div>
        <p className='mq-copyright'>
          &copy; 2025 Wizard Land. All rights reserved | Designed and developed
          by Shady Ibrahim.
        </p>
      </div>
      {showTermsOfUse && (
        <TermsOfUse onClose={() => setShowTermsOfUse(false)} /> // Pass onClose to close the modal
      )}
      {showAbout && (
        <About onClose={() => setShowAbout(false)} /> // Pass onClose to close the modal
      )}
      {showContactForm && (
        <ContactForm
          showEmailModal={showContactForm}
          onClose={() => setShowContactForm(false)}
        /> // Pass onClose to close the modal
      )}
      {showPrivacyPolicy && (
        <PrivacyPolicy
          showEmailModal={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
        /> // Pass onClose to close the modal
      )}
      {showSignInModal && (
        <SignInModal
          showSignInModal={showSignInModal}
          onClose={() => setShowSignInModal(false)}
        /> // Pass onClose to close the modal
      )}
    </footer>
  );
};

export default Footer;
