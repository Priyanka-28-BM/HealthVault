import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { Box, Paper, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isRegistered, setIsRegistered] = useState(false); // To track if user is already registered
    const navigate = useNavigate();

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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

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

            alert("Signup successful! Check your email for confirmation.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' ,width:'100vw'}}>
            
            {/* Left half with image */}
            <Box sx={{ 
                width: '50%', 
                height: '97%',
                overflow: 'hidden',
                backgroundColor: 'black' // Fallback if image doesn't load
            }}>
                <img 
                    src="/src/images/login-page.jpg" // Update with your image path
                    alt="Signup Background"
                    style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            {/* Right half with form */}
            <Box  sx={{
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url("https://i.pinimg.com/736x/84/44/4c/84444c1440e6c2463f6c1bc6aa159448.jpg")', // Replace with your image URL
    backgroundSize: 'cover', // Ensures the image covers the entire box
    backgroundPosition: 'center', // Centers the image
    backgroundRepeat: 'no-repeat' // Prevents image repetition
  }}>
                <Paper 
                    sx={{
                        p: 4,
                        width: '70%',
                        maxWidth: "600",
                        boxShadow: 3, 
                        borderRadius: 2, 
                        textAlign: "center"
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h4" fontWeight="bold">Signup</Typography>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                        
                        <TextField
                            fullWidth 
                            label="Enter Name" 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mt: 2 }}
                            required
                        />
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
                        <Button 
                            variant="contained" 
                            type="submit" 
                            sx={{ 
                                mt: 3, 
                                px: 4,
                                backgroundColor: 'green',
                                '&:hover': { backgroundColor: 'darkgreen' }
                            }}
                        >
                            Sign Up
                        </Button>
                    </form>

                    {isRegistered && (
                        <Typography sx={{ mt: 2 }}>
                            Already have an account?{" "}
                            <Button 
                                onClick={() => navigate("/login")} 
                                color="primary"
                                sx={{ textTransform: 'none' }}
                            >
                                Login here
                            </Button>
                        </Typography>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default Signup;
