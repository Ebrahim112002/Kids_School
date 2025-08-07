import React, { useState, useEffect, useContext } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const StudentClassInfo = () => {
  const { user } = useContext(Authcontext);
  const [studentData, setStudentData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError('Please log in to view class information');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch student data
        const studentResponse = await fetch(`https://sc-hool-server.vercel.app/student?email=${user.email}`, {
          headers: { 'x-user-email': user.email },
        });
        if (!studentResponse.ok) throw new Error('Failed to fetch student data');
        const student = await studentResponse.json();
        setStudentData(student);

        // Fetch subjects for the student's class
        const subjectsResponse = await fetch(
          `https://sc-hool-server.vercel.app/subjects?className=${encodeURIComponent(student.className)}&email=${user.email}`,
          { headers: { 'x-user-email': user.email } }
        );
        if (!subjectsResponse.ok) throw new Error('Failed to fetch subjects');
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);

        // Fetch teachers assigned to the student's class
        const teachersResponse = await fetch(`https://sc-hool-server.vercel.app/users/teachers?className=${encodeURIComponent(student.className)}`, {
          headers: { 'x-user-email': user.email },
        });
        if (!teachersResponse.ok) throw new Error('Failed to fetch teachers');
        const teacherUsers = await teachersResponse.json();
        setTeachers(teacherUsers);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No student data found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Class Information for {studentData.name}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Class: {studentData.className} {studentData.stream ? `(${studentData.stream})` : ''}
        </h2>

        {teachers.length > 0 ? (
          <div className="space-y-6">
            {teachers.map(teacher => {
              const classInfo = teacher.subjects?.find(s => s.className === studentData.className);
              return (
                <div key={teacher.email} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800">Teacher: {teacher.name}</h3>
                  <p className="text-gray-600"><strong>Shift:</strong> {teacher.shift || 'Not assigned'}</p>
                  <p className="text-gray-600"><strong>Class Time:</strong> {teacher.classTime || 'Not assigned'}</p>
                  <p className="text-gray-600"><strong>Room Number:</strong> {classInfo?.roomNumber || 'Not assigned'}</p>
                  <p className="text-gray-600"><strong>Subjects:</strong> {classInfo?.subjects?.join(', ') || 'None'}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">No teachers assigned to {studentData.className}.</p>
        )}

        <h3 className="text-lg font-medium text-gray-800 mt-6">Class Subjects</h3>
        {subjects.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600">
            {subjects.map(subject => (
              <li key={subject._id}>
                {subject.subjects.join(', ')} (Class: {subject.className})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No subjects found for {studentData.className}.</p>
        )}
      </div>
    </div>
  );
};

export default StudentClassInfo;