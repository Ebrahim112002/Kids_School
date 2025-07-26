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
        if (user?.email) {
          // Fetch full user info
          const userRes = await axios.get(`https://sc-hool-server.vercel.app/users?email=${user.email}`);
          if (!userRes.data) {
            throw new Error('User not found');
          }
          setFullUser(userRes.data);

          // If user is a teacher, fetch class info for assignedClasses
          if (userRes.data.role === 'teacher' && userRes.data.assignedClasses?.length > 0) {
            const classPromises = userRes.data.assignedClasses.map(cls =>
              axios.get(`https://sc-hool-server.vercel.app/classes/${cls.classId}`)
            );
            const classResponses = await Promise.all(classPromises);
            setClassesData(classResponses.map(res => res.data));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
        You have no classes.
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
            <strong>Teacher Name:</strong> {fullUser.name}
          </p>
          <p>
            <strong>Email:</strong> {fullUser.email}
          </p>
          <p>
            <strong>Phone:</strong> {fullUser.phone || 'Not provided'}
          </p>
          <p>
            <strong>Assigned Classes:</strong>{' '}
            {fullUser.assignedClasses?.length > 0
              ? fullUser.assignedClasses.map(cls => cls.className).join(', ')
              : fullUser.assignedClassName || 'No classes assigned'}
          </p>
          <p>
            <strong>Shift:</strong> {fullUser.shift || 'Not specified'}
          </p>
          <p>
            <strong>Subjects:</strong>{' '}
            {fullUser.subjects?.length > 0 ? fullUser.subjects.join(', ') : 'Not specified'}
          </p>
          <p>
            <strong>Role:</strong> Class Teacher
          </p>
          <p>
            <strong>Joined:</strong> {new Date(fullUser.createdAt).toLocaleDateString()}
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
                    <strong>Class Name:</strong> {cls.name}
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