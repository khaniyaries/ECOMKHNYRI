"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setErrorMessage('Username and Password are required');
      return;
    }

    // Clear any previous error message
    setErrorMessage('');
//     try {
//       const response=await axios.post(`${API_URL}/api/v1/adminLogin`,{
//         username:username,
//         password:password
//       })
//         if(response?.data?.success){
//           localStorage.setItem('admin',username)
//           toast.success(response.data.message)
//           localStorage.setItem('isAdmin', 'true');
//           navigate('./dashboard');
//         }
//         else{
//           toast.error("There was some problem, try again..")
//         }
        
//       } catch (error) {
//         toast.error(error?.response?.data?.message)
//       }
    
   };

  return (
    <div className="relative w-full flex items-center justify-center min-h-screen bg-[#c6cddd]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[500px] h-[auto]  text-center z-10">
        <h2 className="text-2xl font-kantumruy font-bold mb-5">ADMINISTRATIVE ACCESS</h2>
        
        {/* Display error message */}
        {errorMessage && (
          <div className="text-red-500 mb-4">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Username"
              className="w-[340px] p-3 border border-gray-300 rounded-full text-lg focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
            />
            <span
              className="absolute right-10 md:right-16 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setUsername('')}
            >
              &times;
            </span>
          </div>
          <div className="relative mb-5">
            <input
              type="password"
              placeholder="Password"
              className="w-[340px] p-3 border border-gray-300 rounded-full text-lg focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            <span
              className="absolute right-10 md:right-16 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setPassword('')}
            >
              &times;
            </span>
          </div>
          <button
            type="submit"
            className="w-[170px] h-[40px] text-white py-3 rounded-lg underline text-lg bg-blue-700 font-normal flex mx-auto items-center justify-center hover:bg-black"
          >
            Login
          </button>
          <p className="mt-4 text-gray-500 text-sm">
            Only Admins Can Login
          </p>
          <p className="text-center text-sm mt-2">
          <Link href="/sign-in" className="text-gray-500 text-sm underline">
            Not An Admin?
          </Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
