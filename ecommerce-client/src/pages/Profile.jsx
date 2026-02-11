// src/pages/Profile.jsx   ← full updated version using daisyUI classes

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
const API = import.meta.env.VITE_API_URL ;

  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    navigate('/login');
    return null;
  }

  let currentUser;
  try {
    currentUser = JSON.parse(userJson);
    if (!currentUser?.id) throw new Error('Invalid user');
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    return null;
  }

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    phone: currentUser.phone || '',
    address: currentUser.address || '',
    avatar: null,
  });



  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('phone', formData.phone);
      formPayload.append('address', formData.address);
   

      const res = await axios.put(`${API}/api/auth/profile`, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

  
   

      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsPasswordSubmitting(true);

    try {
      await axios.put(
        `${API}/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-base-content">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl mb-10">
          <div className="card-body p-6 md:p-8">
            <h2 className="card-title text-2xl mb-6">Update Profile</h2>

            {message.text && (
              <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  
                  </div>
                </div>
                <label className="btn btn-outline btn-sm mt-5 cursor-pointer">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isSubmitting}
                  />
                </label>
              </div>

              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email (cannot change)</span>
                </label>
                <input
                  type="email"
                  value={currentUser.email || ''}
                  className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+251 9xx xxx xxx"
                  className="input input-bordered w-full"
                  disabled={isSubmitting}
                />
              </div>

              {/* Address */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-28 w-full"
                  placeholder="Your full delivery address"
                  disabled={isSubmitting}
                />
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Password Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6 md:p-8">
            <h2 className="card-title text-2xl mb-6">Change Password</h2>

            {passwordMessage.text && (
              <div className={`alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                  disabled={isPasswordSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                  minLength={6}
                  disabled={isPasswordSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                  disabled={isPasswordSubmitting}
                />
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  type="submit"
                  className={`btn btn-warning ${isPasswordSubmitting ? 'btn-disabled' : ''}`}
                  disabled={isPasswordSubmitting}
                >
                  {isPasswordSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;