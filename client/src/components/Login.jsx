import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Google, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
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

      const userRole = profileData.role;
      if (userRole === "admin") navigate("/admin-dashboard");
      else if (userRole === "doctor") navigate("/doctor-dashboard");
      else if (userRole === "patient") navigate("/patient-dashboard");
      else throw new Error("Unknown role. Contact admin.");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) {
        setResetMessage(error.message);
      } else {
        setResetMessage("Reset link sent! Please check your email.");
      }
    } catch (err) {
      setResetMessage("Failed to send reset link.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) {
        setError(error.message || "Google Login Failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left Image */}
      <Box sx={{ width: "50%", height: "97%", overflow: "hidden" }}>
        <img
          src="/src/images/login-page.jpg"
          alt="Login Visual"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Right Form */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: "70%",
            maxWidth: "500px",
            borderRadius: 2,
            boxShadow: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Login
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={() => setShowResetDialog(true)}
              variant="text"
              sx={{ mt: 1, mb: 2, float: "right", textTransform: "none" }}
            >
              Forgot Password?
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={loading}
            startIcon={<Google />}
            sx={{
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
            Don’t have an account?{" "}
            <Button onClick={() => navigate("/signup")} sx={{ textTransform: "none" }}>
              Sign up here
            </Button>
          </Typography>
        </Paper>
      </Box>

      {/* Reset Password Dialog */}
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
