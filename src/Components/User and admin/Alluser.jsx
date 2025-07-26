import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaSearch, FaEye, FaUserTie, FaUserShield, FaTrash } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const Alluser = () => {
  const loadedUsers = useLoaderData();
  const [users, setUsers] = useState(loadedUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [teacherModal, setTeacherModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [subjects, setSubjects] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/classes');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        MySwal.fire('Error!', 'Failed to load classes. Please try again later.', 'error');
      }
    };
    fetchClasses();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const regularUsers = filteredUsers.filter(user => user.role === 'user');

  const updateUserRole = async (email, newRole, teacherData = null) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/users/${email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          role: newRole,
          ...(teacherData && { 
            assignedClasses: teacherData.assignedClasses,
            shift: teacherData.shift,
            subjects: teacherData.subjects,
          })
        })
      });

      if (!response.ok) throw new Error('Failed to update user role');
      return await response.json();
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openMakeTeacherModal = (user) => {
    setCurrentTeacher(user);
    setSelectedClasses([]);
    setSelectedShift('');
    setSubjects('');
    setTeacherModal(true);
  };

  const handleMakeTeacher = async () => {
    if (!selectedClasses.length || !selectedShift || !subjects) {
      await MySwal.fire('Error!', 'Please select at least one class, a shift, and enter subjects.', 'error');
      return;
    }

    try {
      const teacherData = {
        assignedClasses: selectedClasses.map(classId => ({
          classId,
          className: classes.find(c => c._id === classId)?.name
        })),
        shift: selectedShift,
        subjects: subjects.split(',').map(s => s.trim()).filter(s => s),
      };

      await updateUserRole(currentTeacher.email, 'teacher', teacherData);

      setUsers(users.map(user => 
        user._id === currentTeacher._id ? {
          ...user, 
          role: 'teacher',
          assignedClasses: teacherData.assignedClasses,
          shift: teacherData.shift,
          subjects: teacherData.subjects,
        } : user
      ));

      setTeacherModal(false);
      setSelectedClasses([]);
      setSelectedShift('');
      setSubjects('');

      await MySwal.fire('Success!', 'The user is now a teacher with assigned classes.', 'success');
    } catch (error) {
      await MySwal.fire('Error!', 'Failed to update user role.', 'error');
    }
  };

  const handleMakeAdmin = async (userId, email) => {
    const result = await MySwal.fire({
      title: 'Confirm',
      text: "Make this user an admin?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make admin!'
    });

    if (result.isConfirmed) {
      try {
        await updateUserRole(email, 'admin');
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: 'admin' } : user
        ));
        await MySwal.fire('Success!', 'User is now an admin.', 'success');
      } catch (error) {
        await MySwal.fire('Error!', 'Failed to update user role.', 'error');
      }
    }
  };

  const handleDeleteUser = async (userId, email) => {
    const result = await MySwal.fire({
      title: 'Confirm',
      text: "Delete this user? This cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:3000/users/${email}`, {
          method: 'DELETE',
        });
        setUsers(users.filter(user => user._id !== userId));
        await MySwal.fire('Deleted!', 'User has been removed.', 'success');
      } catch (error) {
        await MySwal.fire('Error!', 'Failed to delete user.', 'error');
      }
    }
  };

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
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regularUsers.length > 0 ? regularUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={user.photoURL || 'https://via.placeholder.com/150'} 
                      alt={user.name} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => { setSelectedUser(user); setShowModal(true); }}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center"
                      >
                        <FaEye className="mr-2" /> View
                      </button>
                      <button
                        onClick={() => openMakeTeacherModal(user)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition flex items-center disabled:opacity-50"
                      >
                        <FaUserTie className="mr-2" /> Make Teacher
                      </button>
                      <button
                        onClick={() => handleMakeAdmin(user._id, user.email)}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition flex items-center disabled:opacity-50"
                      >
                        <FaUserShield className="mr-2" /> Make Admin
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.email)}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition flex items-center"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
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
                alt={selectedUser.name}
                className="h-24 w-24 rounded-full object-cover mb-3"
              />
              <h4 className="text-lg font-semibold">{selectedUser.name}</h4>
              <p className="text-gray-600">{selectedUser.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{selectedUser.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span className="capitalize">{selectedUser.role}</span>
              </div>
              {selectedUser.assignedClasses?.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Assigned Classes:</span>
                  <span>{selectedUser.assignedClasses.map(c => c.className).join(', ')}</span>
                </div>
              )}
              {selectedUser.shift && (
                <div className="flex justify-between">
                  <span className="font-medium">Shift:</span>
                  <span>{selectedUser.shift}</span>
                </div>
              )}
              {selectedUser.subjects?.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Subjects:</span>
                  <span>{selectedUser.subjects.join(', ')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Joined:</span>
                <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
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
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Assign Teacher to Classes</h3>
              <button 
                onClick={() => { setTeacherModal(false); setSelectedClasses([]); setSelectedShift(''); setSubjects(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <img 
                  src={currentTeacher.photoURL || 'https://via.placeholder.com/150'} 
                  alt={currentTeacher.name}
                  className="h-12 w-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-semibold">{currentTeacher.name}</h4>
                  <p className="text-gray-600 text-sm">{currentTeacher.email}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Classes
                </label>
                <select
                  multiple
                  value={selectedClasses}
                  onChange={(e) => setSelectedClasses(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple classes</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Shift
                </label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects (comma-separated)
                </label>
                <input
                  type="text"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="e.g., Math, Science, English"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => { setTeacherModal(false); setSelectedClasses([]); setSelectedShift(''); setSubjects(''); }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMakeTeacher}
                  disabled={!selectedClasses.length || !selectedShift || !subjects || loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Assign as Teacher'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alluser;