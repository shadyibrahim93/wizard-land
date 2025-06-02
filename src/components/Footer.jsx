'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFacebookSquare, FaDiscord } from 'react-icons/fa';
import { FaXTwitter, FaInstagram } from 'react-icons/fa6';
import { DiCoffeescript } from 'react-icons/di';
import About from './about.js';
import ContactForm from './authModals/sendEmail.js';
import SignInModal from './authModals/signInModal.js';
import { signOut } from '../apiService.js';
import { useUser } from '../context/UserContext.js';
import useSelectedRealm from '../hooks/userSelectedRealm.js';
import Link from 'next/link';
import PresenceTracker from './PresenceTracker.js';

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { userId } = useUser();
  const router = useRouter();
  const { realm, resolved } = useSelectedRealm();

  const handleLogout = async () => {
    await signOut();
    router.push('/'); // Add navigation
  };

  return (
    <>
      <PresenceTracker />
      <footer className='mq-footer'>
        <div className='mq-footer-content'>
          <h2>Wizard Land</h2>
          <hr />
          <div className='mq-footer-links'>
            <ul>
              <li>
                <Link
                  href='/privacy-policy'
                  className='mq-footer-link'
                >
                  Privacy Policy
                </Link>
              </li>
              <span>|</span>
              <li>
                <Link
                  href='/terms-of-use'
                  className='mq-footer-link'
                >
                  Terms of Service
                </Link>
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
                    userId !== 'Fire'
                      ? handleLogout()
                      : setShowSignInModal(true);
                  }}
                >
                  {userId !== 'Fire' ? 'Logout' : 'Login'}
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
              <FaFacebookSquare className='mq-social-icon' />
            </a>
            <a
              href='https://www.instagram.com/wizardland_game/'
              target='_blank'
              rel='noopener noreferrer'
              title='Follow Wizard Land On Instagram'
            >
              <FaInstagram className='mq-social-icon' />
            </a>
            <a
              href='https://x.com/WizardLandGame'
              target='_blank'
              rel='noopener noreferrer'
              title='Follow Wizard Land On X'
            >
              <FaXTwitter className='mq-social-icon' />
            </a>
            <a
              href='https://discord.com/channels/1369090826109452368/1369092092579680276'
              target='_blank'
              rel='noopener noreferrer'
              title='Follow Wizard Land On Discord'
            >
              <FaDiscord className='mq-social-icon' />
            </a>
            <a
              href='https://buymeacoffee.com/wizardland'
              target='_blank'
              rel='noopener noreferrer'
              title='Support Wizard Land On Buy Me A Coffee'
            >
              <DiCoffeescript className='mq-social-icon' />
            </a>
          </div>
          <p className='mq-copyright'>
            © 2025 Wizard Land. All rights reserved. Crafted with care by the
            Wizard Land team.
          </p>
        </div>
        {showAbout && <About onClose={() => setShowAbout(false)} />}
        {showContactForm && (
          <ContactForm
            showEmailModal={showContactForm}
            onClose={() => setShowContactForm(false)}
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
