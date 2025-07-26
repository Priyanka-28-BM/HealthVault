import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Password updated! You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 4, width: 350, textAlign: "center" }}>
        <Typography variant="h5" mb={2}>Reset Password</Typography>
        <form onSubmit={handleReset}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
        {message && <Typography color="success.main" mt={2}>{message}</Typography>}
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default ResetPassword;
