import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

export const Navbar = ({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
    { name: "Medical Files", path: "/medicalfiles" },
    isLoggedIn
      ? { name: "Logout", path: "/logout" }
      : { name: "Login", path: "/login" }
  ];

  // Hide Navbar on login and signup pages only
  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <AppBar
        sx={{
          bgcolor: darkMode ? "#212121" : "#589F78",
          borderRadius: "0 0 16px 16px",
          px: 2,
          boxShadow: 3,
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "primary.contrastText",
              textDecoration: "none",
            }}
          >
            HealthVault
          </Typography>

          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            sx={{ mr: 2 }}
          />

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                >
                  <List>
                    {navItems.map((item) => (
                      <ListItem key={item.name} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={item.path}
                          sx={{ textAlign: "center" }}
                        >
                          <ListItemText primary={item.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </SwipeableDrawer>
            </>
          ) : (
            <>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{
                    mx: 1,
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
              {isLoggedIn && (
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/profile"
                >
                  <Avatar sx={{ bgcolor: "#fff", color: "#000" }}>
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
