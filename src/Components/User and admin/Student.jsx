import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUserTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const MySwal = withReactContent(Swal);

const Student = () => {
  const { user, loading: authLoading } = useContext(Authcontext);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  console.log('Authcontext user:', JSON.stringify(user, null, 2));
  console.log('Students state:', students);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get('http://localhost:3000/users', {
        headers: { 'x-user-email': user?.email },
      });
      const filteredUsers = userRes.data.filter(user => user.role === 'student' && user.pending !== true);

      const studentRes = await axios.get('http://localhost:3000/student/all', {
        headers: { 'x-user-email': user?.email },
      });

      const mergedStudents = filteredUsers.map(user => {
        const studentData = studentRes.data.find(s => s.email === user.email) || {};
        return {
          ...user,
          registrationNumber: studentData.registrationNumber || user.registrationNumber || 'N/A',
          className: studentData.className || user.className || 'N/A',
        };
      });

      setStudents(mergedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      setFetchError('Failed to load students. Please try again.');
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
      fetchStudents();
      fetchClasses();
    }
  }, [user]);

  const updateStudent = async (email, updateData) => {
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
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const handleUpdateStudent = async () => {
    if (user?.role !== 'admin') {
      await MySwal.fire('Error!', 'Only admins can update student details.', 'error');
      return;
    }
    if (currentStudent.role === 'student' && (!name || !registrationNumber || !className)) {
      await MySwal.fire('Error!', 'Please fill in name, registration number, and class.', 'error');
      return;
    }

    try {
      const studentData = currentStudent.role === 'user' ? {} : {
        name,
        phone,
        registrationNumber,
        className,
      };

      await updateStudent(currentStudent.email, {
        role: currentStudent.role,
        ...studentData,
      });

      if (currentStudent.role === 'student') {
        await axios.patch(`http://localhost:3000/student?email=${currentStudent.email}`, {
          name,
          registrationNumber,
          className,
        });
      } else {
        await axios.delete(`http://localhost:3000/student?email=${currentStudent.email}`);
      }

      await fetchStudents();
      setUpdateModal(false);
      setName('');
      setPhone('');
      setRegistrationNumber('');
      setClassName('');
      await MySwal.fire('Success!', 'Student details updated successfully.', 'success');
    } catch (error) {
      await MySwal.fire('Error!', error.response?.data?.error || 'Failed to update student.', 'error');
    }
  };

  const removeStudent = async (student) => {
    if (user?.role !== 'admin') {
      await MySwal.fire('Error!', 'Only admins can remove students.', 'error');
      return;
    }

    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This student will be removed and demoted to user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/student?email=${student.email}`);
        await axios.patch(`http://localhost:3000/users/remove-class/${student.email}`, {}, {
          headers: { 'x-user-email': user.email },
        });
        setStudents(prev => prev.filter(s => s.email !== student.email));
        await MySwal.fire('Removed!', 'The student has been removed.', 'success');
      } catch (error) {
        console.error('Error removing student:', error);
        await MySwal.fire('Error!', error.response?.data?.error || 'Something went wrong.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

 // In Student.jsx, update the handleDeleteStudent function
const handleDeleteStudent = async (email) => {
  if (user?.role !== 'admin') {
    await MySwal.fire('Error!', 'Only admins can delete students.', 'error');
    return;
  }

  const result = await MySwal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the student. This cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete!',
  });

  if (result.isConfirmed) {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/users/${email}`, {
        headers: { 
          'x-user-email': user.email,
          'Content-Type': 'application/json'
        },
        params: {
          requesterEmail: user.email
        }
      });
      await axios.delete(`http://localhost:3000/student`, {
        headers: { 
          'x-user-email': user.email,
          'Content-Type': 'application/json'
        },
        params: {
          email: email,
          requesterEmail: user.email
        }
      });
      setStudents(prev => prev.filter(s => s.email !== email));
      await MySwal.fire('Deleted!', 'The student has been removed.', 'success');
    } catch (error) {
      console.error('Error deleting student:', error);
      await MySwal.fire('Error!', error.response?.data?.error || 'Failed to delete student.', 'error');
    } finally {
      setLoading(false);
    }
  }
};

  const openUpdateModal = (student) => {
    if (user?.role !== 'admin') {
      MySwal.fire('Error!', 'Only admins can update student details.', 'error');
      return;
    }
    setCurrentStudent({ ...student, role: student.role });
    setName(student.name || '');
    setPhone(student.phone || '');
    setRegistrationNumber(student.registrationNumber || '');
    setClassName(student.className || '');
    setUpdateModal(true);
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name?.toLowerCase().includes(query) ||
      student.registrationNumber?.toString().includes(query)
    );
  });

  console.log('Filtered students:', filteredStudents);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-gray-600 font-semibold text-lg">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 font-semibold text-lg">Authentication Required</p>
          <p className="text-gray-600 mt-2">Please log in to access this page.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
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
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 font-semibold text-lg">{fetchError}</p>
          <p className="text-gray-600 mt-2">Please try again later or contact support.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
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
      <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">🎓 Student Management</h2>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="🔍 Search by name or registration number..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Students Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500 text-lg">
            Loading...
          </div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100 hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={student.photoURL || 'https://via.placeholder.com/60'}
                  alt={student.name || 'Student'}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-200"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{student.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-500 truncate">{student.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Registration:</strong> {student.registrationNumber}</p>
                <p><strong>Phone:</strong> {student.phone || 'N/A'}</p>
                <p><strong>Class:</strong> {student.className}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center justify-center text-sm"
                  title="View Details"
                >
                  <FaEye className="mr-1.5 text-base" /> View
                </button>
                {user?.role === 'admin' && (
                  <>
                    <button
                      onClick={() => openUpdateModal(student)}
                      className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition flex items-center justify-center text-sm"
                      title="Update Student"
                    >
                      <FaEdit className="mr-1.5 text-base" /> Update
                    </button>
                    <button
                      onClick={() => removeStudent(student)}
                      className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition flex items-center justify-center text-sm"
                      title="Remove Student (Demote to User)"
                    >
                      <FaUserTimes className="mr-1.5 text-base" /> Remove
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.email)}
                      className="px-3 py-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition flex items-center justify-center text-sm"
                      title="Delete Student"
                    >
                      <FaTrash className="mr-1.5 text-base" /> Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 text-lg">
            {searchQuery ? 'No students match your search' : 'No students found'}
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <motion.div
          onClick={() => setSelectedStudent(null)}
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
                src={selectedStudent.photoURL || 'https://via.placeholder.com/100'}
                alt={selectedStudent.name || 'Student'}
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
              />
              <h3 className="text-2xl font-semibold text-gray-800">{selectedStudent.name || 'N/A'}</h3>
              <div className="w-full space-y-3 text-gray-600 text-sm">
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>Registration:</strong> {selectedStudent.registrationNumber}</p>
                <p><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</p>
                <p><strong>Class:</strong> {selectedStudent.className}</p>
                <p><strong>Joined:</strong> {new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Update Student Modal */}
      {updateModal && currentStudent && (
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
              <h3 className="text-2xl font-bold text-gray-800">Update Student Details</h3>
              <button
                onClick={() => {
                  setUpdateModal(false);
                  setName('');
                  setPhone('');
                  setRegistrationNumber('');
                  setClassName('');
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <img
                  src={currentStudent.photoURL || 'https://via.placeholder.com/150'}
                  alt={currentStudent.name || 'Student'}
                  className="h-12 w-12 rounded-full object-cover mr-3 border-2 border-blue-200"
                />
                <div>
                  <h4 className="font-semibold text-lg text-gray-800">{currentStudent.name || 'N/A'}</h4>
                  <p className="text-sm text-gray-500">{currentStudent.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={currentStudent.role}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="student">Student</option>
                  <option value="user">User (Demote)</option>
                </select>
              </div>
              {currentStudent.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="Enter registration number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a class</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls.name}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setUpdateModal(false);
                    setName('');
                    setPhone('');
                    setRegistrationNumber('');
                    setClassName('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStudent}
                  disabled={currentStudent.role === 'student' && (!name || !registrationNumber || !className || loading)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Update Student'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Student;