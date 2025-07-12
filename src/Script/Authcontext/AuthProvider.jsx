import React, { useEffect, useState } from 'react';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  
} from 'firebase/auth';
import { auth } from '../firebase.init';
import { Authcontext } from './Authcontext';
// adjust if path differs

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
    logOut
  };

  return (
    <Authcontext value={authInfo}>
      {children}</Authcontext>
  );
};

export default AuthProvider;
