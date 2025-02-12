import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; 
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

const Signup = () => {
    // State variables for user input and error handling
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            // Sign up the user with Supabase authentication
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) {
                throw authError;
            }

            // Insert user profile into the `profiles` table
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .insert([{ id: authData.user.id, name, email }]);

            if (profileError) {
                throw profileError;
            }

            alert("Signup successful! Check your email for confirmation.");
            navigate("/login"); // Redirect to login page
        } catch (err) {
            setError(err.message);
        }
    };

    const paperStyle = {
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "10px 10px 10px 10px",
        borderRadius: "15px",
        margin: "100px auto",
    };

    const heading = {
        fontSize: "2.5rem",
        fontWeight: "600vw",
        marginBottom: "10px",
    };

    const row = {
        marginBottom: "15px",
        width: "80%",
    };

    const btnStyle = {
        marginTop: "10px",
        padding: "10px 20px",
        backgroundColor: "blue",
        color: "white",
        fontSize: "1rem",
        fontWeight: "bold",
    };

    return (
        <Box align="center">
            <Paper
                style={paperStyle}
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
                <form onSubmit={handleSubmit}>
                    <Typography style={heading}>Signup</Typography>
                    {error && <Typography style={{ color: "red" }}>{error}</Typography>}
                    
                    <TextField
                        style={row}
                        sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                        label="Enter Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        style={row}
                        sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                        label="Enter Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        style={row}
                        sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
                        label="Enter Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" type="submit" style={btnStyle}>
                        Sign Up
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Signup;
