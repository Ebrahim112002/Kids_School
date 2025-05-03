import React, { useState } from 'react';

const Admission = () =>{
    const [formData, setFormData] = useState({
      name: '',
      dob: '',
      gender: '',
      className: '',
      parentName: '',
      phone: '',
      address: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Admission Form Data:', formData);
      alert('Admission submitted successfully!');
      // You can replace the above with backend API call if needed
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10 px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">School Admission Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Student's Name"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  checked={formData.gender === 'Male'}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  checked={formData.gender === 'Female'}
                  className="mr-2"
                />
                Female
              </label>
            </div>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              placeholder="Class Applying For"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Parent's Name"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
            >
              Submit Admission
            </button>
          </form>
        </div>
      </div>
    );
  };

export default Admission;