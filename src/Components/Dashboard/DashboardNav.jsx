import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUser, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaBook, 
  FaBars,
  FaTimes,
  FaGraduationCap
} from 'react-icons/fa';
import Logo from '../Hooks/Logo';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import axios from 'axios'; // Import axios for API calls

const DashboardNav = () => {
  const { user } = useContext(Authcontext);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to store user role
  const location = useLocation();

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsOpen(true);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user role from backend using email
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get('http://localhost:3000/users', {
            params: { email: user.email } // Send email as query parameter
          });
          // Assuming response.data contains the role or user object with role
          const role = response.data.role || response.data[0]?.role || 'user'; // Fallback to 'user' if role not found
          setUserRole(role.toLowerCase());
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Fallback to 'user' role on error
        }
      }
    };

    fetchUserRole();
  }, [user]); // Run when user changes

  // Define all possible nav items
  const navItems = [
    { name: 'Home', icon: <FaHome className="text-lg" />, to: '/' },
    { name: 'Profile', icon: <FaUser className="text-lg" />, to: 'profile' },
    { name: 'My Classes', icon: <FaBook className="text-lg" />, to: 'myclass' },
    { name: 'Students', icon: <FaGraduationCap className="text-lg" />, to: 'allstudent' },
    { name: 'Faculty', icon: <FaChalkboardTeacher className="text-lg" />, to: 'faculty' },
    { name: 'Users', icon: <FaUsers className="text-lg" />, to: 'alluser' },
  ];

  // Filter nav items based on user role
  const filteredNavItems = () => {
    if (!userRole) return []; // Return empty array until role is fetched

    switch (userRole) {
      case 'admin':
        return navItems; // Admin sees all items
      case 'teacher':
        return navItems.filter(item => 
          ['Home', 'Profile', 'My Classes'].includes(item.name)
        );
      case 'user':
        return navItems.filter(item => 
          ['Home', 'Profile'].includes(item.name)
        );
      default:
        return navItems; // Fallback to all items for unknown roles
    }
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 400, damping: 40 } }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed lg:relative w-64 h-full bg-white text-gray-800 shadow-lg z-40 border-r border-gray-200"
          >
            <div className="p-5 flex flex-col h-full">
              <div className="mb-8 px-4 py-6 border-b border-gray-100">
                <Logo />
              </div>

              <nav className="flex-1">
                <ul className="space-y-1">
                  {filteredNavItems().map((item) => {
                    const isActive = location.pathname === `/dashboard/${item.to}` || 
                                    (item.to === '' && location.pathname === '/dashboard');
                    
                    return (
                      <motion.li
                        key={item.to}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <NavLink
                          to={item.to}
                          end
                          className={({ isActive }) => 
                            `flex items-center p-3 rounded-lg transition-all ${
                              isActive
                                ? 'bg-indigo-50 text-indigo-600 font-medium'
                                : 'hover:bg-gray-100 text-gray-600'
                            }`
                          }
                          onClick={() => isMobile && setIsOpen(false)}
                        >
                          {({ isActive }) => (
                            <>
                              <span className={`mr-3 ${isActive ? 'text-indigo-500' : 'text-gray-500'}`}>
                                {item.icon}
                              </span>
                              <span>{item.name}</span>
                              {isActive && (
                                <motion.span 
                                  layoutId="activeIndicator"
                                  className="ml-auto w-1.5 h-6 bg-indigo-500 rounded-full"
                                />
                              )}
                            </>
                          )}
                        </NavLink>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 px-2">
                  © {new Date().getFullYear()} EduManage Pro
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - This renders the child routes */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardNav;