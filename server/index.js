const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    // Insert user into Supabase
    const { data, error } = await supabase
        .from("users")
        .insert([{ name, email, password }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Fetch user from Supabase
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !data) {
        return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords (Note: Supabase doesn't handle password hashing for you)
    if (data.password !== password) {
        return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", user: data });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});