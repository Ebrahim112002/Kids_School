// AuthProvider.jsx
import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase.init';
import { Authcontext } from './Authcontext';
import Swal from 'sweetalert2';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create User Function
  const createUser = async (email, password, name, phone, photoURL = '') => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL,
      });

      // Force refresh Firebase token
      await userCredential.user.getIdToken(true);
      await userCredential.user.reload();
      const updatedUser = auth.currentUser;
      console.log('Firebase user after reload:', {
        uid: updatedUser.uid,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
      });

      // Create user in backend
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        photoURL: photoURL || '',
        role: 'user',
        createdAt: new Date(),
      };
      console.log('Sending to backend:', payload);

      const backendResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        if (errorData.error !== 'Email already registered') {
          throw new Error(errorData.error || 'Backend user creation failed');
        }
      }

      // Wait briefly to ensure MongoDB write is committed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch user from backend
      const userResponse = await fetch(`http://localhost:3000/users/${encodeURIComponent(email)}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch created user data');
      }
      const userData = await userResponse.json();
      console.log('Fetched backend user:', userData);

      const completeUser = {
        uid: updatedUser.uid,
        email: updatedUser.email || email,
        displayName: updatedUser.displayName || name,
        phone: userData.phone || phone,
        photoURL: updatedUser.photoURL || photoURL,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt,
      };

      console.log('Setting user state:', completeUser);
      setUser(completeUser);
      localStorage.setItem('user', JSON.stringify(completeUser));

      return completeUser;
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign In Function
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Get backend data
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const backendResponse = await response.json();
      if (!response.ok) {
        throw new Error(backendResponse.error || 'Failed to fetch user data from backend');
      }

      const mergedUser = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        name: backendResponse.name || userCredential.user.displayName || 'Temporary User',
        photoURL: userCredential.user.photoURL || backendResponse.photoURL || '',
        role: backendResponse.role || 'user',
        phone: backendResponse.phone || '',
        createdAt: backendResponse.createdAt,
      };

      setUser(mergedUser);
      localStorage.setItem('user', JSON.stringify(mergedUser));
      localStorage.setItem('userEmail', mergedUser.email);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    return signOut(auth).finally(() => setLoading(false));
  };

  // Update user profile manually
  const updateUserProfile = (profile) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error('No user is currently signed in'));
    }
    return updateProfile(auth.currentUser, profile);
  };

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const email = currentUser.email;
          localStorage.setItem('userEmail', email);

          // Log Firebase user data
          console.log('Firebase currentUser:', {
            email: currentUser.email,
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          });

          // Fetch user from backend with retry
          let backendUser = {};
          let attempts = 0;
          const maxAttempts = 3;
          const retryDelay = 1000;

          while (attempts < maxAttempts) {
            const res = await fetch(`http://localhost:3000/users/${encodeURIComponent(email)}`, {
              headers: { 'x-user-email': email },
            });

            if (res.ok) {
              backendUser = await res.json();
              console.log('Backend user fetched:', backendUser);
              break;
            } else if (res.status === 404 && attempts < maxAttempts - 1) {
              console.log(`User not found in backend, retrying (attempt ${attempts + 1}/${maxAttempts})...`);
              attempts++;
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
              const errorData = await res.json();
              throw new Error(errorData.error || 'Failed to fetch user data after retries');
            }
          }

          // Only create new user if still not found after retries
          if (!backendUser.name) {
            console.log('User not found after retries, creating new user...');
            const newUser = {
              name: currentUser.displayName || 'Temporary User',
              email,
              phone: currentUser.phoneNumber || '00000000000',
              photoURL: currentUser.photoURL || '',
              role: 'user',
              createdAt: new Date(),
            };
            const createRes = await fetch('http://localhost:3000/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser),
            });
            if (createRes.ok) {
              backendUser = await createRes.json();
              console.log('Created backend user:', backendUser);
            } else {
              const errorData = await createRes.json();
              throw new Error(errorData.error || 'Failed to create user in backend');
            }
          }

          // Merge Firebase and backend data
          const mergedUser = {
            email,
            uid: currentUser.uid,
            name: backendUser.name || currentUser.displayName || 'Temporary User',
            photoURL: backendUser.photoURL || currentUser.photoURL || '',
            role: backendUser.role || 'user',
            phone: backendUser.phone || currentUser.phoneNumber || '00000000000',
            createdAt: backendUser.createdAt || new Date(),
          };

          console.log('Merged user in onAuthStateChanged:', mergedUser);
          setUser(mergedUser);
          localStorage.setItem('user', JSON.stringify(mergedUser));
        } catch (error) {
          console.error('Error fetching user data:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch user data from backend. Using Firebase data.',
            confirmButtonColor: '#d33',
          });
          const fallbackUser = {
            email: currentUser.email,
            uid: currentUser.uid,
            name: currentUser.displayName || 'Temporary User',
            photoURL: currentUser.photoURL || '',
            role: 'user',
            phone: currentUser.phoneNumber || '00000000000',
            createdAt: new Date(),
          };
          setUser(fallbackUser);
          localStorage.setItem('user', JSON.stringify(fallbackUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    setUser,
    logOut,
    updateUserProfile,
  };

  return (
    <Authcontext.Provider value={authInfo}>
      {children}
    </Authcontext.Provider>
  );
};

export default AuthProvider;