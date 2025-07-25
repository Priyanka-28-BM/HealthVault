import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully!");

       setTimeout(() => {
       navigate('/login'); // Redirect to login after 2 seconds
    }, 2000);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper sx={{ p: 4, width: "400px", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">Update Password</Typography>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleUpdate}
          sx={{ mt: 2, backgroundColor: "green", "&:hover": { backgroundColor: "darkgreen" } }}
        >
          Update Password
        </Button>
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>
    </Box>
  );
};

export default UpdatePassword;
