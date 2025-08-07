import React, { useState, useEffect, useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaSearch, FaEye, FaUserTie, FaUserShield, FaTrash } from 'react-icons/fa';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const MySwal = withReactContent(Swal);

const AllUsers = () => {
  const { user, loading } = useContext(Authcontext);
  const loadedUsers = useLoaderData();
  const [users, setUsers] = useState(Array.isArray(loadedUsers) ? loadedUsers : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teacherModal, setTeacherModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [classSubjects, setClassSubjects] = useState({});
  const [classRoomNumbers, setClassRoomNumbers] = useState({});
  const [classTimes, setClassTimes] = useState({});
  const navigate = useNavigate();

  console.log('Authcontext user:', JSON.stringify(user, null, 2));
  console.log('Loaded users:', loadedUsers);
  console.log('Users state:', users);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.email) {
        setFetchError('User not authenticated. Please log in.');
        return;
      }
      try {
        const response = await fetch('https://sc-hool-server.vercel.app/classes', {
          headers: {
            'x-user-email': user.email,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch classes');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Classes data is not an array');
        }
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setFetchError(error.message || 'Failed to load classes. Please try again later.');
      }
    };
    if (user?.email) fetchClasses();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.email || users.length > 0) return;
      setFetchLoading(true);
      try {
        const response = await fetch('https://sc-hool-server.vercel.app/users', {
          headers: {
            'x-user-email': user.email,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch users');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          throw new Error('Users data is not an array');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setFetchError(error.message || 'Failed to load users. Please try again later.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUsers();
  }, [user, users]);

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
      user.role === 'user' &&
      user.pending !== true &&
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];
  console.log('Filtered users:', filteredUsers);

  const updateUserRole = async (email, newRole, teacherData = null) => {
    setFetchLoading(true);
    try {
      const response = await fetch(`https://sc-hool-server.vercel.app/users/${email}?requesterEmail=${user.email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
        },
        body: JSON.stringify({
          role: newRole,
          ...(teacherData && {
            assignedClasses: teacherData.assignedClasses,
            shift: teacherData.shift,
            subjects: teacherData.subjects,
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    } finally {
      setFetchLoading(false);
    }
  };

  const openMakeTeacherModal = (user) => {
    setCurrentTeacher(user);
    setSelectedClasses([]);
    setSelectedShift('');
    setClassSubjects({});
    setClassRoomNumbers({});
    setClassTimes({});
    setTeacherModal(true);
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

  const handleMakeTeacher = async () => {
    if (!selectedClasses.length || !selectedShift) {
      await MySwal.fire('Error!', 'Please select at least one class and a shift.', 'error');
      return;
    }
    const invalidClasses = selectedClasses.filter(
      classId => !classSubjects[classId]?.trim() || !classRoomNumbers[classId]?.trim() || !classTimes[classId]?.trim()
    );
    if (invalidClasses.length > 0) {
      await MySwal.fire('Error!', 'Please provide subjects, a room number, and a time for each selected class.', 'error');
      return;
    }

    try {
      const teacherData = {
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

      const result = await updateUserRole(currentTeacher.email, 'teacher', teacherData);
      setUsers(users.filter(user => user._id !== currentTeacher._id));
      setTeacherModal(false);
      setSelectedClasses([]);
      setSelectedShift('');
      setClassSubjects({});
      setClassRoomNumbers({});
      setClassTimes({});
      await MySwal.fire('Success!', 'The user is now a teacher with assigned classes, subjects, rooms, and times.', 'success');
    } catch (error) {
      await MySwal.fire('Error!', error.message || 'Failed to update user role.', 'error');
    }
  };

  const handleMakeAdmin = async (userId, email) => {
    const result = await MySwal.fire({
      title: 'Confirm',
      text: 'Make this user an admin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make admin!',
    });

    if (result.isConfirmed) {
      try {
        const result = await updateUserRole(email, 'admin');
        setUsers(users.filter(user => user._id !== userId));
        await MySwal.fire('Success!', 'User is now an admin.', 'success');
      } catch (error) {
        await MySwal.fire('Error!', error.message || 'Failed to update user role.', 'error');
      }
    }
  };

  const handleDeleteUser = async (userId, email) => {
    const result = await MySwal.fire({
      title: 'Confirm',
      text: 'Delete this user? This cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://sc-hool-server.vercel.app/users/${email}?requesterEmail=${user.email}`, {
          method: 'DELETE',
          headers: {
            'x-user-email': user.email,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete user');
        }
        setUsers(users.filter(user => user._id !== userId));
        await MySwal.fire('Deleted!', 'User has been removed.', 'success');
      } catch (error) {
        await MySwal.fire('Error!', error.message || 'Failed to delete user.', 'error');
      }
    }
  };

  if (loading || fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-gray-600 font-semibold text-lg">Loading user data...</p>
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by email or name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.photoURL || 'https://via.placeholder.com/150'}
                        alt={user.name || 'User'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center"
                          title="View Details"
                        >
                          <FaEye className="mr-2" /> View
                        </button>
                        <button
                          onClick={() => openMakeTeacherModal(user)}
                          disabled={fetchLoading}
                          className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition flex items-center disabled:opacity-50"
                          title="Make Teacher"
                        >
                          <FaUserTie className="mr-2" /> Make Teacher
                        </button>
                        <button
                          onClick={() => handleMakeAdmin(user._id, user.email)}
                          disabled={fetchLoading}
                          className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition flex items-center disabled:opacity-50"
                          title="Make Admin"
                        >
                          <FaUserShield className="mr-2" /> Make Admin
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.email)}
                          disabled={fetchLoading}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition flex items-center disabled:opacity-50"
                          title="Remove User"
                        >
                          <FaTrash className="mr-2" /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'No users match your search' : 'No users with role "user" available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">User Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedUser.photoURL || 'https://via.placeholder.com/150'}
                alt={selectedUser.name || 'User'}
                className="h-24 w-24 rounded-full object-cover mb-3"
              />
              <h4 className="text-lg font-semibold">{selectedUser.name || 'N/A'}</h4>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{selectedUser.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span className="capitalize">{selectedUser.role || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Joined:</span>
                <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
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

      {/* Make Teacher Modal */}
      {teacherModal && currentTeacher && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-6">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 mx-auto my-6 max-h-[calc(100vh-3rem)] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Assign Teacher to Classes</h3>
              <button
                onClick={() => {
                  setTeacherModal(false);
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
                    alt={currentTeacher.name || 'User'}
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
                          {classes.find(c => c._id === classId)?.name && "Enter subjects (comma-separated) for this class " || 'Unknown Class'}
                        </label>
                        <input
                          type="text"
                          value={classSubjects[classId] || ''}
                          onChange={e => handleSubjectChange(classId, e.target.value)}
                          placeholder="e.g., Math, Science, English"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        />
                        <p className="text-sm text-gray-500 mb-2">Enter room number for this class

                        </p>
                        <input
                          type="text"
                          value={classRoomNumbers[classId] || ''}
                          onChange={e => handleRoomNumberChange(classId, e.target.value)}
                          placeholder="e.g., Room 101"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        />
                        <p className="text-sm text-gray-500 mb-2">Class Time</p>
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
                      setTeacherModal(false);
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
                    onClick={handleMakeTeacher}
                    disabled={
                      !selectedClasses.length ||
                      !selectedShift ||
                      fetchLoading ||
                      selectedClasses.some(
                        classId => !classSubjects[classId]?.trim() || !classRoomNumbers[classId]?.trim() || !classTimes[classId]?.trim()
                      )
                    }
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {fetchLoading ? 'Processing...' : 'Assign as Teacher'}
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

export default AllUsers;