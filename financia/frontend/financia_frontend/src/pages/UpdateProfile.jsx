// src/pages/UpdateProfile.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FiEdit } from 'react-icons/fi';

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [showPicOptions, setShowPicOptions] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load user details from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setName(parsedUser.name);
        setPreviewImage(parsedUser.profileImage || '/default-profile.png');
      }
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      setUser(null);
    }
  }, []);

  // Handler to update profile (name and optionally profile image)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      const res = await axios.put('http://localhost:5000/api/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated successfully');
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', err);
    }
  };

  // Handler for manual users to change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully");
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update password");
      console.error("Change password error:", err);
    }
  };

  // Handler when a new profile image is selected from device
  const handleImageChange = (file) => {
    if (file) {
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setShowPicOptions(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-center" />
      <Navbar />
      <div className="container mx-auto py-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md max-w-md mx-auto text-center relative">
          {/* Big Circular Avatar with Edit Icon */}
          <div className="relative inline-block">
            <img
              src={previewImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <button
              onClick={() => setShowPicOptions(!showPicOptions)}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
              title="Edit Profile Picture"
            >
              <FiEdit size={16} />
            </button>
            {showPicOptions && (
              <div className="absolute left-0 right-0 mt-2 flex justify-center bg-white dark:bg-gray-700 border rounded shadow-lg z-20 p-2">
                <button
                  onClick={() => document.getElementById('fileInput').click()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Select from Device
                </button>
              </div>
            )}
          </div>
          {/* Hidden file input */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0])}
            className="hidden"
          />
          {/* Profile Update Form */}
          <form onSubmit={handleProfileUpdate} className="mb-6">
            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
            >
              Update Profile
            </button>
          </form>
          {/* Change Password Section */}
          {!user.googleId ? (
            <>
              <div className="mb-4">
                <span className="font-bold text-gray-800 dark:text-gray-100">Password:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">********</span>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Change Password
              </button>
              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="mt-4 text-left">
                  <div className="mb-2">
                    <label className="block text-gray-700 dark:text-gray-300">Old Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 dark:text-gray-300">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                Your password is managed by Google.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
