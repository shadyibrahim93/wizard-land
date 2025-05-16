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
import useSelectedRealm from '../hooks/userSelectedRealm.js';

const Footer = () => {
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { userId } = useUser();
  const router = useRouter();
  const { realm } = useSelectedRealm();

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
          <h4 className='mq-follow-us'>Follow Us</h4>
          <hr />
          <div className='mq-social-media'>
            <a
              href='https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/'
              target='_blank'
              rel='noopener noreferrer'
              title='Follow Wizard Land On Facebook'
            >
              {realm !== 'fantasy' ? (
                <img
                  src={`/assets/images/${realm}/elements/facebook.png`}
                  alt='Follow Wizard Land On Facebook'
                  title='Follow Wizard Land On Facebook'
                />
              ) : (
                <FaFacebookSquare className='mq-social-icon' />
              )}{' '}
            </a>
            <a
              href='https://discord.com/channels/1369090826109452368/1369092092579680276'
              target='_blank'
              rel='noopener noreferrer'
              title='Follow Wizard Land On Discord'
            >
              {realm !== 'fantasy' ? (
                <img
                  src={`/assets/images/${realm}/elements/discord.png`}
                  alt='Follow Wizard Land On Discord'
                  title='Follow Wizard Land On Discord'
                />
              ) : (
                <FaDiscord className='mq-social-icon' />
              )}{' '}
            </a>
            <a
              href='https://buymeacoffee.com/wizardland'
              target='_blank'
              rel='noopener noreferrer'
              title='Support Wizard Land On Buy Me A Coffee'
            >
              {realm !== 'fantasy' ? (
                <img
                  src={`/assets/images/${realm}/elements/coffee.png`}
                  alt='Support Wizard Land On Buy Me A Coffee'
                  title='Support Wizard Land On Buy Me A Coffee'
                />
              ) : (
                <DiCoffeescript className='mq-social-icon' />
              )}{' '}
            </a>
          </div>
          <p className='mq-copyright'>
            © 2025 Wizard Land. All rights reserved. Crafted with care by the
            Wizard Land team.
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
        {showSignInModal && <SignInModal showSignInModal={showSignInModal} />}
      </footer>
    </>
  );
};

export default Footer;
