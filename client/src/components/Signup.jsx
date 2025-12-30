</Button>
</form>

<Divider sx={{ my: 3 }}>
  <Typography variant="body2" color="text.secondary">
    OR
  </Typography>
</Divider>

<Button
  fullWidth
  variant="outlined"
  onClick={handleGoogleSignUp}
  startIcon={<Google />}
  sx={{
    mb: 2,
    py: 1.5,
    borderColor: "#4285F4",
    color: "#4285F4",
    "&:hover": {
      borderColor: "#357ae8",
      backgroundColor: "rgba(66, 133, 244, 0.04)",
    },
  }}
>
  Continue with Google
</Button>

<Typography sx={{ mt: 2 }}>
  Already have an account?{" "}
  <Button
    onClick={() => navigate("/login")}
    color="primary"
    sx={{ textTransform: "none", p: 0 }}  {/* or just remove p: 0 if unwanted */}
  >
    Login here
  </Button>
</Typography>

</Paper>
</Box>
</Box>

