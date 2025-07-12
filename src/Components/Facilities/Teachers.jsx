import React from 'react';

const Teachers = ({ teacher }) => {
  const { name, position, phone, image } = teacher;

  return (
    <div className="w-80 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <figure className="h-56">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
            {position}
          </span>
        </div>

        <p className="text-gray-600 text-sm">📞 {phone}</p>

        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Teacher</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Contact</span>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
