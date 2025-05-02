import React from 'react';

const getImagePath = require(`../assets/images/profile.jpg`);

const About = ({ onClose }) => (
  <div className='mq-modal-overlay'>
    <div className='mq-container'>
      <div className='mq-modal-header'>
        <h1 className='mq-modal-title'>About Wizard Land</h1>
        <button
          className='mq-close-btn'
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <hr />
      <div className='mq-modal-body'>
        <div className='mq-about-content'>
          <div className='mq-profile'>
            <img
              src={getImagePath}
              alt='Wizard'
              className='mq-profile-image'
            />
          </div>
          <p className='mq-about-text'>
            Greetings, dear traveler! I’m <strong>Shady</strong>, the head
            wizard and humble architect of Wizard Land. I speak of “we” because
            this enchanted realm could not have sprung to life without the
            boundless love and support of my family, especially my son, whose
            spark of imagination first ignited this magical quest.
            <br />
            <br />
            From the very first rune I etched, <strong>my mission</strong> has
            been clear: build a <strong>safe</strong>, <strong>ad‑free </strong>
            sanctuary where mages can explore, play, and learn without fear of
            tricksy pop‑ups or hidden scrolls of commerce. Here, every game tile
            is crafted with care, and the only surprises are the smiles and
            “aha!” moments you’ll collect.
            <br />
            <br />
            If Wizard Land’s spells have brightened your day, feel free to
            support our guild with a donation through{' '}
            <a
              href='https://www.buymeacoffee.com/wizardland'
              target='_blank'
            >
              Buy Me A Coffee
            </a>
            . We’re always brewing new potions of fun and eager for your
            feedback, send us your letters, ideas, or arcane suggestions, and
            together we’ll keep this magic growing.
            <br />
            <br />
            <strong>
              Thank you for joining our adventure. May your path be lined with
              stars and your wand never run dry!
            </strong>
          </p>
        </div>
      </div>
      <div className='mq-modal-footer'></div>
    </div>
  </div>
);

export default About;
