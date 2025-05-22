import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';

export const metadata = {
  title: 'Terms and Conditions - Wizard Land',
  description:
    'Review the terms and conditions for using Wizard Land, including usage policies, purchases, and legal information.'
};

export default function TermsAndConditions() {
  return (
    <>
      <Header />
      <div className='mq-main'>
        <div className='mq-content-wrapper'>
          <div className='mq-terms-content'>
            <p className='mq-terms-text'>
              <strong>Terms of Use</strong>
              Welcome to Wizard Land! By accessing or using our website and
              services, you agree to be bound by the following terms and
              conditions. If you do not agree, please refrain from using our
              services.
            </p>

            <p className='mq-terms-text'>
              <strong>1. Usage of Content</strong>
              All content on Wizard Land, including but not limited to games,
              images, text, and media, is protected by copyright and
              intellectual property laws. You may not copy, modify, distribute,
              or use any content from Wizard Land without proper authorization.
            </p>

            <p className='mq-terms-text'>
              <strong>2. Account Responsibility</strong>
              You are responsible for maintaining the confidentiality of your
              account and any activities associated with it. Wizard Land is not
              liable for any loss or damage caused by unauthorized use of your
              account.
            </p>

            <p className='mq-terms-text'>
              <strong>3. Purchases</strong>
              All sales are final, and there are no refunds. By making a
              purchase on Wizard Land, you acknowledge and accept that you will
              not be eligible for any refund or exchange under any
              circumstances.
            </p>

            <p className='mq-terms-text'>
              <strong>4. Limitation of Liability</strong>
              Wizard Land is not liable for any direct, indirect, incidental,
              special, consequential, or punitive damages that may arise from
              your use of our website or services. This includes but is not
              limited to any errors, interruptions, or loss of data.
            </p>

            <p className='mq-terms-text'>
              <strong>5. Modifications</strong>
              We reserve the right to modify or update these terms at any time.
              It is your responsibility to review these terms periodically for
              any changes. By continuing to use the services, you agree to any
              modifications made.
            </p>

            <p className='mq-terms-text'>
              <strong>6. Governing Law</strong>
              These terms are governed by the laws of [Your Country/State], and
              any disputes shall be subject to the exclusive jurisdiction of the
              courts in [Your City/State].
            </p>

            <p className='mq-terms-text'>
              If you have any questions or concerns about these terms, please
              contact us through our website.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
