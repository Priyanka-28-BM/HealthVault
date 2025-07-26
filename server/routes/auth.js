const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || "Invalid credentials" });
    }

    const user = data.user;

    // Step 2: Fetch the user's role from profiles table using UID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.role) {
      return res.status(403).json({ error: "Role not found. Contact admin." });
    }

    // Step 3: Return user, role, and session
    return res.status(200).json({
      message: "Login successful",
      user,
      role: profile.role,
      session: data.session,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
