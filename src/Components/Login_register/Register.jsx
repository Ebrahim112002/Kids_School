import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import Swal from 'sweetalert2';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import registration_json from '../../assets/form registration.json';

const Register = () => {
  const { createUser, setUser, updateUserProfile } = useContext(Authcontext);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: 'Please upload a valid image (JPEG, PNG, or GIF)' }));
      setPhoto(null);
    } else {
      setErrors((prev) => ({ ...prev, photo: '' }));
      setPhoto(file);
    }
  };

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!formData.phone || !/^[0-9]{11}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 11 digits';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  const form = e.target;
  const formData = new FormData(form);
  const userData = Object.fromEntries(formData.entries());

  const validationErrors = validateForm(userData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setLoading(false);
    return;
  }

  try {
    let photoURL = '';
    if (photo) {
      try {
        const imgBBFormData = new FormData();
        imgBBFormData.append('image', photo);
        const imgBBResponse = await axios.post(
          'https://api.imgbb.com/1/upload?key=d68b42193a2be1e494279fbc84bf2e52',
          imgBBFormData
        );
        if (imgBBResponse.data.success) {
          photoURL = imgBBResponse.data.data.url;
        }
      } catch (imgError) {
        console.error('ImgBB upload error:', imgError);
        Swal.fire({
          icon: 'warning',
          title: 'Photo Upload Failed',
          text: 'Failed to upload profile photo. Continuing without photo.',
          confirmButtonColor: '#3085d6',
        });
      }
    }

    // Create user in Firebase and backend
    const userCredential = await createUser(
      userData.email.trim(),
      userData.password,
      userData.name.trim(),
      userData.phone.trim(),
      photoURL
    );

    // Update user profile in Firebase
    await updateUserProfile({
      displayName: userData.name.trim(),
      photoURL,
    });

    // Get the complete user data from backend
    const response = await fetch(`http://localhost:3000/users/${encodeURIComponent(userData.email)}`, {
      headers: { 'x-user-email': userData.email },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data from backend');
    }

    const backendUser = await response.json();

    // Set the complete user object in context
    setUser({
      ...userCredential.user,
      ...backendUser
    });

    Swal.fire({
      icon: 'success',
      title: 'Registration Successful',
      text: 'Your account has been created.',
      confirmButtonColor: '#3085d6',
    });

    form.reset();
    setPhoto(null);
    navigate(from, { replace: true });
  } catch (error) {
    console.error('Registration error:', error);
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please use a different email or log in.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format. Please check your email.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
      }
    } else if (error.message.includes('Failed to fetch user data')) {
      errorMessage = 'Account created but profile data could not be loaded. Please refresh the page.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: errorMessage,
      confirmButtonColor: '#d33',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center py-12 px-6">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Register Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                required
                onInvalid={(e) => e.target.setCustomValidity('Please enter a valid name')}
                onInput={(e) => e.target.setCustomValidity('')}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                onInvalid={(e) => e.target.setCustomValidity('Please enter a valid email address')}
                onInput={(e) => e.target.setCustomValidity('')}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter a secure password"
                required
                minLength={6}
                onInvalid={(e) => e.target.setCustomValidity('Password must be at least 6 characters long')}
                onInput={(e) => e.target.setCustomValidity('')}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="01XXXXXXXXX"
                required
                pattern="[0-9]{11}"
                onInvalid={(e) => e.target.setCustomValidity('Phone number must be exactly 11 digits')}
                onInput={(e) => e.target.setCustomValidity('')}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="photo" className="block text-sm font-semibold mb-1">
                Profile Photo (Optional)
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/jpeg,image/png,image/gif"
                onChange={handlePhotoChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.photo ? 'border-red-500' : ''
                }`}
              />
              {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:underline hover:text-blue-700 font-semibold text-sm"
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[450px] flex justify-center"
        >
          <Lottie animationData={registration_json} loop className="w-full h-[400px] lg:h-[500px]" />
        </motion.div>
      </div>
    </div>
  );
};

export default Register;