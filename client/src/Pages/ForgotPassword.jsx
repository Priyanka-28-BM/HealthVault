// client/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/update-password', // Make sure this matches your UpdatePassword route
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
