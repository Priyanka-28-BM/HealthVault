import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; 
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <Box align="center">
            <Paper 
                sx={{
                    p: 4, mt: 8,
                    width: { xs: "80vw", sm: "50vw", md: "40vw", lg: "30vw", xl: "20vw" },
                    boxShadow: 3, borderRadius: 2, textAlign: "center"
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4" fontWeight="bold">Signup</Typography>
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    
                    <TextField
                        fullWidth label="Enter Name" type="text" 
                        value={name} onChange={(e) => setName(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth label="Enter Email" type="email" 
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth label="Enter Password" type="password" 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <Button variant="contained" type="submit" sx={{ mt: 3, px: 4 }}>
                        Sign Up
                    </Button>
                </form>

                {/* Show login link if user is already registered */}
                {isRegistered && (
                    <Typography sx={{ mt: 2 }}>
                        Already have an account?{" "}
                        <Button onClick={() => navigate("/login")} color="primary">
                            Login here
                        </Button>
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Signup;
