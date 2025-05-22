import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';

export const metadata = {
  title: 'Privacy Policy - Your Site Name',
  description: 'Learn about our privacy practices and data protection policies.'
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className='mq-main'>
        <div className='mq-content-wrapper'>
          <div className='mq-terms-content'>
            <p className='mq-terms-text'>
              <strong>Privacy Policy</strong>
              At Wizard Land, your privacy is important to us. This Privacy
              Policy outlines the types of personal information we collect and
              how we use, share, and protect it. By using our website and
              services, you agree to the terms of this Privacy Policy.
            </p>

            <p className='mq-terms-text'>
              <strong>1. Information We Collect</strong>
              We collect information when you use our website, create an
              account, or interact with our features. This may include personal
              information such as your name, email address, and any other
              information you provide to us.
            </p>

            <p className='mq-terms-text'>
              <strong>2. Payment Information</strong>
              <span>
                We do not collect any payment information directly. All payment
                transactions are securely processed by Buy Me a Coffee, and we
                do not store or have access to your payment details. Please
                refer to Buy Me a Coffee&apos;s privacy policy by visiting{' '}
                <a
                  href='https://buymeacoffee.com/wizardland'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Buy Me a Coffee
                </a>
              </span>
            </p>

            <p className='mq-terms-text'>
              <strong>3. How We Use Your Information</strong>
              The information we collect is used to provide, improve, and
              personalize our services. This may include sending notifications,
              saving your game progress, and responding to your inquiries. We do
              not process any transactions ourselves.
            </p>

            <p className='mq-terms-text'>
              <strong>4. Sharing Your Information</strong>
              We do not sell, trade, or rent your personal information to third
              parties. However, we may share your information with trusted
              partners who assist us in providing our services, such as payment
              processors, and who are bound by confidentiality agreements.
            </p>

            <p className='mq-terms-text'>
              <strong>5. Data Security</strong>
              We implement various security measures to protect your personal
              information from unauthorized access, alteration, or destruction.
              While we strive to protect your data, no method of transmission
              over the Internet or electronic storage is completely secure.
            </p>

            <p className='mq-terms-text'>
              <strong>6. Cookies</strong>
              Our website uses cookies to enhance your experience. Cookies help
              us remember your preferences and understand how you use our
              services. You can control cookie settings through your browser.
            </p>

            <p className='mq-terms-text'>
              <strong>7. Third-Party Links</strong>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites, and
              we encourage you to review their privacy policies.
            </p>

            <p className='mq-terms-text'>
              <strong>8. Your Rights</strong>
              You have the right to access, correct, or delete your personal
              information. If you wish to exercise these rights, please contact
              us through our website.
            </p>

            <p className='mq-terms-text'>
              <strong>9. Changes to This Privacy Policy</strong>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page, and we encourage you to review it
              periodically for updates.
            </p>

            <p className='mq-terms-text'>
              <strong>10. Contact Us</strong>
              If you have any questions about this Privacy Policy or our
              practices, please contact us through our website.
            </p>
            <p className='mq-terms-text'>
              <strong>11. Firebase and Push Notifications</strong>
              We use Firebase services to collect and manage device-related data
              for the purpose of sending push notifications on our mobile apps.
              This includes non-personal identifiers such as device tokens.
              These notifications help us inform you about updates, game events,
              and important account-related information. Firebase handles this
              data securely in accordance with their own privacy policies.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
