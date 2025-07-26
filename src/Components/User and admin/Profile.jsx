import React, { useEffect, useState, useContext } from 'react';
import { Authcontext } from '../../Script/Authcontext/Authcontext';
import { motion } from 'framer-motion';
import { FaUserCircle, FaUserShield, FaChalkboardTeacher, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaHome, FaUserGraduate } from 'react-icons/fa';

const Profile = () => {
    const { user } = useContext(Authcontext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.email) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                // Determine which endpoint to call based on user role
                let endpoint = '';
                if (user.role === 'teacher') {
                    endpoint = `http://localhost:3000/users?email=${user.email}`;
                } else if (user.role === 'admin') {
                    endpoint = `http://localhost:3000/users?email=${user.email}`;
                } else {
                    endpoint = `http://localhost:3000/users?email=${user.email}`;
                }

                const response = await fetch(endpoint);
                if (!response.ok) throw new Error('Failed to fetch profile data');
                
                const data = await response.json();
                if (!data) throw new Error('No profile data found');
                
                setProfileData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-blue-700">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="text-red-600 text-4xl mx-auto mb-4">
                        <FaUserCircle />
                    </div>
                    <p className="text-red-600 font-semibold text-lg">{error || 'No profile data found.'}</p>
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
                className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
            >
                {/* Profile Header */}
                <div className={`p-6 text-center ${
                    profileData.role === 'admin' ? 'bg-indigo-600' : 
                    profileData.role === 'teacher' ? 'bg-green-600' : 'bg-blue-600'
                } text-white`}>
                    <div className="flex flex-col items-center">
                        {profileData.photoURL ? (
                            <img
                                src={profileData.photoURL}
                                alt={profileData.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white border-opacity-30 mb-4"
                            />
                        ) : (
                            <FaUserCircle className="w-24 h-24 text-white text-opacity-80 mb-4" />
                        )}
                        <h2 className="text-2xl font-bold">{profileData.name}</h2>
                        <div className="mt-2 inline-flex text-black items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-sm font-medium">
                            {profileData.role === 'admin' && (
                                <>
                                    <FaUserShield className="mr-1" /> Administrator
                                </>
                            )}
                            {profileData.role === 'teacher' && (
                                <>
                                    <FaChalkboardTeacher className="mr-1" /> Teacher
                                </>
                            )}
                            {!['admin', 'teacher'].includes(profileData.role) && (
                                <>
                                    <FaUserGraduate className="mr-1" /> User
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaIdCard className="mr-2 text-blue-600" />
                                Basic Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <FaEnvelope className="mr-2" /> Email
                                    </p>
                                    <p className="font-medium mt-1">{profileData.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <FaPhone className="mr-2" /> Phone
                                    </p>
                                    <p className="font-medium mt-1">{profileData.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <FaCalendarAlt className="mr-2" /> Member Since
                                    </p>
                                    <p className="font-medium mt-1">{formatDate(profileData.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Role-Specific Information */}
                        <div className="space-y-4">
                            {profileData.role === 'teacher' && (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <FaChalkboardTeacher className="mr-2 text-green-600" />
                                        Teaching Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Assigned Class</p>
                                            <p className="font-medium mt-1">
                                                {profileData.assignedClassName || 'Not assigned'}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {profileData.role === 'admin' && (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <FaUserShield className="mr-2 text-indigo-600" />
                                        Admin Privileges
                                    </h3>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-700">
                                            You have full administrative access to manage the system.
                                        </p>
                                    </div>
                                </>
                            )}

                            {!['admin', 'teacher'].includes(profileData.role) && (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <FaHome className="mr-2 text-blue-600" />
                                        Personal Information
                                    </h3>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-700">
                                            You can update your personal information in the settings.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;