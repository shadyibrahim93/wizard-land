import React from 'react';

const getImagePath = require(`../assets/images/profile.jpg`);
const getDiamondImage = require(`../assets/images/elements/euro_single.png`);

const About = ({ onClose }) => (
  <div className='mq-modal-overlay'>
    <div className='mq-container'>
      <div className='mq-modal-header'>
        <h1 className='mq-modal-title'>Welcome to Wizard Land</h1>
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
            We host enchanted <strong>daily</strong>, <strong>weekly</strong>,
            and <strong>monthly</strong> leaderboards, where brave wizards can
            climb the ranks and claim their place in legend. Those who shine
            brightest in the monthly trials shall receive magical rewards as
            tribute to their skill.
            <br />
            <br />
            Expect delightful <strong>sound effects</strong>,{' '}
            <strong>cheerful emojis</strong>, and a variety of{' '}
            <strong>themes</strong> to personalize your journey. From icy realms
            to glowing forests, these magical touches ensure that every mage’s
            experience is as unique as their wand and might just make you leap
            from your seat with joy!
            <br />
            <br />
            If Wizard Land’s spells have brightened your day, feel free to
            support our work with a contribution through{' '}
            <a
              href='#'
              onClick={(e) => {
                e.preventDefault(); // ❶ stop the browser from following the link
                const bmcButton = document.getElementById('bmc-wbtn');
                if (bmcButton) {
                  bmcButton.click(); // ❷ trigger your Buy-Me-a-Coffee button
                }
              }}
            >
              Buy Me A Coffee
            </a>{' '}
            For every <strong>$1</strong> you bestow, you will receive{' '}
            <strong>
              5000{' '}
              <img
                src={getDiamondImage}
                alt='Wizard'
                className='mq-diamond-image'
              />
            </strong>{' '}
            as a token of our gratitude. We’re always brewing new potions of fun
            and eager for your feedback, send us your letters, ideas, or arcane
            suggestions, and together we’ll keep this magic growing.
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
