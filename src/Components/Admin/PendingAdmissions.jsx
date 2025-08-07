import React, { useState, useEffect, useContext } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios';

const PendingAdmissions = () => {
  const { user } = useContext(Authcontext);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
// console.log(selectedStudent.photoURL);
  useEffect(() => {
    const fetchPendingStudents = async () => {
      if (!user?.email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://sc-hool-server.vercel.app/pendingStudents', {
          params: { email: user.email },
        });
        setPendingStudents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pending students:', err);
        setError('Failed to fetch pending admissions');
        setLoading(false);
      }
    };

    fetchPendingStudents();
  }, [user]);

  const handleApprove = async (studentEmail, registrationNumber) => {
    try {
      const response = await axios.post(
        `https://sc-hool-server.vercel.app/pendingStudents/approve/${studentEmail}`,
        {},
        { params: { adminEmail: user.email } }
      );

      if (response.data.acknowledged) {
        Swal.fire({
          icon: 'success',
          title: 'Student Approved',
          text: `Student with Reg. No. ${registrationNumber} has been approved.`,
          confirmButtonColor: '#3085d6',
        });
        setPendingStudents(pendingStudents.filter(student => student.email !== studentEmail));
      } else {
        throw new Error(response.data.error || 'Approval failed');
      }
    } catch (err) {
      console.error('Error approving student:', err);
      Swal.fire({
        icon: 'error',
        title: 'Approval Failed',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleReject = async (studentEmail, registrationNumber) => {
    try {
      const response = await axios.post(
        `https://sc-hool-server.vercel.app/pendingStudents/reject/${studentEmail}`,
        {},
        { params: { adminEmail: user.email } }
      );

      if (response.data.acknowledged) {
        Swal.fire({
          icon: 'success',
          title: 'Student Rejected',
          text: `Student with Reg. No. ${registrationNumber} has been rejected.`,
          confirmButtonColor: '#3085d6',
        });
        setPendingStudents(pendingStudents.filter(student => student.email !== studentEmail));
      } else {
        throw new Error(response.data.error || 'Rejection failed');
      }
    } catch (err) {
      console.error('Error rejecting student:', err);
      Swal.fire({
        icon: 'error',
        title: 'Rejection Failed',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-700">Loading pending admissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
          <p className="text-gray-600 mt-2">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Admissions</h2>
          {pendingStudents.length === 0 ? (
            <p className="text-gray-600">No pending admissions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600">Reg. No.</th>
                    <th className="px-4 py-2 text-left text-gray-600">Name</th>
                    <th className="px-4 py-2 text-left text-gray-600">Email</th>
                    <th className="px-4 py-2 text-left text-gray-600">Class</th>
                    <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingStudents.map(student => (
                    <tr key={student.email} className="border-b">
                      <td className="px-4 py-2">{student.registrationNumber}</td>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.email}</td>
                      <td className="px-4 py-2">{student.className}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                        >
                          See Details
                        </button>
                        <button
                          onClick={() => handleApprove(student.email, student.registrationNumber)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(student.email, student.registrationNumber)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal for Student Details */}
      <AnimatePresence>
        {isModalOpen && selectedStudent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeModal}
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full z-50"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Student Details</h3>
              <div className="space-y-3">
                <div className="flex justify-center mb-4">
                  <img
                    src={selectedStudent.photoURL }
                    alt={selectedStudent.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/100')}
                  />
                </div>
                <p><strong>Registration Number:</strong> {selectedStudent.registrationNumber}</p>
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>Class:</strong> {selectedStudent.className}</p>
                <p><strong>Date of Birth:</strong> {formatDate(selectedStudent.dob)}</p>
                <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                <p><strong>Parent's Name:</strong> {selectedStudent.parentName}</p>
                <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                <p><strong>Address:</strong> {selectedStudent.address}</p>
                <p><strong>Submitted At:</strong> {formatDate(selectedStudent.createdAt)}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingAdmissions;