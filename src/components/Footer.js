import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookSquare, FaDiscord } from 'react-icons/fa';
import { DiCoffeescript } from 'react-icons/di';
import TermsOfUse from './termsofuse';
import About from './about';
import ContactForm from './authModals/sendEmail';
import PrivacyPolicy from './privacypolicy';
import SignInModal from './authModals/signInModal.js';

const Footer = () => {
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const footerSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': 'https://wizardland.net',
    'mainEntityOfPage': 'https://wizardland.net',
    'publisher': {
      '@type': 'Organization',
      'name': 'Wizard Land',
      'url': 'https://wizardland.net',
      'sameAs': [
        'https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/',
        'https://discord.com/channels/1369090826109452368/1369092092579680276',
        'https://buymeacoffee.com/wizardland'
      ]
    },
    'footer': {
      '@type': 'WebPageElement',
      'name': 'Footer',
      'description': 'Footer links for Wizard Land website',
      'hasPart': [
        {
          '@type': 'WebPageElement',
          'name': 'Privacy Policy',
          'url': 'https://wizardland.net/privacy-policy'
        },
        {
          '@type': 'WebPageElement',
          'name': 'Terms of Service',
          'url': 'https://wizardland.net/terms-of-service'
        },
        {
          '@type': 'WebPageElement',
          'name': 'Contact Us',
          'url': 'https://wizardland.net/contact-us'
        },
        {
          '@type': 'WebPageElement',
          'name': 'About Us',
          'url': 'https://wizardland.net/about-us'
        },
        {
          '@type': 'WebPageElement',
          'name': 'Login',
          'url': 'https://wizardland.net/login'
        }
      ]
    }
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(footerSchema)
        }}
      />
      <footer className='mq-footer'>
        <div className='mq-footer-content'>
          <h2>Wizard Land</h2>
          <hr />
          <div className='mq-footer-links'>
            <ul>
              <li>
                <Link onClick={() => setShowPrivacyPolicy(true)}>
                  Privacy Policy
                </Link>
              </li>
              <span>|</span>
              <li>
                <Link onClick={() => setShowTermsOfUse(true)}>
                  Terms of Service
                </Link>
              </li>
              <span>|</span>
              <li>
                <Link onClick={() => setShowContactForm(true)}>Contact Us</Link>
              </li>
              <span>|</span>
              <li>
                <Link onClick={() => setShowAbout(true)}>About Us</Link>
              </li>
              <span>|</span>
              <li>
                <Link onClick={() => setShowSignInModal(true)}>Login</Link>
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
