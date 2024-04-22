// components/OTPModal.tsx
import { useState } from 'react';

const OTPModal = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOtp] = useState('');

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyClick = () => {
    onVerify(otp);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-lg mb-2">Enter your OTP</h2>
        <input
          type="number"
          value={otp}
          onChange={handleOTPChange}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleVerifyClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Verify
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPModal;
