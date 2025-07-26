import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserTimes, FaSearch, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Faculty = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/users');
      const filtered = res.data.filter(user => user.role === 'teacher');
      setTeachers(filtered);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      MySwal.fire('Error!', 'Failed to load teachers. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const removeFromClass = async (email) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This will remove the teacher from their classes and change their role to user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:3000/users/remove-class/${email}`);
        await fetchTeachers();
        MySwal.fire('Removed!', 'The teacher has been demoted to user.', 'success');
      } catch (error) {
        console.error('Error removing teacher:', error);
        MySwal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    // Search across assignedClasses array or legacy assignedClassName
    const classNames = teacher.assignedClasses?.map(cls => cls.className.toLowerCase()) || [];
    if (teacher.assignedClassName) classNames.push(teacher.assignedClassName.toLowerCase());
    return classNames.some(name => name.includes(searchLower));
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Faculty Management</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by class name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={teacher.photoURL || 'https://via.placeholder.com/40'}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {teacher.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.assignedClasses?.length > 0
                        ? teacher.assignedClasses.map(cls => cls.className).join(', ')
                        : teacher.assignedClassName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.shift || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.subjects?.length > 0 ? teacher.subjects.join(', ') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedTeacher(teacher)}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center"
                        >
                          <FaEye className="mr-2" /> View
                        </button>
                        <button
                          onClick={() => removeFromClass(teacher.email)}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition flex items-center"
                        >
                          <FaUserTimes className="mr-2" /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <div
          onClick={() => setSelectedTeacher(null)}
          className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex flex-col items-center space-y-4">
              <img
                src={selectedTeacher.photoURL || 'https://via.placeholder.com/100'}
                alt={selectedTeacher.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">{selectedTeacher.name}</h3>
              <div className="w-full space-y-2 text-gray-600">
                <p><strong>Email:</strong> {selectedTeacher.email}</p>
                <p><strong>Phone:</strong> {selectedTeacher.phone || 'N/A'}</p>
                <p>
                  <strong>Classes:</strong>{' '}
                  {selectedTeacher.assignedClasses?.length > 0
                    ? selectedTeacher.assignedClasses.map(cls => cls.className).join(', ')
                    : selectedTeacher.assignedClassName || 'N/A'}
                </p>
                <p><strong>Shift:</strong> {selectedTeacher.shift || 'N/A'}</p>
                <p><strong>Subjects:</strong> {selectedTeacher.subjects?.length > 0 ? selectedTeacher.subjects.join(', ') : 'N/A'}</p>
                <p><strong>Joined:</strong> {new Date(selectedTeacher.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Faculty;