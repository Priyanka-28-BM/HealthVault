import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; // Ensure this is correctly configured

const Login = () => {
  // State variables for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Authenticate user with Supabase using email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Login failed. Please try again.");
      } else {
        console.log("Login successful:", data);
        navigate("/home"); // Redirect to homepage
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection and try again.");
    }
  };

  return (
    <Box align="center">
      <Paper
        style={paperstyle}
        sx={{
          width: {
            xs: "80vw",
            sm: "50vw",
            md: "40vw",
            lg: "30vw",
            xl: "20vw",
          },
          height: "60vh",
        }}
      >
        <form onSubmit={handleLogin}>
          <Typography style={heading}>Login</Typography>

          <TextField
            style={row}
            label="Enter Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            style={row}
            label="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          {error && <Typography style={errorText}>{error}</Typography>}
          <Button variant="contained" type="submit" style={btnStyle}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
