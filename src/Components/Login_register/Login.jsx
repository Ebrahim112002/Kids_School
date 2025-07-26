import React, { useContext, useState } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import login_json from '../../assets/Login.json';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { signIn, setUser } = useContext(Authcontext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn(email, password);
      setUser(result.user);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to the portal.',
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="bg-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10 bg-white shadow-lg rounded-lg p-6">
        {/* Lottie Animation Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2"
        >
          <Lottie animationData={login_json} loop className="w-full h-[400px]" />
        </motion.div>

        {/* Form Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Login to Your Account
          </h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition duration-300"
            >
              Login
            </button>
            <div className="mt-4 text-center">
              <Link
                to="/register"
                className="text-blue-600 hover:underline hover:text-blue-700 font-semibold text-sm"
              >
                Don't have an account? Create now
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;