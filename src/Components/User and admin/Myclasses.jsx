import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const Myclasses = () => {
  const { user } = useContext(Authcontext);
  const [fullUser, setFullUser] = useState(null);
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.email) {
          throw new Error('User email not available');
        }

        // Fetch full user info with authentication header
        const userRes = await axios.get(`http://localhost:3000/users/${user.email}`, {
          headers: { 'x-user-email': user.email }
        });
        if (!userRes.data) {
          throw new Error('User not found');
        }
        setFullUser(userRes.data);

        // If user is a teacher, fetch class info for assignedClasses
        if (userRes.data.role === 'teacher' && Array.isArray(userRes.data.assignedClasses) && userRes.data.assignedClasses.length > 0) {
          const classPromises = userRes.data.assignedClasses.map(cls =>
            axios.get(`http://localhost:3000/classes/${cls.classId}`, {
              headers: { 'x-user-email': user.email }
            })
          );
          const classResponses = await Promise.all(classPromises);
          setClassesData(classResponses.map(res => res.data));
        } else {
          setClassesData([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-4xl mx-auto text-center text-red-600"
      >
        Please log in to view class information.
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-4xl mx-auto text-center text-gray-600"
      >
        Loading class info...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-4xl mx-auto text-center text-red-600"
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!fullUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-4xl mx-auto text-center text-red-600"
      >
        User data not found.
      </motion.div>
    );
  }

  if (fullUser.role !== 'teacher') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 max-w-4xl mx-auto text-center text-gray-600"
      >
        You are not a teacher. Only teachers can view class information.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Class Information</h2>
      <div className="space-y-4">
        {/* Display teacher details */}
        <div className="space-y-2">
          <p>
            <strong className="text-gray-700">Teacher Name:</strong> {fullUser.name || 'Not provided'}
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong> {fullUser.email || 'Not provided'}
          </p>
          <p>
            <strong className="text-gray-700">Phone:</strong> {fullUser.phone || 'Not provided'}
          </p>
          <p>
            <strong className="text-gray-700">Role:</strong> Class Teacher
          </p>
          <p>
            <strong className="text-gray-700">Shift:</strong> {fullUser.shift || 'Not specified'}
          </p>
          <p>
            <strong className="text-gray-700">Subjects:</strong>{' '}
            {Array.isArray(fullUser.subjects) && fullUser.subjects.length > 0 
              ? fullUser.subjects.join(', ') 
              : 'Not specified'}
          </p>
          <p>
            <strong className="text-gray-700">Assigned Classes:</strong>{' '}
            {Array.isArray(fullUser.assignedClasses) && fullUser.assignedClasses.length > 0
              ? fullUser.assignedClasses.map(cls => cls.className).join(', ')
              : 'No classes assigned'}
          </p>
          <p>
            <strong className="text-gray-700">Room Number:</strong> {fullUser.roomNumber || 'Not specified'}
          </p>
          <p>
            <strong className="text-gray-700">Class Time:</strong> {fullUser.classTime || 'Not specified'}
          </p>
          <p>
            <strong className="text-gray-700">Joined:</strong>{' '}
            {fullUser.createdAt ? new Date(fullUser.createdAt).toLocaleDateString() : 'Not specified'}
          </p>
        </div>

        {/* Display class details (if available) */}
        {classesData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Class Details</h3>
            <ul className="space-y-2">
              {classesData.map((cls, index) => (
                <li key={index} className="border-b border-gray-200 pb-2">
                  <p>
                    <strong className="text-gray-700">Class Name:</strong> {cls.name || 'Not specified'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Myclasses;