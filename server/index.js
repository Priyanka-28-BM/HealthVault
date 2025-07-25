const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const chatbotRoutes = require("./routes/chatbot");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Chatbot API route
app.use("/chat", chatbotRoutes);

// ✅ Root route to fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
