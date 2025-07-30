// client/src/components/Footer.jsx
import React from "react";
import { Box, Typography, useTheme, useMediaQuery, Link } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  // Detect if screen is small (mobile) or larger
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 3,
        px: 2,
        mt: "auto",
        textAlign: isSmallScreen ? "center" : "left",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        fontSize: isSmallScreen ? "0.9rem" : "1rem",
      }}
    >
      <Typography variant="body2" component="div">
        &copy; {new Date().getFullYear()} HealthVault. All rights reserved.
      </Typography>
      <Box>
        <Link
          href="/privacy"
          underline="hover"
          color="inherit"
          sx={{ mx: 1, cursor: "pointer" }}
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          underline="hover"
          color="inherit"
          sx={{ mx: 1, cursor: "pointer" }}
        >
          Terms of Service
        </Link>
        <Link
          href="mailto:support@healthvault.com"
          underline="hover"
          color="inherit"
          sx={{ mx: 1, cursor: "pointer" }}
        >
          Contact Us
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
