// pages/profile.tsx
'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BottomNavBar from '../components/bottomNavigationBar'
import TopBar from '../components/topBar'

export default function Profile() {
  const [user, setUser] = useState({ username: '', email: '' });
  const [isLoading, setLoading] = useState(true);
  const [isEditingEmail, setEditingEmail] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const router = useRouter();

  const handleEmailEdit = () => {
    setEditEmail(user.email); 
    setEditingEmail(true);
  };

  const handleEmailChange = (e) => {
    setEditEmail(e.target.value);
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
            email: userData.email
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


  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user.username}</h1>
      <div className="mb-8">
        {/* Ideally, you would fetch and display the user's image here */}
        <Image src="/default-profile.png" alt="Profile Picture" width={128} height={128} />
      </div>
      <div className="mb-4">
        <p><strong>Username:</strong> {user.username}</p>
        {/* <p><strong>Email:</strong> {user.email}</p> */}
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
      <div className="flex justify-center space-x-4">
        <button onClick={handleBack} className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Back to Home</button>
      </div>
      <BottomNavBar></BottomNavBar>
    </div>
    
  );
}


// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';

// export default function Profile(){
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const router = useRouter();

//   const token = window.localStorage.getItem('token');

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold mb-4">Welcome back, Username</h1>
//       <div className="mb-8">
//         {/* insert image gere */}
//       </div>
//       <form className="w-64" >
//         <div className="mb-4">
//           <label htmlFor="username" className="block mb-1">Username</label>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="password" className="block mb-1">Password</label>
//         </div>
//         <div className="flex justify-center space-x-4">
//           <button type="submit" className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Back</button>
//         </div>

//       </form>
//     </div>
//   );

// }
