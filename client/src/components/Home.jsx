import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    // Add response logic here (optional)
  };

  return (
    <Box>
      {isChatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 450,
            height: 450,
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: 2,
            padding: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Chatbot</Typography>
            <IconButton onClick={() => setIsChatOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {chatMessages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.role === "user" ? "#4caf50" : "#f0f0f0",
                  color: msg.role === "user" ? "white" : "black",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  maxWidth: "75%",
                  fontSize: "14px",
                  wordBreak: "break-word",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {msg.role === "user" ? "You" : "Bot"}
                </Typography>
                <Typography variant="body2">{msg.content}</Typography>
              </Box>
            ))}
          </Box>
          <TextField
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
        </Box>
      )}
    </Box>
  );
};

export default Home;

