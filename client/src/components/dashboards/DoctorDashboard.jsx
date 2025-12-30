import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack, TextField } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import axios from "axios";
import { supabase } from "../../supabaseClient"; 


const backgroundImage =
  "url('https://www.transparenttextures.com/patterns/diagmonds-light.png'), url('https://assets-global.website-files.com/63be1f429e4f5e2229e182fa/64eb108d4b7d8b7b6b881453_hero-doc.svg')";

const DoctorDashboard = () => {
  const [records, setRecords] = useState([]);
  const [patientId, setPatientId] = useState("");

  const fetchRecord = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session.access_token;

      const res = await axios.get(`http://localhost:5000/records/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setRecords([]);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "linear-gradient(135deg, #e0ffc3 0%, #a8edea 100%)",
        backgroundImage: backgroundImage,
        backgroundRepeat: "repeat, no-repeat",
        backgroundPosition: "center bottom, right bottom",
        backgroundSize: "auto, 400px",
        px: { xs: 2, sm: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <LocalHospitalIcon sx={{ fontSize: 64, color: "#00897b" }} />
          <Typography variant="h3" fontWeight={700} color="#00897b">
            Doctor Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: "#333", fontWeight: 600, mb: 1 }}>
          Welcome, Doctor!
        </Typography>
        <Typography variant="body1" sx={{ color: "#365653", maxWidth: 640, mx: "auto", mb: 2 }}>
          Manage patients’ records and view important information with ease.
        </Typography>
      </Box>

      {/* Action Area */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Stack spacing={2} direction="column" alignItems="center">
          <TextField
            label="Enter Patient ID"
            variant="outlined"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button
            variant="contained"
            onClick={fetchRecord}
            sx={{
              background: "#00897b",
              color: "#fff",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": { background: "#00695c" },
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            Fetch Patient Records
          </Button>
        </Stack>
      </Box>

      {/* Records Section */}
      <Box sx={{ mt: 6, px: { xs: 2, sm: 8, md: 20 }, pb: 8 }}>
        <Typography variant="h6" sx={{ color: "#00897b", fontWeight: 600, mb: 2 }}>
          Patient Records
        </Typography>
        {records.length === 0 ? (
          <Typography color="text.secondary">No records found.</Typography>
        ) : (
          records.map((r) => (
            <Box
              key={r.id}
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "rgba(255,255,255,0.8)",
                borderRadius: 2,
                boxShadow: "none",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {r.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {r.description}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
