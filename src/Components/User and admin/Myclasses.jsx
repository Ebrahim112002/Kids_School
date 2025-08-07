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

        const userRes = await axios.get(`https://sc-hool-server.vercel.app/users/${user.email}`, {
          headers: { 'x-user-email': user.email },
        });
        if (!userRes.data) {
          throw new Error('User not found');
        }
        setFullUser(userRes.data);

        if (userRes.data.role === 'teacher' && Array.isArray(userRes.data.assignedClasses) && userRes.data.assignedClasses.length > 0) {
          const classPromises = userRes.data.assignedClasses.map(cls =>
            axios.get(`https://sc-hool-server.vercel.app/classes/${cls.classId}`, {
              headers: { 'x-user-email': user.email },
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
      <div className="space-y-6">
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
        </div>

        {classesData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Class Details</h3>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
              {classesData.map((cls, index) => {
                const classSubjects = Array.isArray(fullUser.subjects)
                  ? fullUser.subjects.find(subj => subj.classId === cls._id)
                  : null;
                return (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
                    <p>
                      <strong className="text-gray-700">Class Name:</strong> {cls.name || 'Not specified'}
                    </p>
                    <p>
                      <strong className="text-gray-700">Subjects:</strong>{' '}
                      {classSubjects && Array.isArray(classSubjects.subjects) && classSubjects.subjects.length > 0
                        ? classSubjects.subjects.join(', ')
                        : 'Not specified'}
                    </p>
                    <p>
                      <strong className="text-gray-700">Room Number:</strong>{' '}
                      {classSubjects && classSubjects.roomNumber ? classSubjects.roomNumber : 'Not specified'}
                    </p>
                    <p>
                      <strong className="text-gray-700">Class Time:</strong>{' '}
                      {classSubjects && classSubjects.classTime ? classSubjects.classTime : 'Not specified'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Myclasses;