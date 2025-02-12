import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box, Container, Grid, Paper } from "@mui/material";

export const Navbar = ({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const button = {
    marginRight: "20px",
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.3rem 1.4rem",
  };

  // Hide Navbar on home, login, and signup pages
  if (["/home", "/signup", "/login"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Navbar Section */}
      <AppBar sx={{ bgcolor: "#37474F" }}>
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "primary.contrastText" }}
          >
            HealthVault
          </Typography>

          {!isLoggedIn && (
            <>
              <Button variant="contained" style={button} color="error" component={Link} to="/login">
                Login
              </Button>

              <Button variant="contained" style={button} color="success" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Informational Section */}
      <Box sx={{ mt: 15, mb: 5, textAlign: "center", p: 4 }}>
        <Container>
          {/* Hero Section */}
          <Typography variant="h3" fontWeight="bold" color="text.primary">
            Your Personal Health Wallet
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Securely track, manage, and improve your well-being with AI-powered insights.
          </Typography>

          {/* Features Section */}
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
            {[
              { title: "⚡ Quick & Simple", desc: "Fast access to your health data anywhere." },
              { title: "📂 Easy Records Access", desc: "Manage all your medical history in one place." },
              { title: "🤖 AI-Chatbot", desc: "Get smart recommendations on home remedies & health-related queries." },
              { title: "🔒 Secure Data", desc: "Your medical records are encrypted and safe." },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
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

          {/* Call to Action */}
          <Box sx={{ mt: 11.5 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                navigate("/signup");
                window.scrollTo(0, 0); // Ensure the page starts from the top
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Navbar;
