import React from 'react';
import { FaEye } from 'react-icons/fa';

const Teachers = ({ teacher, setSelectedTeacher }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <img
          src={teacher.image || 'https://via.placeholder.com/60'}
          alt={teacher.name || 'Teacher'}
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-200"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{teacher.name || 'N/A'}</h3>
          <p className="text-sm text-gray-500">{teacher.position}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Phone:</strong> {teacher.phone || 'N/A'}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTeacher(teacher)}
          className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition flex items-center justify-center text-sm"
          title="View Details"
        >
          <FaEye className="mr-1.5 text-base" /> View
        </button>
      </div>
    </div>
  );
};

export default Teachers;