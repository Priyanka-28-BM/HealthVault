import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent! Check your email.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper sx={{ p: 4, width: 350, textAlign: "center" }}>
        <Typography variant="h5" mb={2}>Forgot Password</Typography>
        <form onSubmit={handleReset}>
          <TextField
            fullWidth
            label="Enter your registered email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        {message && <Typography color="success.main" mt={2}>{message}</Typography>}
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
