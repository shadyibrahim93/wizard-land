import SignUpModal from '../authModals/signUpModal.js';
import SignInModal from '../authModals/signInModal.js';

const AuthModals = ({
  showSignUpModal,
  setShowSignUpModal,
  showSignInModal,
  setShowSignInModal,
  onSignUpSuccess
}) => {
  return (
    <>
      {showSignUpModal && (
        <SignUpModal
          showSignUpModal={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          onSignUpSuccess={onSignUpSuccess}
        />
      )}
      {showSignInModal && (
        <SignInModal
          showSignInModal={showSignInModal}
          onClose={() => setShowSignInModal(false)}
        />
      )}
    </>
  );
};

export default AuthModals;
