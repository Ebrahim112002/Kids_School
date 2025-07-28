import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const MySwal = withReactContent(Swal);

const Faculty = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [subjects, setSubjects] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [classTime, setClassTime] = useState('');

  console.log('Authcontext user:', JSON.stringify(user, null, 2));
  console.log('Teachers state:', teachers);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/users', {
        headers: { 'x-user-email': user?.email },
      });
      const filtered = res.data.filter(user => user.role === 'teacher' && user.pending !== true);
      setTeachers(filtered);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setFetchError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    if (!user?.email) {
      setFetchError('User not authenticated. Please log in.');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/classes', {
        headers: { 'x-user-email': user.email },
      });
      if (!Array.isArray(response.data)) {
        throw new Error('Classes data is not an array');
      }
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setFetchError(error.message || 'Failed to load classes. Please try again later.');
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchTeachers();
      fetchClasses();
    }
  }, [user]);

  const updateTeacher = async (email, updateData) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${email}?requesterEmail=${user.email}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': user.email,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  };

  const handleUpdateTeacher = async () => {
    if (user?.role !== 'admin') {
      await MySwal.fire('Error!', 'Only admins can update teacher details.', 'error');
      return;
    }
    if (!selectedClasses.length && updateModal && currentTeacher.role !== 'user') {
      await MySwal.fire('Error!', 'Please select at least one class.', 'error');
      return;
    }
    if (currentTeacher.role !== 'user' && (!selectedShift || !subjects || !roomNumber || !classTime)) {
      await MySwal.fire('Error!', 'Please fill in shift, subjects, room number, and class time.', 'error');
      return;
    }

    try {
      const teacherData = currentTeacher.role === 'user' ? {} : {
        assignedClasses: selectedClasses.map(classId => ({
          classId,
          className: classes.find(c => c._id === classId)?.name,
        })),
        shift: selectedShift,
        subjects: subjects.split(',').map(s => s.trim()).filter(s => s),
        roomNumber,
        classTime,
      };

      const result = await updateTeacher(currentTeacher.email, {
        role: currentTeacher.role,
        ...teacherData,
      });

      await fetchTeachers();
      setUpdateModal(false);
      setSelectedClasses([]);
      setSelectedShift('');
      setSubjects('');
      setRoomNumber('');
      setClassTime('');
      await MySwal.fire('Success!', 'Teacher details updated successfully.', 'success');
    } catch (error) {
      await MySwal.fire('Error!', error.response?.data?.error || 'Failed to update teacher.', 'error');
    }
  };

  const handleDeleteTeacher = async (email) => {
    if (user?.role !== 'admin') {
      await MySwal.fire('Error!', 'Only admins can delete teachers.', 'error');
      return;
    }

    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the teacher. This cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/users/${email}?requesterEmail=${user.email}`, {
          headers: { 'x-user-email': user.email },
        });
        await fetchTeachers();
        await MySwal.fire('Deleted!', 'The teacher has been removed.', 'success');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        await MySwal.fire('Error!', error.response?.data?.error || 'Failed to delete teacher.', 'error');
      }
    }
  };

  const openUpdateModal = (teacher) => {
    if (user?.role !== 'admin') {
      MySwal.fire('Error!', 'Only admins can update teacher details.', 'error');
      return;
    }
    setCurrentTeacher({ ...teacher, role: teacher.role });
    setSelectedClasses(teacher.assignedClasses?.map(cls => cls.classId) || []);
    setSelectedShift(teacher.shift || '');
    setSubjects(teacher.subjects?.join(', ') || '');
    setRoomNumber(teacher.roomNumber || '');
    setClassTime(teacher.classTime || '');
    setUpdateModal(true);
  };

  const filteredTeachers = teachers.filter(teacher => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const classNames = teacher.assignedClasses?.map(cls => cls.className.toLowerCase()) || [];
    if (teacher.assignedClassName) classNames.push(teacher.assignedClassName.toLowerCase());
    return classNames.some(name => name.includes(searchLower));
  });

  console.log('Filtered teachers:', filteredTeachers);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-gray-600 font-semibold text-lg">Loading teacher data...</p>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 font-semibold text-lg">Authentication Required</p>
          <p className="text-gray-600 mt-2">Please log in to access this page.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 font-semibold text-lg">{fetchError}</p>
          <p className="text-gray-600 mt-2">Please try again later or contact support.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Faculty Management</h2>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search by class name..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Teachers Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500 text-lg">
            Loading...
          </div>
        ) : filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={teacher.photoURL || 'https://via.placeholder.com/60'}
                  alt={teacher.name || 'Teacher'}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{teacher.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-500">{teacher.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Phone:</strong> {teacher.phone || 'N/A'}</p>
                <p>
                  <strong>Classes:</strong>{' '}
                  {teacher.assignedClasses?.length > 0
                    ? teacher.assignedClasses.map(cls => cls.className).join(', ')
                    : teacher.assignedClassName || 'N/A'}
                </p>
                <p><strong>Shift:</strong> {teacher.shift || 'N/A'}</p>
                <p><strong>Subjects:</strong> {teacher.subjects?.length > 0 ? teacher.subjects.join(', ') : 'N/A'}</p>
                <p><strong>Room:</strong> {teacher.roomNumber || 'N/A'}</p>
                <p><strong>Class Time:</strong> {teacher.classTime || 'N/A'}</p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center justify-center"
                  title="View Details"
                >
                  <FaEye className="mr-2" /> View
                </button>
                {user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => openUpdateModal(teacher)}
                      className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition flex items-center justify-center"
                      title="Update Teacher"
                    >
                      <FaEdit className="mr-2" /> Update
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.email)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition flex items-center justify-center"
                      title="Delete Teacher"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 text-lg">
            {search ? 'No teachers match your search' : 'No teachers found'}
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
                src={selectedTeacher.photoURL || 'https://via.placeholder.com/100'}
                alt={selectedTeacher.name || 'Teacher'}
                className="w-24 h-24 rounded-full object-cover"
              />
              <h3 className="text-2xl font-semibold text-gray-800">{selectedTeacher.name || 'N/A'}</h3>
              <div className="w-full space-y-3 text-gray-600 text-sm">
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
                <p><strong>Room Number:</strong> {selectedTeacher.roomNumber || 'N/A'}</p>
                <p><strong>Class Time:</strong> {selectedTeacher.classTime || 'N/A'}</p>
                <p><strong>Joined:</strong> {new Date(selectedTeacher.createdAt).toLocaleDateString()}</p>
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

      {/* Update Teacher Modal */}
      {updateModal && currentTeacher && (
        <motion.div
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
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Update Teacher Details</h3>
              <button
                onClick={() => {
                  setUpdateModal(false);
                  setSelectedClasses([]);
                  setSelectedShift('');
                  setSubjects('');
                  setRoomNumber('');
                  setClassTime('');
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <img
                  src={currentTeacher.photoURL || 'https://via.placeholder.com/150'}
                  alt={currentTeacher.name || 'Teacher'}
                  className="h-12 w-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">{currentTeacher.name || 'N/A'}</h4>
                  <p className="text-sm text-gray-500">{currentTeacher.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={currentTeacher.role}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="teacher">Teacher</option>
                  <option value="user">User (Demote)</option>
                </select>
              </div>
              {currentTeacher.role === 'teacher' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Classes</label>
                    <select
                      multiple
                      value={selectedClasses}
                      onChange={(e) => setSelectedClasses(Array.from(e.target.selectedOptions, option => option.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple classes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Shift</label>
                    <select
                      value={selectedShift}
                      onChange={(e) => setSelectedShift(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a shift</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma-separated)</label>
                    <input
                      type="text"
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
                      placeholder="e.g., Math, Science, English"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g., Room 101"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Time</label>
                    <input
                      type="text"
                      value={classTime}
                      onChange={(e) => setClassTime(e.target.value)}
                      placeholder="e.g., 9:00 AM - 10:00 AM"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setUpdateModal(false);
                    setSelectedClasses([]);
                    setSelectedShift('');
                    setSubjects('');
                    setRoomNumber('');
                    setClassTime('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTeacher}
                  disabled={currentTeacher.role === 'teacher' && (!selectedClasses.length || !selectedShift || !subjects || !roomNumber || !classTime || loading)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Update Teacher'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Faculty;