const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clears session cookie
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
