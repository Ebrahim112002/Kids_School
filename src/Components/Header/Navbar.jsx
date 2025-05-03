import React from 'react';
import { Link, NavLink, useLocation } from 'react-router';

const Navbar = () => {

  const location = useLocation();

  const getActive = (path, inactiveColor) => {
    return location.pathname === path
      ? `underline ${inactiveColor} font-bold text-lg hover:bg-gray-200 px-4 py-2 rounded`
      : `${inactiveColor} font-bold text-lg hover:bg-gray-200 px-4 py-2 rounded`;
  };

  const links = (
    <>
      <Link to="/" className={getActive('/', 'text-[rgb(254,163,1)]')}>Home</Link>
      <Link to="/about" className={getActive('/about', 'text-[rgb(93,88,239)]')}>About</Link>
      <Link to="/facilities" className={getActive('/facilities', 'text-[rgb(5,212,223)]')}>Facilities</Link>
      <Link to="/admission" className={getActive('/admission', 'text-[rgb(1,172,253)]')}>Admission</Link>
    </>
  );
  
  
    return (
        <div className='w-[90%] mx-auto mt-5'>
           <div className="navbar bg-base-100 shadow-sm p-6">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {links}
      </ul>
    </div>
    <div className='flex items-center'>
      <img src="https://i.ibb.co.com/Z1Sr8WLQ/logo.png" alt="" />
      <a className="btn btn-ghost text-3xl">SCHOOL</a>
    </div>
    
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    {links}
    </ul>
  </div>
  <div className="navbar-end">
    <a className="btn btn-lg bg-[rgb(254,163,1)] text-white text-xl">Contact </a>
  </div>
</div>
        </div>
    );
};

export default Navbar;