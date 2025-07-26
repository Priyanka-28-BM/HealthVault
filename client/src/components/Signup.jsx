// const Signup = () => {
//   return (
//     <div className="signup-container">
//       <h2>Sign Up</h2>
//       <p>Welcome! Please fill in the details to create your account.</p>
//       {/* Signup form will go here */}
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  IconButton, InputAdornment, MenuItem, Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Signup = () => {
  const navigate = useNavigate();
  
  // State management
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Basic validation
      if (!formData.fullName || !formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role
          }
        }
      });

      if (error) throw error;

      // Success - redirect or show confirmation
      alert("Account created successfully! Please check your email for verification.");
      navigate("/login");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignUp = async () => {
    try {
      setError("");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-redirect`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#e8f5e9" }}>
      {/* Left Image Panel */}
      <Box sx={{ width: "50%", overflow: "hidden", display: { xs: "none", md: "block" } }}>
        <img
          src="/src/images/login-page.jpg"
          alt="Signup"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Right Signup Form Panel */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #a8edea 0%, #1beabd 100%)",
          padding: 2,
          overflow: "auto"
        }}
      >
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            width: "90%", 
            maxWidth: 480, 
            borderRadius: 4, 
            textAlign: "center",
            maxHeight: "95vh",
            overflow: "auto",
            my: 2
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              Sign Up
            </Typography>

            {error && (
              <Typography color="error" sx={{ mb: 2, fontSize: "0.875rem" }}>
                {error}
              </Typography>
            )}

            {/* Full Name Field */}
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="dense"
              required
              size="small"
              sx={{ mb: 1.5 }}
            />

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="dense"
              required
              size="small"
              sx={{ mb: 1.5 }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              required
              size="small"
              sx={{ mb: 1.5 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Role Dropdown */}
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="dense"
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                mt: 1.5, 
                mb: 2,
                background: "green", 
                fontWeight: 600,
                py: 1.2,
                "&:hover": {
                  background: "darkgreen"
                }
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
              OR
            </Typography>
          </Divider>

          {/* Google Signup Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignUp}
            startIcon={<GoogleIcon />}
            sx={{
              mb: 2,
              py: 1.2,
              borderColor: "#4285F4",
              color: "#4285F4",
              fontSize: "0.875rem",
              "&:hover": {
                borderColor: "#357ae8",
                backgroundColor: "rgba(66, 133, 244, 0.04)",
              },
            }}
          >
            Continue with Google
          </Button>

          {/* Login Link */}
          <Typography sx={{ mt: 1, fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/login")}
              color="primary"
              sx={{ textTransform: "none", p: 0, fontSize: "0.875rem" }}
            >
              Login here
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;