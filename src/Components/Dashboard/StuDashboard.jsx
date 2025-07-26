import React, { useEffect, useState, useContext } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import { motion } from 'framer-motion';
import { FaUserCircle, FaExclamationCircle } from 'react-icons/fa';

const StuDashboard = () => {
  const { user } = useContext(Authcontext);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://sc-hool-server.vercel.app/student?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No student data found');
        }
        setStudentData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  if (loading) {
    return (
      <div className=" flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-700">Loading your profile...</p>
        </div>
      </div>
    );
  }
 

  if (error || !studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaExclamationCircle className="text-red-600 text-4xl mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-lg">{error || 'No student data found.'}</p>
          <p className="text-gray-600 mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }
 console.log(studentData)
  return (
    <div className=" bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-blue-600 text-white p-6 text-center">
          <h2 className="text-3xl font-bold">Welcome, {studentData.name}</h2>
          <p className="text-sm mt-2 opacity-80">Your Student Profile</p>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {studentData.photoURL ? (
                <img
                  src={studentData.photoURL}
                  alt={studentData.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 md:w-40 md:h-40 text-gray-300" />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Email</span>
                <p className="text-gray-800">{studentData.email}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Phone</span>
                <p className="text-gray-800">{studentData.phone}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Date of Birth</span>
                <p className="text-gray-800">{studentData.dob || 'Not provided'}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Gender</span>
                <p className="text-gray-800">{studentData.gender || 'Not provided'}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Class</span>
                <p className="text-gray-800">{studentData.className || 'Not provided'}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Parent Name</span>
                <p className="text-gray-800">{studentData.parentName || 'Not provided'}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Address</span>
                <p className="text-gray-800">{studentData.address || 'Not provided'}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500">Registration No</span>
                <p className="text-gray-800">{studentData.registrationNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StuDashboard;