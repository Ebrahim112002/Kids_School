import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import Teachers from './Teachers';

const Teacher = () => {
  const data = useLoaderData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [error, setError] = useState(null);

  // Validate data
  useEffect(() => {
    if (!Array.isArray(data)) {
      setError('Invalid teacher data format. Please try again later.');
    } else {
      setError(null);
    }
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 font-semibold text-lg">Error</p>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter teachers based on search query
  const filteredTeachers = data.filter((teacher) => {
    const query = searchQuery.toLowerCase();
    return (
      teacher.name?.toLowerCase().includes(query) ||
      teacher.position?.toLowerCase().includes(query)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <h1 className="text-center mb-8 font-bold text-5xl text-gray-800 tracking-tight">
        For Any Information Contact Us
      </h1>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="🔍 Search by name or position..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Teachers Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Teachers teacher={teacher} setSelectedTeacher={setSelectedTeacher} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 text-lg">
            {searchQuery ? 'No teachers match your search' : 'No teachers found'}
          </div>
        )}
      </div>

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <motion.div
          onClick={() => setSelectedTeacher(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex flex-col items-center space-y-4">
              <img
                src={selectedTeacher.image || 'https://via.placeholder.com/100'}
                alt={selectedTeacher.name || 'Teacher'}
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
              />
              <h3 className="text-2xl font-semibold text-gray-800">{selectedTeacher.name || 'N/A'}</h3>
              <div className="w-full space-y-3 text-gray-600 text-sm">
                <p><strong>Position:</strong> {selectedTeacher.position}</p>
                <p><strong>Phone:</strong> {selectedTeacher.phone || 'N/A'}</p>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Teacher;