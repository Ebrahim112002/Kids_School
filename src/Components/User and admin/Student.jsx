import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { FaUserTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const Student = () => {
  const data = useLoaderData();

  // Filter only students with role 'student'
  const [students, setStudents] = useState(
    Array.isArray(data)
      ? data.filter((user) => user.role === 'student')
      : data.role === 'student'
        ? [data]
        : []
  );

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered list based on search query (name or registrationNumber)
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = student.name?.toLowerCase().includes(query);
    const regMatch = student.registrationNumber
      ? student.registrationNumber.toString().includes(query)
      : false;
    return nameMatch || regMatch;
  });

  const removeStudent = async (student) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This student will be removed and demoted to user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    });

    if (result.isConfirmed) {
      try {
        // 1️⃣ Delete student from student collection
        await axios.delete(`http://localhost:3000/student?email=${student.email}`);

        // 2️⃣ Update role in users collection to 'user'
        await axios.patch(`http://localhost:3000/users/remove-class/${student.email}`);

        // 3️⃣ Remove from UI
        const updatedList = students.filter(s => s.email !== student.email);
        setStudents(updatedList);

        MySwal.fire('Removed!', 'The student has been removed.', 'success');
      } catch (error) {
        console.error('Error removing student:', error);
        MySwal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 max-w-6xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4">Student Management</h2>

      <input
        type="text"
        placeholder="Search by name or registration number..."
        className="p-2 border border-gray-300 rounded mb-4 w-full max-w-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Photo</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Registration No.</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Class</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">
                    <img
                      src={student.photoURL || 'https://via.placeholder.com/50'}
                      alt="Student"
                      className="w-12 h-12 rounded-full mx-auto object-cover"
                    />
                  </td>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.registrationNumber || 'N/A'}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">{student.phone}</td>
                  <td className="border px-4 py-2">{student.className || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => removeStudent(student)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded inline-flex items-center"
                    >
                      <FaUserTimes className="mr-1" /> Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Student;
