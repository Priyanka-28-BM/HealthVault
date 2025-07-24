import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment,
  Fade,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();

    const steps = ['Personal Info', 'Account Details', 'Complete'];

    // Countdown effect for auto-redirect
    useEffect(() => {
        let timer;
        if (showSuccessDialog && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (showSuccessDialog && countdown === 0) {
            navigate("/login");
        }
        return () => clearTimeout(timer);
    }, [showSuccessDialog, countdown, navigate]);

    // Check if user is already registered
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsRegistered(true);
            }
        };
        checkUser();
    }, []);

    // Update active step based on form completion
    useEffect(() => {
        if (name && email && password) {
            setActiveStep(2);
        } else if (name && email) {
            setActiveStep(1);
        } else if (name) {
            setActiveStep(1);
        } else {
            setActiveStep(0);
        }
    }, [name, email, password]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) {
                throw authError;
            }

            const { error: profileError } = await supabase
                .from("profiles")
                .insert([{ id: authData.user.id, name, email }]);

            if (profileError) {
                throw profileError;
            }

            // Show success dialog instead of alert
            setShowSuccessDialog(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle manual redirect to login
    const handleGoToLogin = () => {
        setShowSuccessDialog(false);
        navigate("/login");
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            {/* Left half with image and overlay */}
            <Box sx={{
                width: '50%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <img
                    src="/src/images/login-page.jpg"
                    alt="Signup Background"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
                        background: "linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(67, 160, 71, 0.7) 100%)",
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
                                Join Us Today
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 400, textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
                                Create your account and start your amazing journey
                            </Typography>
                        </Box>
                    </Fade>
                </Box>
            </Box>

            {/* Right half with form */}
            <Box sx={{
                width: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                position: 'relative',
            }}>
                {/* Decorative elements */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "15%",
                        right: "15%",
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))",
                        animation: "float 5s ease-in-out infinite",
                        "@keyframes float": {
                            "0%, 100%": { transform: "translateY(0px)" },
                            "50%": { transform: "translateY(-15px)" },
                        },
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "20%",
                        left: "10%",
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, rgba(76, 175, 80, 0.08), rgba(129, 199, 132, 0.08))",
                        animation: "float 7s ease-in-out infinite reverse",
                    }}
                />

                <Fade in timeout={1200}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: 5,
                            width: '85%',
                            maxWidth: 500,
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
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                                <PersonAddIcon sx={{ fontSize: 32, color: "#4CAF50" }} />
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
                                    Sign Up
                                </Typography>
                            </Box>

                            {/* Progress Stepper */}
                            <Box sx={{ mb: 4 }}>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel
                                                sx={{
                                                    "& .MuiStepLabel-label": {
                                                        fontSize: "0.75rem",
                                                        fontWeight: 500,
                                                    },
                                                    "& .MuiStepIcon-root": {
                                                        color: "#E0E0E0",
                                                        "&.Mui-active": {
                                                            color: "#4CAF50",
                                                        },
                                                        "&.Mui-completed": {
                                                            color: "#4CAF50",
                                                        },
                                                    },
                                                }}
                                            >
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>

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

                            <TextField
                                fullWidth
                                label="Full Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: "#4CAF50" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                required
                            />

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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ color: "#4CAF50" }} />
                                        </InputAdornment>
                                    ),
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: "#4CAF50" }} />
                                        </InputAdornment>
                                    ),
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

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isLoading}
                                fullWidth
                                sx={{
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
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <Box
                            sx={{
                                pt: 2,
                                borderTop: "1px solid",
                                borderColor: alpha("#000", 0.1),
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Already have an account?
                            </Typography>
                            <Button
                                onClick={() => navigate("/login")}
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
                                Sign In Here
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            </Box>

            {/* Success Dialog */}
            <Dialog
                open={showSuccessDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        textAlign: "center",
                        p: 2,
                    }
                }}
            >
                <DialogContent sx={{ pt: 4, pb: 2 }}>
                    <Fade in={showSuccessDialog} timeout={500}>
                        <Box>
                            <CheckCircleIcon 
                                sx={{ 
                                    fontSize: 80, 
                                    color: "#4CAF50", 
                                    mb: 2,
                                    animation: "bounce 1s ease-in-out",
                                    "@keyframes bounce": {
                                        "0%, 20%, 60%, 100%": {
                                            transform: "translateY(0)",
                                        },
                                        "40%": {
                                            transform: "translateY(-20px)",
                                        },
                                        "80%": {
                                            transform: "translateY(-10px)",
                                        },
                                    },
                                }} 
                            />
                            <Typography 
                                variant="h4" 
                                fontWeight="bold" 
                                sx={{ 
                                    mb: 2,
                                    color: "#4CAF50"
                                }}
                            >
                                Account Created Successfully!
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary" 
                                sx={{ mb: 3 }}
                            >
                                Welcome aboard! Please check your email for confirmation.
                                You'll be redirected to the login page in {countdown} seconds.
                            </Typography>
                            
                            {/* Countdown Progress */}
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={(4 - countdown) * 33.33}
                                    size={60}
                                    thickness={4}
                                    sx={{
                                        color: "#4CAF50",
                                        "& .MuiCircularProgress-circle": {
                                            strokeLinecap: "round",
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Fade>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button
                        onClick={handleGoToLogin}
                        variant="contained"
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            background: "linear-gradient(45deg, #4CAF50, #66BB6A)",
                            fontWeight: "600",
                            "&:hover": {
                                background: "linear-gradient(45deg, #43A047, #4CAF50)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                            },
                        }}
                    >
                        Go to Login Now
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Signup;