import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const Navbar = () => {
  const { user, logOut } = useContext(Authcontext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActive = (path, color) => {
    return location.pathname === path
      ? `underline ${color} font-bold text-lg hover:bg-gray-200 px-4 py-2 rounded transition`
      : `${color} font-semibold text-lg hover:bg-gray-100 px-4 py-2 rounded transition`;
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Logout Error:', err);
      });
  };

  const links = (
    <>
      <Link to="/" className={getActive('/', 'text-[rgb(254,163,1)]')}>Home</Link>
      <Link to="/about" className={getActive('/about', 'text-[rgb(93,88,239)]')}>About</Link>
      <Link to="/facilities" className={getActive('/facilities', 'text-[rgb(5,212,223)]')}>Facilities</Link>
      <Link to="/admission" className={getActive('/admission', 'text-[rgb(1,172,253)]')}>Registration</Link>

      {user && (
        <Link to="/StuDashboard" className={getActive('/StuDashboard', 'text-green-600')}>
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <div className="mx-auto mt-5">
      <div className="navbar bg-base-100 shadow-md px-18 py-4 rounded-2xl transition-all duration-300">
        {/* Logo and Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {links}
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://i.ibb.co.com/Z1Sr8WLQ/logo.png" alt="Logo" className="w-10 h-10" />
            <span className="text-3xl font-bold text-blue-800">SCHOOL</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">
            {links}
          </ul>
        </div>

        {/* Right Side Buttons */}
        <div className="navbar-end flex gap-3 relative" ref={dropdownRef}>
          {user ? (
            <button
              onClick={handleLogout}
              className="btn btn-lg bg-red-500 text-white text-xl shadow-md hover:shadow-lg transition"
            >
              Logout
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="btn btn-lg bg-[rgb(254,163,1)] text-white text-xl flex items-center gap-2 shadow-md hover:shadow-lg transition"
              >
                Login
                <FiChevronDown
                  className={`transform transition duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Animated Dropdown */}
              <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 transform transition-all duration-300 origin-top ${
                isDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
              }`}>
                <button onClick={() => navigate("/login/admin")} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition">Admin Login</button>
                <button onClick={() => navigate("/login/teacher")} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition">Teacher Login</button>
                <button onClick={() => navigate("/login/student")} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition">Student Login</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
