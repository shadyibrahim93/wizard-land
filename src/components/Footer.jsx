'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFacebookSquare, FaDiscord } from 'react-icons/fa';
import { DiCoffeescript } from 'react-icons/di';
import TermsOfUse from './termsofuse.js';
import About from './about.js';
import ContactForm from './authModals/sendEmail.js';
import PrivacyPolicy from './privacypolicy.js';
import SignInModal from './authModals/signInModal.js';
import { signOut } from '../apiService.js';
import { useUser } from '../context/UserContext.js';

const Footer = () => {
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { userId } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/'); // Add navigation
  };

  return (
    <>
      <footer className='mq-footer'>
        <div className='mq-footer-content'>
          <h2>Wizard Land</h2>
          <hr />
          <div className='mq-footer-links'>
            <ul>
              <li>
                <button onClick={() => setShowPrivacyPolicy(true)}>
                  Privacy Policy
                </button>
              </li>
              <span>|</span>
              <li>
                <button onClick={() => setShowTermsOfUse(true)}>
                  Terms of Service
                </button>
              </li>
              <span>|</span>
              <li>
                <button onClick={() => setShowContactForm(true)}>
                  Contact Us
                </button>
              </li>
              <span>|</span>
              <li>
                <button onClick={() => setShowAbout(true)}>About Us</button>
              </li>
              <span>|</span>
              <li>
                <button
                  onClick={() => {
                    userId ? handleLogout() : setShowSignInModal(true);
                  }}
                >
                  {userId ? 'Logout' : 'Login'}
                </button>{' '}
              </li>
            </ul>
          </div>
          <h3 className='mq-follow-us'>Follow Us</h3>
          <hr />
          <div className='mq-social-media'>
            <a
              href='https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
              target='_blank'
              rel='noopener noreferrer'
              title='Facebook'
            >
              <FaFacebookSquare className='mq-social-icon' />
            </a>
            <a
              href='https://discord.com/channels/1369090826109452368/1369092092579680276'
              target='_blank'
              rel='noopener noreferrer'
              title='Discord'
            >
              <FaDiscord className='mq-social-icon' />
            </a>
            <a
              href='https://buymeacoffee.com/wizardland'
              target='_blank'
              rel='noopener noreferrer'
              title='Buy Me a Coffee'
            >
              <DiCoffeescript className='mq-social-icon' />
            </a>
          </div>
          <p className='mq-copyright'>
            &copy; 2025 Wizard Land. All rights reserved | Designed and
            developed by Shady Ibrahim.
          </p>
        </div>
        {showTermsOfUse && (
          <TermsOfUse onClose={() => setShowTermsOfUse(false)} />
        )}
        {showAbout && <About onClose={() => setShowAbout(false)} />}
        {showContactForm && (
          <ContactForm
            showEmailModal={showContactForm}
            onClose={() => setShowContactForm(false)}
          />
        )}
        {showPrivacyPolicy && (
          <PrivacyPolicy
            showEmailModal={showPrivacyPolicy}
            onClose={() => setShowPrivacyPolicy(false)}
          />
        )}
        {showSignInModal && (
          <SignInModal
            showSignInModal={showSignInModal}
            onClose={() => setShowSignInModal(false)}
          />
        )}
      </footer>
    </>
  );
};

export default Footer;
