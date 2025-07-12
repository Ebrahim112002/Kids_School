import React, { useContext } from 'react';
import admission from '../../assets/admission.json';
import Lottie from 'lottie-react';
import Swal from 'sweetalert2';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import { updateProfile } from 'firebase/auth';
// Removed unused imports for navigate & location

const Admission = () => {
  const { createUser, setUser } = useContext(Authcontext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const studentData = Object.fromEntries(formData.entries());

    const email = studentData.email;
    const password = studentData.password;
    const name = studentData.name;
    const photoURL = ''; // Optional photo URL

    try {
      // Step 1: Create Firebase Auth user with email and phone as password
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // Log Firebase user info to console
      console.log("Firebase User:", user);

      // Step 2: Update user profile
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
    

      });

      setUser(user); // update context with current user

      // Step 3: Save student data to backend (MongoDB)
      const response = await fetch('http://localhost:3000/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();
      console.log('Saved to MongoDB:', result);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Admission submitted and user created successfully.',
        confirmButtonColor: '#3085d6',
      });

      form.reset();

      // Navigation removed to stop automatic redirect
      // navigate(from, { replace: true });
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10 px-4">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-5 w-full max-w-7xl">
        {/* Admission Form */}
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Registration Form
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Student's Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter student's full name"
                required
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
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="Male" required />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="Female" required />
                  Female
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" value="Other" required />
                  Other
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="abc@gmail.com"
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Class Applying For</label>
              <input
                type="text"
                name="className"
                placeholder="Grade 1, Class 5, etc."
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Parent's Name</label>
              <input
                type="text"
                name="parentName"
                placeholder="Enter parent's full name"
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                name="password"
                placeholder="01XXXXXXXXX"
                required
                pattern="[0-9]{11}"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Address</label>
              <textarea
                name="address"
                rows="3"
                placeholder="House, Road, Area, City"
                required
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
            >
              Submit Admission
            </button>
          </form>
        </div>

        {/* Lottie Animation */}
        <div className="lg:w-[400px] flex justify-center">
          <Lottie animationData={admission} loop className="w-full h-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Admission;
