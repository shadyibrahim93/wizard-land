import SignUpModal from '../authModals/signUpModal';
import SignInModal from '../authModals/signInModal';

const AuthModals = ({
  showSignUpModal,
  setShowSignUpModal,
  showSignInModal,
  setShowSignInModal
}) => {
  return (
    <>
      {showSignUpModal && (
        <SignUpModal
          showSignUpModal={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
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
