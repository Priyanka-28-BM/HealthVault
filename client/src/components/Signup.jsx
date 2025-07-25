import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields, including role.");
      return;
    }
    try {
      // Register with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) throw new Error("Signup failed. Please check your email to confirm account.");

      // Insert role and name in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: userId, name, email, role }]);
      if (profileError) throw profileError;

      alert("Signup successful! Check your email for confirmation. Then login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', background: '#e8f5e9'}}>
      <Box sx={{ width: '50%', overflow: 'hidden' }}>
        <img
          src="/src/images/login-page.jpg"
          alt="Signup"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Box sx={{
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: "linear-gradient(135deg, #a8edea 0%, #1beabd 100%)"
      }}>
        <Paper elevation={8} sx={{
          p: 4, width: "70%", maxWidth: 480, borderRadius: 4, textAlign: "center"
        }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight={700}>Sign Up</Typography>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            <TextField label="Full Name" value={name} onChange={e => setName(e.target.value)} fullWidth sx={{ mt: 3 }} required />
            <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mt: 2 }} required />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth sx={{ mt: 2 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select label="Select Role" value={role}
              onChange={e => setRole(e.target.value)}
              fullWidth sx={{ mt: 2 }}
              required>
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 4, background: 'green', fontWeight: 600 }}>
              Create Account
            </Button>
          </form>
          <Typography sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Button onClick={() => navigate("/login")} color="primary" sx={{ textTransform: 'none', p: 0 }}>Login here</Button>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;
