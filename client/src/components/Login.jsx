import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Fade,
  Container,
  useTheme,
  alpha,
} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Login = () => {
  // State variables for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Login failed. Please try again.");
      } else {
        console.log("Login successful:", data);
        navigate("/home");
      }
    } catch (err) {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Left half with image and overlay */}
      <Box
        sx={{
          width: "50%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="/src/images/login-page.jpg"
          alt="Login Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(67, 160, 71, 0.6) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
            textAlign: "center",
            padding: 4,
          }}
        >
          <Fade in timeout={1000}>
            <Box>
              <Typography variant="h2" fontWeight="700" sx={{ mb: 2, textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                Welcome Back
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 400, textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
                Sign in to continue your journey with us
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>

      {/* Right half with form */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "15%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(45deg, rgba(76, 175, 80, 0.15), rgba(129, 199, 132, 0.15))",
            animation: "float 4s ease-in-out infinite reverse",
          }}
        />

        <Fade in timeout={1200}>
          <Paper
            elevation={24}
            sx={{
              p: 5,
              width: "85%",
              maxWidth: 450,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: "linear-gradient(90deg, #4CAF50, #81C784, #4CAF50)",
              },
            }}
          >
            <form onSubmit={handleLogin}>
              <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <LoginIcon sx={{ fontSize: 32, color: "#4CAF50" }} />
                <Typography 
                  variant="h4" 
                  fontWeight="700"
                  sx={{
                    background: "linear-gradient(45deg, #4CAF50, #81C784)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Login
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ 
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.15)",
                    },
                    "&.Mui-focused": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.25)",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4CAF50",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4CAF50",
                    borderWidth: 2,
                  },
                }}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ 
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.15)",
                    },
                    "&.Mui-focused": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.25)",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4CAF50",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4CAF50",
                    borderWidth: 2,
                  },
                }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{
                          color: "#4CAF50",
                          "&:hover": {
                            backgroundColor: alpha("#4CAF50", 0.1),
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Fade in>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: alpha("#f44336", 0.1),
                      border: "1px solid #f44336",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="error" variant="body2" fontWeight="500">
                      {error}
                    </Typography>
                  </Paper>
                </Fade>
              )}

              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                fullWidth
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #4CAF50, #66BB6A)",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(45deg, #43A047, #4CAF50)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.6)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(45deg, #9E9E9E, #BDBDBD)",
                    transform: "none",
                    boxShadow: "none",
                  },
                }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <Box
                sx={{
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: alpha("#000", 0.1),
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Don't have an account?
                </Typography>
                <Button
                  onClick={() => navigate("/signup")}
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontWeight: "600",
                    color: "#4CAF50",
                    "&:hover": {
                      backgroundColor: alpha("#4CAF50", 0.1),
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Create Account.
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Login;