'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import OTPModal from '../components/OTPModal';
import { userManagementAPIPrefix } from '../components/apiPrefix';
import BottomNavBar from '../components/bottomNavigationBar';
import TopBar from '../components/topBar';


export default function Profile() {
  const [user, setUser] = useState({ username: '', email: '', phone_number: '', tfa_enabled: false });
  const [isLoading, setLoading] = useState(true);
  const [isEditingEmail, setEditingEmail] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handlePhoneEdit = () => {
    setIsEditingPhone(true);
  };
  
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only digits and limit to 10 characters
    if (value.match(/^\d{0,10}$/)) {
      setEditPhone(value);
    }
  };

  const disable2FA = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(userManagementAPIPrefix + '/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ '2fa_enabled': false }) // Update the 2fa_enabled to false
    });

    if (response.ok) {
      console.log('2FA disabled successfully');
      setUser((prevUser) => ({ ...prevUser, tfa_enabled: false }));
    } else {
      console.error('Failed to disable 2FA');
      // Handle errors here, possibly showing an error message to the user
    }
  };
  const enable2FA = async () => {
    const token = localStorage.getItem('token');
  
    try {
      // Call the API to initiate the 2FA process
      const response = await fetch(userManagementAPIPrefix + '/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ '2fa_enabled': true })
      });
  
      if (response.ok) {
        console.log('2FA initiation successful');
        setShowOTPModal(true);
      } else {
        // If the response is not okay, log the error or show an error message
        console.error('Failed to initiate 2FA');
        const errorResponse = await response.json();
        console.error(errorResponse.msg);
        // Handle different response statuses here, e.g., 400 or 404
      }
    } catch (error) {
      console.error('Error during 2FA initiation:', error);
    }
  };

  // This function will be called when the OTP modal submits
  const verifyOTP = async (otpValue: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(userManagementAPIPrefix + '/verify-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ otp: otpValue })
    });

    if (response.ok) {
      console.log(otpValue)
      const data = await response.json()
      setUser((prevUser) => ({ ...prevUser, tfa_enabled: true }));
      setShowOTPModal(false); // Hide the OTP modal on success
    } else {
      console.error('Failed to verify 2FA OTP');
      // You might want to display an error message to the user here
    }
  };

  // Fetches user profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(userManagementAPIPrefix + '/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          setUser({
            username: userData.username,
            email: userData.email,
            phone_number: userData.phone,
            tfa_enabled: userData['2fa_enabled'],
          });
        } else {
          throw new Error('Profile fetch failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Handles the initiation of email editing
  const handleEmailEdit = () => {
    setEditEmail(user.email); 
    setEditingEmail(true);
  };

  // Handles changes to the email input field
  const handleEmailChange = (e) => {
    setEditEmail(e.target.value);
  };

  // Saves the updated email to the backend
  const saveEmail = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(userManagementAPIPrefix + '/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email: editEmail })
    });

    if (response.ok) {
      setUser((prevUser) => ({ ...prevUser, email: editEmail }));
      setEditingEmail(false);
    } else {
      console.error('Failed to update profile');
    }
  };

  const savePhone = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(userManagementAPIPrefix + '/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ phone_number: editPhone })
    });
    console.log(response)
    if (response.ok) {
      setUser((prevUser) => ({ ...prevUser, phone_number: editPhone }));
      setIsEditingPhone(false);
    } else {
      console.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TopBar title="Profile" />
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user.username}</h1>
      <div className="mb-4">
        <p><strong>Username:</strong> {user.username}</p>
        <div>
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
        </div>
        <div>
          <strong>Phone Number:</strong> {!isEditingPhone ? (
            <span>
              {user.phone_number}
              <button onClick={handlePhoneEdit} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">
                Edit
              </button>
            </span>
          ) : (
            <div>
              <input
                type="tel"
                value={editPhone}
                onChange={handlePhoneChange}
                className="border px-2 py-1 rounded"
              />
              <button onClick={savePhone} className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700">
                Save
              </button>
            </div>
          )}
        </div>
        <div>
        <strong>2FA Auth:</strong> {user.tfa_enabled ? "Enabled" : "Disabled"}
        {user.tfa_enabled ? (
          <button onClick={disable2FA} className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700">
            Disable
          </button>
        ) : (
          <button onClick={enable2FA} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">
            Enable
          </button>
        )}
      </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={() => router.push('/')} className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Back to Home</button>
      </div>
      {showOTPModal && (
        <OTPModal
          onVerify={verifyOTP}
          onCancel={() => setShowOTPModal(false)}
        />
      )}
      <BottomNavBar />
    </div>
  );
}
