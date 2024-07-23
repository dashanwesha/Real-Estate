import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../../redux/user/userSlice';

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to sign in with Google: ${res.statusText}`);
      }

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error('Could not sign in with Google:', error.message, error);
      // Add more detailed error handling if needed
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 p-3 rounded-lg text-white uppercase hover:opacity-95 w-full'
    >
      Continue with Google
    </button>
  );
};

export default GoogleAuth;
