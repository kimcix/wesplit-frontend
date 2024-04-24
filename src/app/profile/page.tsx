'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import OTPModal from '../components/OTPModal';
import { userManagementAPIPrefix } from '../components/apiPrefix';
import BottomNavBar from '../components/bottomNavigationBar';
import TopBar from '../components/topBar';


export default function Profile() {
  const [user, setUser] = useState({ username: '', email: '', phone_number: '', tfa_enabled: false, average_payback_time: '', total_owed: '' });
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
            average_payback_time: '',
            total_owed: '',
          });

          // Now, fetch the average payback time
          const analysisResponse = await fetch(`http://localhost:5003/user_analysis?username=${userData.username}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            setUser(prevState => ({
              ...prevState,
              average_payback_time: analysisData.average_payback_time,
              total_owed: analysisData.total_owed
            }));
          } else {
            console.error('Average payback time fetch failed');
          }

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
      const errorData = await response.json();
      console.error('Failed to update profile:', errorData);
      setErrorMessage(errorData.error);
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
      const errorData = await response.json();
      console.error('Failed to update profile:', errorData);
      setErrorMessage(errorData.error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      // Send a request to the backend to invalidate the token
      await fetch(userManagementAPIPrefix + '/logout', {
        method: 'POST',  // or GET, depending on the API
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Handle response as necessary...
    } catch (error) {
      console.error('Logout failed', error);
    }
    
    // Clear the client storage and update state
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('partial_token')
    // Update the application state
    // setUser(null); // If using context or state management
    // Redirect to login
    router.push('/login');
  };
  


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TopBar title="Profile" />
      <h1 className="text-3xl font-bold mb-10">WELCOME BACK, {user.username}</h1>
      <div className="justify-between items-center mb-2 text-gray-500">
        <strong>Average Payback Time:</strong>
        <span>{user.average_payback_time || 'N/A'}</span>
      </div>
      <div className="justify-between items-center mb-4 text-gray-500">
        <strong>Total Owed:</strong>
        <span>{user.total_owed || 'N/A'}</span>
      </div>
      <div className="profile-info w-half max-w-md mb-4 text-l">
    
        <div className="flex justify-between items-center">
          <strong>Email:</strong> {!isEditingEmail ? (
            <span>
              {user.email}
              <button onClick={handleEmailEdit} className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-400">
                Edit
              </button>
            </span>
          ) : (
            <div className='mt-2'>
              <input
                type="text"
                value={editEmail}
                onChange={handleEmailChange}
                className="border px-2 py-1 rounded"
              />
              <button onClick={saveEmail} className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-500">
                Save
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <strong>Phone Number:</strong> {!isEditingPhone ? (
            <span>
              {user.phone_number}
              <button onClick={handlePhoneEdit} className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-400">
                Edit
              </button>
            </span>
          ) : (
            <div className='mt-2'>
              <input
                type="tel"
                value={editPhone}
                onChange={handlePhoneChange}
                className="border px-2 py-1 rounded"
              />
              <button onClick={savePhone} className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-500">
                Save
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
        <strong>2FA Auth:</strong> {user.tfa_enabled ? "Enabled" : "Disabled"}
        {user.tfa_enabled ? (
          <button onClick={disable2FA} className="ml-2 px-3 py-1 bg-gray-400 text-white rounded hover:bg-yellow-500">
            Disable
          </button>
        ) : (
          <button onClick={enable2FA} className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-400">
            Enable
          </button>
        )}
      </div>
      </div>

      <div>
          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}
      </div>
    
      <div className="flex justify-center space-x-4">
        
        {/* Display error message if it exists */}
       
        <button onClick={() => router.push('/')} className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Home</button>
        <button onClick={handleLogout} className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">
          Logout
        </button>
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
