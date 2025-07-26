   password-reset-feature
// src/components/Login.jsx
import React, { useState } from 'react';
import React, { useState, useEffect } from "react";
   main
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
     password-reset-feature
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import loginImage from '../images/login-page.jpg'; // Make sure the image is in /src/images/

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
=======
} from "@mui/material";
import { Divider } from "@mui/material";
import { Google } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Login = () => {
  // State variables for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // a function to redirect user to home if he/she is logged in
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };
    checkSession();

    // for listening to the real-time login-events so that the user can be redirected
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/home");
      }
    });

    // cleanup function
    return () => subscription.unsubscribe();
  }, [navigate]);

  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const paperstyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.2)",
  };
  const row = { display: "flex", marginTop: "1.2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "green",
    borderRadius: "0.5rem",
  };
  const errorText = { color: "red", marginTop: "1rem", fontWeight: "bold" };
     main

  const handleLogin = async (e) => {
    e.preventDefault();
   password-reset-feature
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/home');
    }
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: 'http://localhost:5173/update-password',
    });

    if (error) {
      setResetMessage(error.message);
    } else {
      setResetMessage('Reset link sent! Please check your email.');

    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Login failed. Please try again.");
      } else {
        console.log("Login successful:", data);
        navigate("/home");
      }
    } catch (err) {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // a function to handle Google OAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        setError(error.message || "Google Login Failed");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
     main
    }
  };

  return (
     password-reset-feature
    <Box sx={{ height: '100vh', display: 'flex', backgroundColor: '#f5f5f5' }}>
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>

    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left half with image */}
      <Box
        sx={{
          width: "50%",
          height: "97%",
          overflow: "hidden",
        }}
      >
       main
        <img
          src={loginImage}
          alt="Login Visual"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

     password-reset-feature
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '90%', maxWidth: 400 }}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            Login to HealthVault
          </Typography>

      {/* Right half with form */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            'url("https://i.pinimg.com/736x/84/44/4c/84444c1440e6c2463f6c1bc6aa159448.jpg")', // Replace with your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", // Prevents image repetition
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: "70%",
            maxWidth: "600",
            boxShadow: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <form onSubmit={handleLogin}>
            <Typography variant="h4" fontWeight="bold">
              Login
            </Typography>
     main

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />


            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
   password-reset-feature

              variant="text"
              color="primary"
              sx={{ mt: 1, mb: 1, textTransform: "none", float: "right" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Button>

            <Button
              variant="contained"
     main
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
     password-reset-feature


            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={loading}
              startIcon={<Google />}
              sx={{
                mb: 2,
                py: 1.5,
                borderColor: "#4285F4",
                color: "#4285F4",
                "&:hover": {
                  borderColor: "#357ae8",
                  backgroundColor: "rgba(66, 133, 244, 0.04)",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}
            >
              {loading ? "Signing in..." : "Continue with Google"}
            </Button>

            <Typography sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <Button
                onClick={() => navigate("/signup")}
                color="primary"
                sx={{ textTransform: "none" }}
              >
                Sign up here
              </Button>
            </Typography>
     main
          </form>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/signup">Don't have an account?</Link>
            <Button onClick={() => setShowResetDialog(true)} size="small">
              Forgot Password?
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your email"
            type="email"
            fullWidth
            margin="dense"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          {resetMessage && (
            <Typography sx={{ mt: 1 }} color="primary">
              {resetMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordReset} variant="contained">
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
