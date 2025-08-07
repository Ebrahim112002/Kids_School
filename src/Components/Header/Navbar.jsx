import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Logo from '../Hooks/Logo';

const MySwal = withReactContent(Swal);

const Navbar = () => {
  const { user, logOut } = useContext(Authcontext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dbUser, setDbUser] = useState(null);

  // Fetch full user (with role) from backend using email
  useEffect(() => {
    if (user?.email) {
      fetch(`https://sc-hool-server.vercel.app/users?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setDbUser(data))
        .catch((err) => console.error('Error fetching user role:', err));
    }
  }, [user?.email]);

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsAdmissionOpen(false);
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

  const handleLogout = async () => {
    try {
      await logOut();
      await MySwal.fire({
        title: 'Logged Out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      navigate('/');
      window.location.reload(); // Refresh the page after navigating to homepage
    } catch (err) {
      console.error('Logout Error:', err);
      await MySwal.fire({
        title: 'Error!',
        text: 'Failed to log out. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const links = (
    <>
      <Link to="/" className={getActive('/', 'text-[rgb(254,163,1)]')}>Home</Link>
      <Link to="/about" className={getActive('/about', 'text-[rgb(93,88,239)]')}>About</Link>
      <Link to="/facilities" className={getActive('/facilities', 'text-[rgb(5,212,223)]')}>Facilities</Link>

      {/* Admission Dropdown */}
      <div
        className="relative group"
        ref={dropdownRef}
        onMouseEnter={() => setIsAdmissionOpen(true)}
        onMouseLeave={() => setIsAdmissionOpen(false)}
      >
        <button
          onClick={() => setIsAdmissionOpen(prev => !prev)}
          className={`${getActive('/admission', 'text-[rgb(1,172,253)]')} flex items-center gap-1`}
        >
          Admission ▾
        </button>
        <div
          className={`absolute top-full mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-50 transition-all duration-200 origin-top
          ${isAdmissionOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
        >
          <Link to="/admission" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admission Form</Link>
          <Link to="/admissionInfo" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admission Info</Link>
        </div>
      </div>

      {/* Dashboard link for all authenticated users */}
      {user && (
        <Link to="/Dashboard" className={getActive('/Dashboard', 'text-green-600')}>
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <div className="mx-auto mt-5">
      <div className="navbar bg-base-100 shadow-md px-18 py-4 rounded-2xl transition-all duration-300">
        {/* Mobile Menu */}
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
           <Logo></Logo>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">
            {links}
          </ul>
        </div>

        {/* Right Side Buttons */}
        <div className="navbar-end flex gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="btn btn-lg bg-red-500 text-white text-xl shadow-md hover:shadow-lg transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-5">
              <Link to="/login">
                <button className="btn btn-lg bg-[rgb(254,163,1)] text-white text-xl shadow-md hover:shadow-lg transition">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="btn btn-lg bg-[rgb(254,163,1)] text-white text-xl shadow-md hover:shadow-lg transition">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;