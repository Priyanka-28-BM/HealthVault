import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button
} from "@mui/material";

const features = [
  { title: "⚡ Quick & Simple", desc: "Fast access to your health data anywhere." },
  { title: "📂 Easy Records Access", desc: "Manage all your medical history in one place." },
  { title: "🤖 AI-Chatbot", desc: "Get smart recommendations on home remedies & health-related queries." },
  { title: "🔒 Secure Data", desc: "Your medical records are encrypted and safe." },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mt: 10,
        py: 6,
        px: 2,
        backgroundImage:
          "url('https://i.pinimg.com/736x/84/44/4c/84444c1440e6c2463f6c1bc6aa159448.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}
    >
      <Container>
        <Typography variant="h3" fontWeight="bold" color="text.primary" align="center">
          Your Personal Health Wallet
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Securely track, manage, and improve your well-being with AI-powered insights.
        </Typography>

        {/* Card Grid Box */}
        <Box sx={{ mt: 6, mb: 10 }}>
          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: "100%",
                    backgroundColor: "#f5f5dc",
                    textAlign: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Button Box with margin */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              navigate("/signup");
              window.scrollTo(0, 0);
            }}
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              background: "linear-gradient(to right, #00c853, #64dd17)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(to right, #00bfa5, #00e676)",
              },
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
