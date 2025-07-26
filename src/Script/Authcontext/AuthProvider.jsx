import React, { useEffect, useState } from 'react';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
   // <-- import updateProfile from firebase/auth
} from 'firebase/auth';
import { auth } from '../firebase.init';
import { Authcontext } from './Authcontext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user (Signup)
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in (Login)
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out (Logout)
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update user profile (name, photoURL)
  const updateUserProfile = (profile) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error('No user is currently signed in'));
    }
    return updateProfile(auth.currentUser, profile);
  };

  // Observer (Track logged-in user)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // clean up
  }, []);

  // Values to share globally
  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    setUser,
    logOut,
    updateUserProfile, // expose updateUserProfile method here
  };

  return (
    <Authcontext.Provider value={authInfo}>
      {children}
    </Authcontext.Provider>
  );
};

export default AuthProvider;
