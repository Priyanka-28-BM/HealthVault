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
  <div style={{
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
    padding: '1rem'
  }}>
    <div style={{
      background: '#fff',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
    }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Forgot Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            width: '100%',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        <button type="submit" style={{
          width: '100%',
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Send Reset Link
        </button>
      </form>
      {message && (
        <p style={{
          marginTop: '1rem',
          color: message.includes('sent') ? 'green' : 'red',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  </div>
);
}

export default ForgotPassword;
