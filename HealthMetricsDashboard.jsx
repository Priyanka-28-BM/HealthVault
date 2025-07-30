// client/src/components/HealthMetricsDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../config/supabaseClient";

const metricLabels = {
  heartRate: "Heart Rate (bpm)",
  bloodPressure: "Blood Pressure (mmHg)",
  bloodSugar: "Blood Sugar (mg/dL)",
  oxygenLevel: "Oxygen Saturation (%)",
  temperature: "Body Temperature (°C)",
};

const HealthMetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    const user = supabase.auth.user();
    if (!user) {
      setLoading(false);
      return;
    }
    // Assume 'health_metrics' table stores latest metrics per user
    const { data, error } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setMetrics(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 6 }} />;

  if (!metrics) return <Typography sx={{ mt: 4, textAlign: "center" }}>No health metrics available.</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Health Metrics Dashboard
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(metricLabels).map(([key, label]) => (
          <Grid item xs={12} sm={6} key={key}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {metrics[key] !== undefined ? metrics[key] : "N/A"}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HealthMetricsDashboard;
