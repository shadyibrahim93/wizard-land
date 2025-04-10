import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import SignUpModal from '../pages/signUpModal';
import SignInModal from '../pages/signInModal';
import { signOut } from '../apiService';

export default function Header({
  title,
  backTarget,
  level,
  suppressLevel,
  showSignUpLink,
  showSignInLink
}) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [userFullName, setUserFullName] = useState(''); // Track the user's full name

  useEffect(() => {
    // Check if the user is already signed in using localStorage
    const user = JSON.parse(localStorage.getItem('userFullName'));
    if (user && new Date().getTime() < user.expirationTime) {
      setUserFullName(user.fullName); // Set the user full name from localStorage if valid
    } else {
      localStorage.removeItem('userFullName'); // Remove expired user data
    }
  }, []);

  const handleLogout = () => {
    setUserFullName(''); // Clear the user full name from state
    localStorage.removeItem('userFullName'); // Remove user data from localStorage
    signOut(); // Sign the user out from Supabase
  };

  // Function to set the user's full name after sign-in
  const handleSignInSuccess = (fullName) => {
    setUserFullName(fullName); // Update the state with full name
    setShowSignInModal(false); // Close the modal
  };

  return (
    <>
      {/* Show User's Full Name if logged in */}
      {userFullName && (
        <div className='mq-user-greeting'>
          <h3>Welcome, {userFullName}!</h3>
        </div>
      )}
      <header>
        <div className='mq-header-container'>
          {backTarget ? (
            <Link
              to={`${backTarget}`}
              className='mq-back-arrow'
            >
              ← Games
            </Link>
          ) : null}
          <h1>{title}</h1>
          {!suppressLevel && <h2 className='mq-level'>Level {level}</h2>}
          {suppressLevel && (
            <div>
              {showSignUpLink && !userFullName && (
                <Button
                  text='Sign Up'
                  onClick={() => setShowSignUpModal(true)}
                />
              )}
              {/* Show Log In Button if not logged in */}
              {showSignInLink && !userFullName && (
                <Button
                  text='Log In'
                  onClick={() => setShowSignInModal(true)}
                />
              )}
            </div>
          )}
          {suppressLevel && userFullName && (
            <Button
              text='Log Out'
              onClick={handleLogout}
            />
          )}
        </div>

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
            setUserFullName={handleSignInSuccess} // Pass the success handler
          />
        )}
      </header>
    </>
  );
}
