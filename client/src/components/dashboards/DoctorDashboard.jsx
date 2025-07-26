import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// You can add an SVG image directly or use a public medical vector as a background image below
const backgroundImage =
  "url('https://www.transparenttextures.com/patterns/diagmonds-light.png'), url('https://assets-global.website-files.com/63be1f429e4f5e2229e182fa/64eb108d4b7d8b7b6b881453_hero-doc.svg')";

const DoctorDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'linear-gradient(135deg, #e0ffc3 0%, #a8edea 100%)',
        backgroundImage: backgroundImage,
        backgroundRepeat: 'repeat, no-repeat',
        backgroundPosition: 'center bottom, right bottom',
        backgroundSize: 'auto, 400px',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: '100%',
          py: 4,
          px: 2,
          bgcolor: 'transparent',
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <LocalHospitalIcon sx={{ fontSize: 64, color: '#00897b' }} />
          <Typography variant="h3" fontWeight={700} color="#00897b">
            Doctor Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, mb: 1 }}>
          Welcome, Doctor!
        </Typography>
        <Typography variant="body1" sx={{ color: '#365653', maxWidth: 640, mx: 'auto', mb: 2 }}>
          Here you can efficiently manage your patients’ records, view appointments, and access important tools for your practice.
        </Typography>
      </Box>

      {/* Action Area: Buttons */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Stack spacing={3} direction={{ xs: "column", sm: "row" }} justifyContent="center">
          <Button
            variant="contained"
            sx={{
              background: '#00897b',
              color: "#fff",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': { background: '#00695c' },
              borderRadius: 2,
              boxShadow: "none"
            }}
          >
            View Patient Records
          </Button>
          <Button
            variant="contained"
            sx={{
              background: '#43cea2',
              color: "#166c5e",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': { background: '#39b88b', color: "#fff" },
              borderRadius: 2,
              boxShadow: "none"
            }}
          >
            Schedule Appointment
          </Button>
        </Stack>
      </Box>

      {/* Placeholder for other sections like charts or stats */}
      <Box sx={{ mt: 8, px: { xs: 2, sm: 8, md: 20 }, mb: 8 }}>
        <Typography variant="h6" sx={{ color: '#00897b', fontWeight: 600, mb: 2 }}>Today's Overview</Typography>
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.7)',
            borderRadius: 2,
            p: 3,
            boxShadow: "none",
            textAlign: 'center',
            color: '#555'
          }}
        >
          <Typography>No new notifications for today.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
