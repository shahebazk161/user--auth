import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const navigate = useNavigate(); 

  // Step 1: Send OTP
  const handleEmail = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5002/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email })
    });
    const data = await res.text();
    setMsg(data);
    if (res.ok) setStep(2);
  };

// Step 2: Verify OTP
const handleOtp = async (e) => {
  e.preventDefault();
  const res = await fetch('http://localhost:5002/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email, otp })
  });
  const data = await res.text();
  setMsg(data);
  if (res.ok) setStep(3);
 
};

// Step 3: Reset Password
const handleReset = async (e) => {
  e.preventDefault();
  const res = await fetch('http://localhost:5002/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// Sahi (backend ko yahi chahiye)
body: new URLSearchParams({ email, password: newPass })  });
  const data = await res.text();
  setMsg(data);
  console.log('RESET status:', res.status, 'msg:', data);
  if (res.ok) {
    setTimeout(() => navigate('/login'), 1500); // Sirf yahan redirect karo
  }
  // Optionally, you can add logic here to redirect or inform the user of success
};

  return (
    <div className="signup-container">
      <h2>Forgot Password</h2>
      {msg && <div style={{color: "green"}}>{msg}</div>}

      {step === 1 && (
        <form onSubmit={handleEmail}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          /><br />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={e => setOtp(e.target.value)}
          /><br />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter new password"
            required
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
          /><br />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;