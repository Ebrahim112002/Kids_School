import React from 'react';

const Teachers = ({ teacher }) => {
  const { name, position, phone, image } = teacher;

  return (
    <div className="card w-80 bg-white shadow-md hover:shadow-lg transition-all duration-300">
      <figure className="h-56 overflow-hidden">
        <img src={image} alt={name} className="object-cover w-full h-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-xl font-semibold">
          {name}
          <span className="badge badge-secondary ml-2 w-40">{position}</span>
        </h2>
        <p className="text-gray-600">Phone: {phone}</p>
        <div className="card-actions justify-end mt-2">
          <div className="badge badge-outline">Teacher</div>
          <div className="badge badge-outline">Contact</div>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
