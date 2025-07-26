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
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (loginError) throw loginError;

      const userId = loginData.user?.id;
      if (!userId) throw new Error("Invalid login.");

      // Get user role from user metadata first
      const userRole = loginData.user?.user_metadata?.role;

      if (userRole) {
        // If role exists in metadata, use it directly
        console.log("Role found in metadata:", userRole);
        if (userRole === "admin") navigate("/admin-dashboard");
        else if (userRole === "doctor") navigate("/doctor-dashboard");
        else if (userRole === "patient") navigate("/patient-dashboard");
        else navigate("/home"); // Default fallback
      } else {
        // Fallback: try to get from profiles table
        console.log("Checking profiles table for role...");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.log("Profile error:", profileError);
          // If profiles table doesn't exist or no role found, redirect to home
          console.log("No role found, redirecting to home");
          navigate("/home");
          return;
        }

        if (profileData?.role) {
          const tableRole = profileData.role;
          if (tableRole === "admin") navigate("/admin-dashboard");
          else if (tableRole === "doctor") navigate("/doctor-dashboard");
          else if (tableRole === "patient") navigate("/patient-dashboard");
          else navigate("/home");
        } else {
          // No role found anywhere, redirect to home as default
          console.log("No role in profiles table, redirecting to home");
          navigate("/home");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email address.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
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
          redirectTo: `${window.location.origin}/auth-redirect`,
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
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#e8f5e9" }}>
      {/* Left Image */}
      <Box
        sx={{
          width: "50%",
          overflow: "hidden",
          display: { xs: "none", md: "block" },
        }}
      >
        <img
          src="/src/images/login-page.jpg"
          alt="Login Visual"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Right Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #a8edea 0%, #1beabd 100%)",
          padding: 2,
          overflow: "auto",
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
            my: 2,
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Login
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2, fontSize: "0.875rem" }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              size="small"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 1.5 }}
            />
            <TextField
              label="Password"
              fullWidth
              margin="dense"
              size="small"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={() => setShowResetDialog(true)}
              variant="text"
              sx={{
                mt: 0.5,
                mb: 2,
                float: "right",
                textTransform: "none",
                fontSize: "0.8rem",
              }}
            >
              Forgot Password?
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1.5,
                mb: 2,
                background: "green",
                fontWeight: 600,
                py: 1.2,
                "&:hover": {
                  background: "darkgreen",
                },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
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
              py: 1.2,
              borderColor: "#4285F4",
              color: "#4285F4",
              fontSize: "0.875rem",
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

          <Typography sx={{ mt: 1, fontSize: "0.875rem" }}>
            Don't have an account?{" "}
            <Button
              onClick={() => navigate("/signup")}
              sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                p: 0,
              }}
            >
              Sign up here
            </Button>
          </Typography>
        </Paper>
      </Box>

      {/* Reset Password Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={() => {
          setShowResetDialog(false);
          setResetMessage("");
          setResetEmail("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Reset Password
          <IconButton
            onClick={() => {
              setShowResetDialog(false);
              setResetMessage("");
              setResetEmail("");
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your email"
            type="email"
            fullWidth
            margin="dense"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          {resetMessage && (
            <Typography
              sx={{ mt: 2 }}
              color={
                resetMessage.includes("sent") ? "success.main" : "error.main"
              }
            >
              {resetMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setShowResetDialog(false);
              setResetMessage("");
              setResetEmail("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordReset}
            variant="contained"
            disabled={!resetEmail}
          >
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
