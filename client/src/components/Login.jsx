import React, { useState } from "react";
import {
  Box, Button, Paper, TextField, Typography, IconButton, InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email, password,
      });
      if (loginError) throw loginError;
      const userId = loginData.user?.id;
      if (!userId) throw new Error("Invalid login.");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (profileError || !profileData) throw new Error("Role not found. Contact admin.");

      // Routing based on role
      const userRole = profileData.role;
      if (userRole === "admin") navigate("/admin-dashboard");
      else if (userRole === "doctor") navigate("/doctor-dashboard");
      else if (userRole === "patient") navigate("/patient-dashboard");
      else throw new Error("Unknown role. Contact admin.");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#e0f7fa" }}>
      <Box sx={{ width: "50%", height: "97%", overflow: "hidden" }}>
        <img
          src="/src/images/login-page.jpg"
          alt="Login"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Box sx={{
        width: "50%", display: "flex", justifyContent: "center", alignItems: "center",
        background: "linear-gradient(135deg, #f8ffae 0%, #43cea2 100%)"
      }}>
        <Paper sx={{
          p: 4, width: "70%", maxWidth: 480, borderRadius: 4, textAlign: "center"
        }}>
          <form onSubmit={handleLogin}>
            <Typography variant="h4" fontWeight={700}>Login</Typography>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            <TextField
              label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              fullWidth sx={{ mt: 3 }} required
            />
            <TextField
              label="Password" type={showPassword ? "text" : "password"}
              value={password} onChange={e => setPassword(e.target.value)}
              fullWidth sx={{ mt: 2 }} required
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
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 4, background: 'green', fontWeight: 600 }}>
              Login
            </Button>
          </form>
          <Typography sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Button onClick={() => navigate("/signup")} color="primary" sx={{ textTransform: "none", p: 0 }}>
              Sign up here
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
