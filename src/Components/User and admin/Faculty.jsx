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
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [classSubjects, setClassSubjects] = useState({});
  const [classRoomNumbers, setClassRoomNumbers] = useState({});
  const [classTimes, setClassTimes] = useState({});

  console.log('Authcontext user:', JSON.stringify(user, null, 2));
  console.log('Teachers state:', teachers);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://sc-hool-server.vercel.app/users', {
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
      const response = await axios.get('https://sc-hool-server.vercel.app/classes', {
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
        `https://sc-hool-server.vercel.app/users/${email}?requesterEmail=${user.email}`,
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

  const handleClassSelection = (e) => {
    const newSelectedClasses = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedClasses(newSelectedClasses);
    setClassSubjects(prev => {
      const updatedSubjects = { ...prev };
      newSelectedClasses.forEach(classId => {
        if (!updatedSubjects[classId]) updatedSubjects[classId] = '';
      });
      Object.keys(updatedSubjects).forEach(classId => {
        if (!newSelectedClasses.includes(classId)) delete updatedSubjects[classId];
      });
      return updatedSubjects;
    });
    setClassRoomNumbers(prev => {
      const updatedRooms = { ...prev };
      newSelectedClasses.forEach(classId => {
        if (!updatedRooms[classId]) updatedRooms[classId] = '';
      });
      Object.keys(updatedRooms).forEach(classId => {
        if (!newSelectedClasses.includes(classId)) delete updatedRooms[classId];
      });
      return updatedRooms;
    });
    setClassTimes(prev => {
      const updatedTimes = { ...prev };
      newSelectedClasses.forEach(classId => {
        if (!updatedTimes[classId]) updatedTimes[classId] = '';
      });
      Object.keys(updatedTimes).forEach(classId => {
        if (!newSelectedClasses.includes(classId)) delete updatedTimes[classId];
      });
      return updatedTimes;
    });
  };

  const handleSubjectChange = (classId, value) => {
    setClassSubjects(prev => ({
      ...prev,
      [classId]: value,
    }));
  };

  const handleRoomNumberChange = (classId, value) => {
    setClassRoomNumbers(prev => ({
      ...prev,
      [classId]: value,
    }));
  };

  const handleTimeChange = (classId, value) => {
    setClassTimes(prev => ({
      ...prev,
      [classId]: value,
    }));
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
    if (currentTeacher.role !== 'user' && !selectedShift) {
      await MySwal.fire('Error!', 'Please fill in shift.', 'error');
      return;
    }
    if (
      currentTeacher.role !== 'user' &&
      selectedClasses.some(classId => !classSubjects[classId]?.trim() || !classRoomNumbers[classId]?.trim() || !classTimes[classId]?.trim())
    ) {
      await MySwal.fire('Error!', 'Please provide subjects, a room number, and a time for each selected class.', 'error');
      return;
    }

    try {
      const teacherData = currentTeacher.role === 'user'
        ? {}
        : {
            assignedClasses: selectedClasses.map(classId => ({
              classId,
              className: classes.find(c => c._id === classId)?.name,
            })),
            shift: selectedShift,
            subjects: selectedClasses.map(classId => ({
              classId,
              className: classes.find(c => c._id === classId)?.name,
              subjects: classSubjects[classId].split(',').map(s => s.trim()).filter(s => s),
              roomNumber: classRoomNumbers[classId].trim(),
              classTime: classTimes[classId].trim(),
            })),
          };

      const result = await updateTeacher(currentTeacher.email, {
        role: currentTeacher.role,
        ...teacherData,
      });

      await fetchTeachers();
      setUpdateModal(false);
      setSelectedClasses([]);
      setSelectedShift('');
      setClassSubjects({});
      setClassRoomNumbers({});
      setClassTimes({});
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
        await axios.delete(`https://sc-hool-server.vercel.app/users/${email}?requesterEmail=${user.email}`, {
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
    setClassSubjects(
      Array.isArray(teacher.subjects)
        ? teacher.subjects.reduce((acc, subj) => {
            if (subj.classId && Array.isArray(subj.subjects)) {
              acc[subj.classId] = subj.subjects.join(', ');
            } else {
              console.warn(`Invalid subject entry for teacher ${teacher.email}:`, subj);
            }
            return acc;
          }, {})
        : {}
    );
    setClassRoomNumbers(
      Array.isArray(teacher.subjects)
        ? teacher.subjects.reduce((acc, subj) => {
            if (subj.classId && subj.roomNumber) {
              acc[subj.classId] = subj.roomNumber;
            } else {
              console.warn(`Invalid room number entry for teacher ${teacher.email}:`, subj);
            }
            return acc;
          }, {})
        : {}
    );
    setClassTimes(
      Array.isArray(teacher.subjects)
        ? teacher.subjects.reduce((acc, subj) => {
            if (subj.classId && subj.classTime) {
              acc[subj.classId] = subj.classTime;
            } else {
              console.warn(`Invalid class time entry for teacher ${teacher.email}:`, subj);
            }
            return acc;
          }, {})
        : {}
    );
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
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Faculty Management</h1>

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
            onChange={e => setSearch(e.target.value)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map(teacher => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={teacher.photoURL || 'https://via.placeholder.com/150'}
                        alt={teacher.name || 'Teacher'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {teacher.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.assignedClasses?.map(cls => cls.className).join(', ') || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center"
                          title="View Details"
                        >
                          <FaEye className="mr-2" /> View
                        </button>
                        <button
                          onClick={() => openUpdateModal(teacher)}
                          disabled={loading}
                          className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition flex items-center disabled:opacity-50"
                          title="Update Teacher"
                        >
                          <FaEdit className="mr-2" /> Update
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.email)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition flex items-center disabled:opacity-50"
                          title="Delete Teacher"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {search ? 'No teachers match your search' : 'No teachers available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Details Modal */}
      {showModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Teacher Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedTeacher.photoURL || 'https://via.placeholder.com/150'}
                alt={selectedTeacher.name || 'Teacher'}
                className="h-24 w-24 rounded-full object-cover mb-3"
              />
              <h4 className="text-lg font-semibold">{selectedTeacher.name || 'N/A'}</h4>
              <p className="text-gray-600">{selectedTeacher.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{selectedTeacher.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span className="capitalize">{selectedTeacher.role || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shift:</span>
                <span>{selectedTeacher.shift || 'Not specified'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Classes:</span>
                {selectedTeacher.assignedClasses?.length > 0 ? (
                  selectedTeacher.assignedClasses.map((cls, index) => {
                    const classSubjects = selectedTeacher.subjects?.find(subj => subj.classId === cls.classId);
                    return (
                      <div key={index} className="ml-2 mt-1">
                        <p>
                          <strong>Class:</strong> {cls.className || 'N/A'}
                        </p>
                        <p>
                          <strong>Subjects:</strong>{' '}
                          {classSubjects && Array.isArray(classSubjects.subjects)
                            ? classSubjects.subjects.join(', ')
                            : 'Not specified'}
                        </p>
                        <p>
                          <strong>Room Number:</strong>{' '}
                          {classSubjects && classSubjects.roomNumber ? classSubjects.roomNumber : 'Not specified'}
                        </p>
                        <p>
                          <strong>Class Time:</strong>{' '}
                          {classSubjects && classSubjects.classTime ? classSubjects.classTime : 'Not specified'}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <span className="ml-2">No classes assigned</span>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Teacher Modal */}
      {updateModal && currentTeacher && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-6">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 mx-auto my-6 max-h-[calc(100vh-3rem)] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Update Teacher</h3>
              <button
                onClick={() => {
                  setUpdateModal(false);
                  setSelectedClasses([]);
                  setSelectedShift('');
                  setClassSubjects({});
                  setClassRoomNumbers({});
                  setClassTimes({});
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="mb-6">
                <div className="flex items-center mb-6 border-b pb-4">
                  <img
                    src={currentTeacher.photoURL || 'https://via.placeholder.com/150'}
                    alt={currentTeacher.name || 'Teacher'}
                    className="h-12 w-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{currentTeacher.name || 'N/A'}</h4>
                    <p className="text-gray-600 text-sm">{currentTeacher.email}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Classes</label>
                  <select
                    multiple
                    value={selectedClasses}
                    onChange={handleClassSelection}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple classes</p>
                </div>
                {selectedClasses.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Details per Class</label>
                    {selectedClasses.map(classId => (
                      <div key={classId} className="mb-3 p-4 bg-gray-50 rounded-md shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          {classes.find(c => c._id === classId)?.name || 'Unknown Class'}
                        </label>
                        <input
                          type="text"
                          value={classSubjects[classId] || ''}
                          onChange={e => handleSubjectChange(classId, e.target.value)}
                          placeholder="e.g., Math, Science, English"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        />
                        <p className="text-sm text-gray-500 mb-2">Enter subjects (comma-separated) for this class</p>
                        <input
                          type="text"
                          value={classRoomNumbers[classId] || ''}
                          onChange={e => handleRoomNumberChange(classId, e.target.value)}
                          placeholder="e.g., Room 101"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        />
                        <p className="text-sm text-gray-500 mb-2">Enter room number for this class</p>
                        <input
                          type="text"
                          value={classTimes[classId] || ''}
                          onChange={e => handleTimeChange(classId, e.target.value)}
                          placeholder="e.g., 9:00 AM - 10:00 AM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Enter class time (e.g., 9:00 AM - 10:00 AM)</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Shift</label>
                  <select
                    value={selectedShift}
                    onChange={e => setSelectedShift(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setUpdateModal(false);
                      setSelectedClasses([]);
                      setSelectedShift('');
                      setClassSubjects({});
                      setClassRoomNumbers({});
                      setClassTimes({});
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTeacher}
                    disabled={
                      !selectedClasses.length ||
                      !selectedShift ||
                      loading ||
                      selectedClasses.some(
                        classId => !classSubjects[classId]?.trim() || !classRoomNumbers[classId]?.trim() || !classTimes[classId]?.trim()
                      )
                    }
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Update Teacher'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;