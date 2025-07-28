import React, { useContext } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import { FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const { user } = useContext(Authcontext);
console.log(user)
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Welcome , {user?.name || 'User'} 🎓</h1>
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
          EduManage Pro is your all-in-one platform for managing academic activities and communication. Whether you're a student, teacher, or administrator, everything you need is just a click away in the sidebar.
        </p>
      </motion.div>

      {/* Informational / Notice Box */}
      <motion.div 
        className="bg-indigo-50 border-l-4 border-indigo-400 p-5 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-indigo-500 text-xl mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-indigo-800">Notice</h2>
            <p className="text-sm text-indigo-700 mt-1">
              Please ensure your information is up to date. Important announcements, schedules, and class-related updates will appear in your assigned sections. If you encounter any issues, reach out to your administrator or use the help section.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Optional Tip Box */}
      <motion.div 
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          👉 Tip: Use the sidebar to navigate between sections like your profile, classes, faculty, or student records based on your role. The interface is designed to be intuitive and role-based for a smoother experience.
        </p>
      </motion.div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-400 pt-10">
        © {new Date().getFullYear()} EduManage Pro. Empowering smarter education.
      </div>
    </div>
  );
};

export default DashboardHome;
