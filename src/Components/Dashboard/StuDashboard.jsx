import React, { useEffect, useState, useContext } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const StuDashboard = () => {
  const { user } = useContext(Authcontext);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/student?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setStudentData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching student data:', error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-10 text-blue-700 font-semibold text-xl">Loading your data...</div>;
  }

  if (!studentData) {
    return <div className="text-center text-red-600 mt-10 font-bold">No student data found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 my-16">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Welcome, {studentData.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><span className="font-semibold">Email:</span> {studentData.email}</p>
        <p><span className="font-semibold">Phone:</span> {studentData.password}</p>
        <p><span className="font-semibold">Date of Birth:</span> {studentData.dob}</p>
        <p><span className="font-semibold">Gender:</span> {studentData.gender}</p>
        <p><span className="font-semibold">Class:</span> {studentData.className}</p>
        <p><span className="font-semibold">Parent Name:</span> {studentData.parentName}</p>
        <p><span className="font-semibold">Address:</span> {studentData.address}</p>
        <p><span className="font-semibold">Registration No:</span> {studentData.registrationNumber}</p>
      </div>
    </div>
  );
};

export default StuDashboard;
