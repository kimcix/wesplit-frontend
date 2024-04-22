// pages/profile.tsx
'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import OTPModal from '../components/OTPModal';
import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'

export default function Profile() {
  const [user, setUser] = useState({ username: '', email: '', tfa_enabled: false });
  const [isLoading, setLoading] = useState(true);
  const [isEditingEmail, setEditingEmail] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [isOTPModalOpen, setOTPModalOpen] = useState(false);
  const router = useRouter();

  const handleEmailEdit = () => {
    setEditEmail(user.email); 
    setEditingEmail(true);
  };

  const handleEmailChange = (e) => {
    setEditEmail(e.target.value);
  };

  const openOTPModal = () => {
    setOTPModalOpen(true);
  };
  const closeOTPModal = () => {
    setOTPModalOpen(false);
  };

  const saveEmail = async () => {
    // Assuming you have a backend endpoint '/update-profile' to handle the profile update
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const response = await fetch('http://127.0.0.1:5000/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Pass the authentication token
      },
      body: JSON.stringify({ email: editEmail }) // Send the updated email
    });

    if (response.ok) {
      const updatedUser = await response.json();
      console.log('Updated user data:', updatedUser);
      setUser((prevUser) => ({ ...prevUser, email: editEmail }));
      setEditingEmail(false);
    } else {
      // Handle errors, e.g., show an error message to the user
      console.error('Failed to update profile');
    }
  };

  const toggle2FA = async () => {
    const token = localStorage.getItem('token');
    const new2FAStatus = !user['tfa_enabled'];
    const response = await fetch('http://127.0.0.1:5000/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ '2fa_enabled': new2FAStatus })
    });
  };

  useEffect(() => {
    // This function should be called to fetch the user data
    const fetchProfile = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      try {
        const response = await fetch('http://127.0.0.1:5000/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser({
            username: userData.username,
            email: userData.email,
            tfa_enabled: userData.tfa_enabled
          });
        } else {
          throw new Error('Profile fetch failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        // If there's an error or the response is not ok, navigate back to login
        router.push('/login');
      } finally {
        setLoading(false); // Set loading to false after the request is finished
      }
    };

    fetchProfile();
  }, [router]);

  const handleBack = () => {
    router.push('/');
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const verifyOTP = async (otp) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    const response = await fetch('http://127.0.0.1:5000/verify-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Pass the authentication token
      },
      body: JSON.stringify({ otp }) // Send the OTP for verification
    });
  
    if (response.ok) {
      // If the OTP was verified successfully, you can redirect to the homepage or close the modal
      closeOTPModal();
      // Maybe set a message to the user or perform some other state update
    } else {
      // Handle errors, e.g., show an error message to the user
      console.error('Failed to verify OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TopBar title="Profile" />
      <OTPModal
        isOpen={isOTPModalOpen}
        onClose={closeOTPModal}
        onVerify={verifyOTP} // Make sure you implement this function
      />
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user.username}</h1>
      <div className="mb-4">
        <p><strong>Username:</strong> {user.username}</p>
        <strong>Email:</strong> {!isEditingEmail ? (
          <span>
            {user.email}
            <button onClick={handleEmailEdit} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">
              Edit
            </button>
          </span>
        ) : (
          <div>
            <input
              type="text"
              value={editEmail}
              onChange={handleEmailChange}
              className="border px-2 py-1 rounded"
            />
            <button onClick={saveEmail} className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700">
              Save
            </button>
          </div>
        )}
        <p>
          <strong>2FA Auth:</strong> {user['tfa_enabled'] ? 'Enabled' : 'Disabled'}
          <button onClick={toggle2FA} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">
            {user['tfa_enabled'] ? 'Disable' : 'Enable'}
          </button>
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={handleBack} className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Back to Home</button>
      </div>
      <BottomNavBar />
    </div>
  );
}