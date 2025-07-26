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

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);
    const { name, email, password, phone } = Object.fromEntries(formData.entries());

    try {
      let photoURL = '';
      if (photo) {
        const imgBBFormData = new FormData();
        imgBBFormData.append('image', photo);
        const imgBBResponse = await axios.post(
          'https://api.imgbb.com/1/upload?key=d68b42193a2be1e494279fbc84bf2e52',
          imgBBFormData
        );
        photoURL = imgBBResponse.data.data.url;
      }

      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      await updateUserProfile({ displayName: name, photoURL });

      const userData = { name, email, password, phone, photoURL };

      const response = await axios.post('https://sc-hool-server.vercel.app/users', userData);

      if (response.data.acknowledged) {
        setUser({ ...user, photoURL });

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created.',
          confirmButtonColor: '#3085d6',
        });

        form.reset();
        setPhoto(null);
        navigate(from, { replace: true });
      } else {
        throw new Error('Failed to save user data on backend');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || error.message || 'Please try again.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center py-12 px-6">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 max-w-6xl w-full">
        {/* Form Section */}
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
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
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
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
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
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
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
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="photo" className="block text-sm font-semibold mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
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

        {/* Lottie Animation */}
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