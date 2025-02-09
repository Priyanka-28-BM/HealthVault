const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
//const chatbot = require("./routes/chatbot"); // Import chatbot logic

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Route for chatbot interactions
//app.use("/chat", chatbot);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
