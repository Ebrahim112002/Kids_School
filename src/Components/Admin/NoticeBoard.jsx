import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { Authcontext } from '../../Script/Authcontext/Authcontext';

const NoticeBoard = () => {
  const { user, loading } = useContext(Authcontext);
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [editingNotice, setEditingNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notices
  const fetchNotices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/notices');
      setNotices(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setNotices([]); // Handle empty notices gracefully
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to fetch notices',
        });
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      console.log('User prop:', user);
      if (!user?.email) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Issue',
          text: 'Please log in to access all features.',
        });
      } else if (user.role !== 'admin') {
        console.log('User is not an admin, role:', user.role);
      }
      fetchNotices();
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'Only admins can post or update notices',
      });
      return;
    }

    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Title and content are required',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingNotice) {
        const response = await axios.patch(
          `http://localhost:3000/notices/${editingNotice._id}`,
          newNotice,
          { headers: { 'x-user-email': user.email } }
        );
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Notice updated successfully',
        });
        console.log('Update response:', response.data);
      } else {
        const response = await axios.post('http://localhost:3000/notices', newNotice, {
          headers: { 'x-user-email': user.email },
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Notice posted successfully',
        });
        console.log('Post response:', response.data);
      }
      setNewNotice({ title: '', content: '' });
      setEditingNotice(null);
      fetchNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || (editingNotice ? 'Failed to update notice' : 'Failed to post notice'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setNewNotice({ title: notice.title, content: notice.content });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you want to delete this notice?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const response = await axios.delete(`http://localhost:3000/notices/${id}`, {
          headers: { 'x-user-email': user.email },
        });
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Notice deleted successfully',
        });
        console.log('Delete response:', response.data);
        fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to delete notice',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Notice Board</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : user?.role === 'admin' ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingNotice ? 'Edit Notice' : 'Post New Notice'}
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter notice title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Content</label>
            <textarea
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              required
              placeholder="Enter notice content"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? 'Processing...' : editingNotice ? 'Update Notice' : 'Post Notice'}
            </button>
            {editingNotice && (
              <button
                type="button"
                onClick={() => {
                  setEditingNotice(null);
                  setNewNotice({ title: '', content: '' });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p>Hello {user?.name}</p>
        </div>
      )}

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Welcome to the Notice Board!</h2>
            <p>No notices are currently available.</p>
            {user?.role === 'admin' && (
              <p className="mt-2">Use the form above to add a new notice.</p>
            )}
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">{notice.title}</h3>
              <p className="text-gray-600 mt-2">{notice.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted on: {format(new Date(notice.createdAt), 'PPp')}
                {notice.updatedAt && notice.updatedAt !== notice.createdAt && (
                  <span> | Updated: {format(new Date(notice.updatedAt), 'PPp')}</span>
                )}
              </p>
              {user?.role === 'admin' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(notice)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;