import React, { useState } from 'react';
import '../modal.css';

const OTPInput = ({ length, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false; // Prevent non-numerical input
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus to next input on entry
    if (element.nextSibling) {
      element.nextSibling.focus();
    }

    // If filled all inputs, call onComplete
    if (newOtp.every(num => num !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="otp-inputs">
      {otp.map((data, index) => {
        return (
          <input
            key={index}
            type="text"
            value={data}
            onChange={e => handleChange(e.target, index)}
            onFocus={e => e.target.select()}
            className="otp-box"
          />
        );
      })}
    </div>
  );
};

const OTPModal = ({ onVerify, onCancel }) => {
  const handleComplete = (otp) => {
    console.log("Entered OTP is:", otp);
    onVerify(otp);
  };

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal-content">
        <h2>OTP Input</h2>
        <p>Enter your one-time password</p>
        <OTPInput length={6} onComplete={handleComplete} />
        {/* <button onClick={onVerify}>Verify</button> */}
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default OTPModal;
