import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./signup.css";
import ForgetPassword from "./forgetpass";
function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  
    const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      setMsg("Passwords do not match!");
      return;
    }
    const res = await fetch('http://localhost:5002/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, password })
    });
      const mas = await res.text(); 
console.log("Backend response:", mas);
    if (res.ok) {
      alert(mas);
      navigate('/login');
    } else {
      alert('Signup failed!');
    }
  };
  return (
    <div>
      <div className="signup-container">
        <h2>Signup Page</h2>
        {msg && <div style={{color: "red"}}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={cpassword}
            onChange={e => setCPassword(e.target.value)}
          /><br />
          <button type="submit">Signup</button>
        </form>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

export default Signup;