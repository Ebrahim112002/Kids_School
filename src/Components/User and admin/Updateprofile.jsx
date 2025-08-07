import React, { useContext, useState, useEffect } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUser, FaPhone, FaCalendarAlt, FaVenusMars, FaHome, FaUserTie, FaClock, FaBook } from 'react-icons/fa';

const UpdateProfile = () => {
  const { user } = useContext(Authcontext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    parentName: '',
    address: '',
    shift: '',
    subjects: [],
    enrolledClassName: '', // For display only
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.email) {
        setFetchError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userResponse = await axios.get(`https://sc-hool-server.vercel.app/users?email=${user.email}`);
        const userData = userResponse.data;
        if (!userData) throw new Error('No user data found');

        // Initialize form data
        setFormData((prev) => ({
          ...prev,
          name: userData.name || '',
          phone: userData.phone || '',
          shift: userData.shift || '',
          subjects: userData.subjects || [],
          enrolledClassName: userData.enrolledClassName || '', // For display only
        }));

        // Fetch student data if user is a student
        if (userData.role === 'student') {
          const studentResponse = await axios.get(`https://sc-hool-server.vercel.app/student?email=${user.email}`);
          const studentData = studentResponse.data;
          if (studentData) {
            setFormData((prev) => ({
              ...prev,
              dob: studentData.dob ? new Date(studentData.dob).toISOString().split('T')[0] : '',
              gender: studentData.gender || '',
              parentName: studentData.parentName || '',
              address: studentData.address || '',
            }));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setFetchError(error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setErrors((prev) => ({ ...prev, photo: 'Please upload a valid image (JPEG, PNG, or GIF)' }));
        setPhoto(null);
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'Image size must be less than 5MB' }));
        setPhoto(null);
      } else {
        setErrors((prev) => ({ ...prev, photo: '' }));
        setPhoto(file);
      }
    }
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    if (subject) {
      setFormData((prev) => ({
        ...prev,
        subjects: prev.subjects.includes(subject)
          ? prev.subjects.filter((s) => s !== subject)
          : [...prev.subjects, subject],
      }));
      setErrors((prev) => ({ ...prev, subjects: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    if (formData.phone && !/^[0-9]{10,13}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10-13 digits';
    }
    if (user.role === 'student') {
      if (!formData.dob) {
        newErrors.dob = 'Date of birth is required';
      }
      if (!formData.gender) {
        newErrors.gender = 'Please select a gender';
      }
      if (!formData.parentName || formData.parentName.length < 2) {
        newErrors.parentName = 'Parent name must be at least 2 characters long';
      }
      if (!formData.address || formData.address.length < 5) {
        newErrors.address = 'Address must be at least 5 characters long';
      }
    }
    if (user.role === 'admin' && formData.role === 'teacher') {
      if (!formData.shift) {
        newErrors.shift = 'Shift is required';
      }
      if (!formData.subjects.length) {
        newErrors.subjects = 'At least one subject must be selected';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload photo to ImgBB if provided
      let photoURL = formData.photoURL || '';
      if (photo) {
        const imgBBFormData = new FormData();
        imgBBFormData.append('image', photo);
        const imgBBResponse = await axios.post(
          'https://api.imgbb.com/1/upload?key=d68b42193a2be1e494279fbc84bf2e52',
          imgBBFormData
        );
        if (imgBBResponse.data.success) {
          photoURL = imgBBResponse.data.data.url;
        } else {
          throw new Error('Failed to upload photo to ImgBB');
        }
      }

      // Prepare update data for users collection
      const userUpdateData = {
        name: formData.name,
        phone: formData.phone,
        ...(photoURL && { photoURL }),
      };

      // Add teacher-specific fields if admin is updating a teacher
      if (user.role === 'admin' && formData.role === 'teacher') {
        userUpdateData.role = 'teacher';
        userUpdateData.shift = formData.shift;
        userUpdateData.subjects = formData.subjects;
      }

      // Update users collection
      await axios.patch(
        `https://sc-hool-server.vercel.app/users/${user.email}?requesterEmail=${user.email}`,
        userUpdateData
      );

      // Update student collection if user is a student
      if (user.role === 'student') {
        const studentUpdateData = {
          name: formData.name,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          parentName: formData.parentName,
          address: formData.address,
          ...(photoURL && { photoURL }),
        };
        await axios.patch(
          `https://sc-hool-server.vercel.app/student/${user.email}?requesterEmail=${user.email}`,
          studentUpdateData
        );
      }

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        confirmButtonColor: '#3085d6',
      });

      navigate('/dashboard/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.error || 'Something went wrong. Please try again.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-blue-700">Loading profile data...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 flex items-center">
              <FaPhone className="mr-2 text-blue-600" /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.phone ? 'border-red-500' : ''
              }`}
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Profile Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePhotoChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.photo ? 'border-red-500' : ''
              }`}
            />
            {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
          </div>
          {user.role === 'student' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 flex items-center">
                  <FaBook className="mr-2 text-blue-600" /> Enrolled Class (Read-Only)
                </label>
                <input
                  type="text"
                  value={formData.enrolledClassName || 'Not enrolled'}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" /> Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.dob ? 'border-red-500' : ''
                  }`}
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 flex items-center">
                  <FaVenusMars className="mr-2 text-blue-600" /> Gender
                </label>
                <div className="flex gap-6 mt-1">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleInputChange}
                    />{' '}
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleInputChange}
                    />{' '}
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === 'Other'}
                      onChange={handleInputChange}
                    />{' '}
                    Other
                  </label>
                </div>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 flex items-center">
                  <FaUserTie className="mr-2 text-blue-600" /> Parent's Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.parentName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter parent's full name"
                />
                {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 flex items-center">
                  <FaHome className="mr-2 text-blue-600" /> Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
                    errors.address ? 'border-red-500' : ''
                  }`}
                  placeholder="House, Road, Area, City"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </>
          )}
          {user.role === 'admin' && formData.role === 'teacher' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 flex items-center">
                  <FaClock className="mr-2 text-blue-600" /> Shift
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.shift ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select Shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                </select>
                {errors.shift && <p className="text-red-500 text-xs mt-1">{errors.shift}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 flex items-center">
                  <FaBook className="mr-2 text-blue-600" /> Subjects
                </label>
                <div className="flex flex-wrap gap-4">
                  {['Math', 'Science', 'English', 'History', 'Geography'].map((subject) => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        value={subject}
                        checked={formData.subjects.includes(subject)}
                        onChange={handleSubjectChange}
                        className="mr-1"
                      />
                      {subject}
                    </label>
                  ))}
                </div>
                {errors.subjects && <p className="text-red-500 text-xs mt-1">{errors.subjects}</p>}
              </div>
            </>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateProfile;