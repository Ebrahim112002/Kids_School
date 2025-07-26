import React, { useContext } from 'react';
import admission from '../../assets/admission.json';
import Lottie from 'lottie-react';
import Swal from 'sweetalert2';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Admission = () => {
  const { user } = useContext(Authcontext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const studentData = Object.fromEntries(formData.entries());

    studentData.email = user.email;
    studentData.role = 'student';

    try {
      // Submit admission data
      const response = await fetch('https://sc-hool-server.vercel.app/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();

      if (result.acknowledged) {
        // Update user role
        await fetch(`https://sc-hool-server.vercel.app/users/${user.email}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: 'student' }),
        });

        Swal.fire({
          icon: 'success',
          title: 'Admission Successful',
          text: `Student registered with Reg. No. ${result.registrationNumber}`,
          confirmButtonColor: '#3085d6',
        });

        form.reset();
      } else {
        throw new Error(result.error || 'Admission failed');
      }
    } catch (err) {
      console.error('Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  if (!user) {
    return (
      <div className="flex flex-col lg:flex-row items-center justify-center bg-blue-50 py-10 px-6">
        <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0">
          <Lottie animationData={admission} loop className="w-full h-[400px] lg:h-[500px]" />
        </div>
        <div className="w-full lg:w-1/2 px-4 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">
            Welcome to Our School Admission Portal
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Please register first to apply for admission.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
          >
            Register Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10 px-4">
      <motion.div
        className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 w-full max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="w-full lg:w-1/2 max-w-lg bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Admission Form</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Student's Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter student's full name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Gender</label>
              <div className="flex gap-6 mt-1">
                <label><input type="radio" name="gender" value="Male" required /> Male</label>
                <label><input type="radio" name="gender" value="Female" required /> Female</label>
                <label><input type="radio" name="gender" value="Other" required /> Other</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                disabled
                className="w-full p-3 border rounded-md bg-gray-100 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Class Applying For</label>
              <input
                type="text"
                name="className"
                required
                placeholder="Grade 1, Class 5, etc."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Parent's Name</label>
              <input
                type="text"
                name="parentName"
                required
                placeholder="Enter parent's full name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                placeholder="01XXXXXXXXX"
                pattern="[0-9]{11}"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Address</label>
              <textarea
                name="address"
                required
                rows="3"
                placeholder="House, Road, Area, City"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md mt-4 transition"
            >
              Submit Admission
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Admission;
