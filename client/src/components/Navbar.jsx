import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logout from "./Logout";

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const button = {
    marginRight: "20px",
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.3rem 1.4rem",
  };
  return (
    <AppBar sx={{ bgcolor: '#37474F' // Charcoal Gray
    }}>
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
            <Logout></Logout>
          </>
        ) : (
          <Logout setIsLoggedIn={setIsLoggedIn} />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
