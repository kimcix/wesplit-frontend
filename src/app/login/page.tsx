// pages/login.tsx

'use client'

import { useState } from 'react';
import Image from 'next/image';
import OTPModal from '../components/OTPModal';
import { useRouter } from 'next/navigation';
import { userManagementAPIPrefix } from '../components/apiPrefix';


export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const response = await fetch(userManagementAPIPrefix + '/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });


    if (response.ok){
      const data = await response.json();
      console.log('Token:', data);
      if (data['2fa_required'] === true){
        console.log('Partial token:', data.partial_token);
        localStorage.setItem('partial_token', data.partial_token);
        localStorage.setItem('username', data.username);
        setShowOTPModal(true);
      }else{
        // if 2fa_enabled = false, process as normal
        console.log('Access Token:', data.access_token);
        setMessage('User registered successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('username', data.username);
          console.log("login ok")
        }
        router.push('/profile');
      }
      // Handle your token here, store it in state, or save it in localStorage/sessionStorage
      // console.log('Access Token:', data.access_token);
      // setMessage('User registered successfully!');
      // if (typeof window !== 'undefined') {
      //   localStorage.setItem('token', data.access_token);
      //   localStorage.setItem('username', data.username);
      //   console.log("login ok")
      // }
      // router.push('/profile');
    }else{
      const errorData = await response.json();
      console.log('Error:', errorData);
      setMessage(errorData.error);
    }
    
  }

  // This function will be called when the OTP modal submits
  const verifyOTP = async (otpValue: string) => {
    const partial_token = localStorage.getItem('partial_token');
    const response = await fetch(userManagementAPIPrefix +'/verify-2fa-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${partial_token}`
      },
      body: JSON.stringify({ otp: otpValue })
    });

    if (response.ok) {
      console.log(otpValue)
      const data = await response.json()
      setShowOTPModal(false);
      console.log('Access Token:', data.access_token);
        setMessage('User registered successfully!');
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('username', data.username);
          console.log("login ok")
        }
        router.push('/profile');
    } else {
      console.error('Failed to verify 2FA OTP');
      // You might want to display an error message to the user here
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Log In</h1>
      <div className="mb-8">
        {/* insert image gere */}
      </div>
      <form className="w-64" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        {/* Display error message if it exists */}
        {message && (
          <div className="mb-4 text-red-500">{message}</div>
        )}
        <div className="flex justify-center space-x-4">
          <button type="submit" className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Login</button>
          <button type="submit" className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Back</button>
        </div>

      </form>
      {showOTPModal && (
        <OTPModal
          onVerify={verifyOTP}
          onCancel={() => setShowOTPModal(false)}
        />
      )}
    </div>
  );

}