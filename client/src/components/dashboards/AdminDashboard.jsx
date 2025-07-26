import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// You can swap these SVG links to any admin/analytics/tech/abstract artwork you like.
const leftBg =
  "url('https://cdn.jsdelivr.net/gh/undraw-io/undraw@master/svg/undraw_data_reports_706v.svg')";
const rightBg =
  "url('https://cdn.jsdelivr.net/gh/undraw-io/undraw@master/svg/undraw_security_on_re_e491.svg')";

const AdminDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        // Layered: soft blue gradient, analytics SVG left, security SVG right
        bgcolor: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)',
        backgroundImage: `${leftBg}, ${rightBg}`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'left bottom, right bottom',
        backgroundSize: { xs: '140px, 140px', sm: '250px, 220px', md: '320px, 360px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: { xs: 1, sm: 4 },
        py: { xs: 3, sm: 6, md: 10 },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 700,
          bgcolor: 'transparent',
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 70, color: '#1976d2' }} />
          <Typography variant="h3" fontWeight={700} color="#1976d2" gutterBottom>
            Admin Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, mb: 1 }}>
          Welcome, Admin!
        </Typography>
        <Typography variant="body1" sx={{ color: '#4e607c', maxWidth: 650, mx: 'auto', mb: 2 }}>
          Here you can manage users, review system activity, and configure platform settings for HealthVault.
        </Typography>
      </Box>

      {/* Action Buttons Section */}
      <Box sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
        <Stack spacing={3} direction={{ xs: "column", sm: "row" }} justifyContent="center">
          <Button
            variant="contained"
            sx={{
              background: '#1976d2',
              color: "#fff",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': { background: '#1250a0' },
              borderRadius: 2,
              boxShadow: "none"
            }}
          >
            Manage Users
          </Button>
          <Button
            variant="contained"
            sx={{
              background: '#90caf9',
              color: "#1250a0",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': { background: '#1976d2', color: "#fff" },
              borderRadius: 2,
              boxShadow: "none"
            }}
          >
            System Settings
          </Button>
        </Stack>
      </Box>

      {/* Overview/Reports Section */}
      <Box sx={{ width: "100%", maxWidth: 700, mt: 6 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 2 }}>Overview</Typography>
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.74)',
            borderRadius: 2,
            p: 3,
            boxShadow: "none",
            textAlign: 'center',
            color: '#555'
          }}
        >
          <Typography>
            Admin metrics, alerts, and reports will appear here.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
