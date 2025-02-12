import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const Navbar = ({ isLoggedIn }) => {
  const location = useLocation(); // Get the current route
  const button = {
    marginRight: "20px",
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.3rem 1.4rem",
  };

  // Only display the Navbar on the Signup and Login pages
  if (location.pathname !== "/signup" && location.pathname !== "/login") {
    return null;
  }

  return (
    <AppBar
      sx={{
        bgcolor: "#37474F", // Charcoal Gray
      }}
    >
      <Toolbar>
        <Typography
          variant="h4"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "primary.contrastText",
          }}
        >
          HealthVault
        </Typography>

        {!isLoggedIn ? (
          <>
            <Button
              variant="contained"
              style={button}
              color="error"
              component={Link}
              to="/login"
            >
              Login
            </Button>

            <Button
              variant="contained"
              style={button}
              color="success"
              component={Link}
              to="/signup"
            >
              Signup
            </Button>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
