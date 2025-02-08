import React from "react";
import { Box, Link, Button, Paper, TextField, Typography } from "@mui/material";

export const Login = () => {
  const heading = { fontSize: "2.5rem", fontWeight: "600vw" };
  const paperstyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px 10px",
  };
  const row = { display: "flex", marginTop: "1.2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "green",
    borderRadius: "0.5rem",
  };

  return (
    <Box align="center">
      <Paper
        style={paperstyle}
        sx={{
          width: {
            xs: "80vw",
            sm: "50vw", // 600
            md: "40vw", // 900
            lg: "30vw", // 1200
            xl: "20vw", // 1536
          },
          height: "60vh",
        }}
      >
        <form>
          <Typography style={heading}>Login</Typography>

          <TextField
            style={row}
            sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
            label="Enter Email"
            type="email"
          ></TextField>
          <TextField
            style={row}
            sx={{ label: { fontWeight: "700", fontSize: "1.3rem" } }}
            label="Enter Password"
            type="password"
          ></TextField>
          <Button variant="contained" type="submit" style={btnStyle}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;