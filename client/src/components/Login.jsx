import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Login = () => {
  // State variables for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message || "Login failed. Please try again.");
      } else {
        console.log("Login successful:", data);
        navigate("/home");
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
          p: 4,
          mt: 8,
          width: { xs: "80vw", sm: "50vw", md: "40vw", lg: "30vw", xl: "20vw" },
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <form onSubmit={handleLogin}>
          <Typography variant="h4" fontWeight="bold">Login</Typography>

          <TextField
            fullWidth
            label="Enter Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Enter Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
            required
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

          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

          <Button variant="contained" type="submit" sx={{ mt: 3, px: 4, backgroundColor: "green" }}>
            Login
          </Button>

          <Typography sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Button onClick={() => navigate("/signup")} color="primary">
              Sign up here
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
