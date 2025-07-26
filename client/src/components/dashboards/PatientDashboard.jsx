import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

// Add another medical-themed background SVG or PNG as overlay
const patientBgOverlay =
  "url('https://cdn.jsdelivr.net/gh/undraw-io/undraw@master/svg/undraw_medicine_b1ol.svg')";

const PatientDashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        // Layered backgrounds: a gradient, a faint vector on the left, and the original SVG on the right
        bgcolor: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)',
        backgroundImage: `
          ${patientBgOverlay}, 
          url('https://assets-global.website-files.com/63be1f429e4f5e2229e182fa/64eb09f5c685d97eb2944525_patient-illustration.svg')
        `,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'left bottom, right bottom',
        backgroundSize: { xs: "170px, 190px", sm: "260px, 320px", md: "360px, 450px" },
        position: "relative",
      }}
    >
      {/* Header Area */}
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
          <HealthAndSafetyIcon sx={{ fontSize: 64, color: '#2d77cc' }} />
          <Typography variant="h3" fontWeight={700} color="#2d77cc">
            Patient Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 600, mb: 1 }}>
          Welcome, Patient!
        </Typography>
        <Typography variant="body1" sx={{ color: '#465366', maxWidth: 640, mx: 'auto', mb: 2 }}>
          Here you can view your health records, download reports, and keep track of your wellness journey.
        </Typography>
      </Box>

      {/* Action Area */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Stack spacing={3} direction={{ xs: "column", sm: "row" }} justifyContent="center">
          <Button
            variant="contained"
            sx={{
              background: '#2d77cc',
              color: "#fff",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': { background: '#174a84' },
              borderRadius: 2,
              boxShadow: "none"
            }}
          >
            View My Records
          </Button>
          <Button
            variant="contained"
            sx={{
              background: '#8bbfff',
              color: "#24477b",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': { background: '#5c8dd6', color: "#fff" },
              borderRadius: 2,
              boxShadow: "none"
            }}
          >
            Download Report
          </Button>
        </Stack>
      </Box>

      {/* Section for Future Graphs/Stats */}
      <Box sx={{ mt: 8, px: { xs: 2, sm: 8, md: 20 }, mb: 8 }}>
        <Typography variant="h6" sx={{ color: '#2d77cc', fontWeight: 600, mb: 2 }}>Overview</Typography>
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
          <Typography>Your recent activity and stats will appear here soon.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDashboard;
