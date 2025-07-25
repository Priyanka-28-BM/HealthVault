import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const query = new URLSearchParams(hash.replace("#", "?"));
    const access_token = query.get("access_token");
    const refresh_token = query.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(() => console.log("Session restored"))
        .catch((err) => console.error("Session restore error", err));
    }
  }, []);

  const handleUpdate = async () => {
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f4f8",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Update Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            type="password"
            label="New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            type="password"
            label="Confirm New Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Update Password
          </Button>
        </form>

        {message && (
          <Typography
            variant="body2"
            align="center"
            color={message.includes("success") ? "green" : "error"}
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UpdatePassword;

