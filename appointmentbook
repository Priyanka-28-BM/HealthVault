// client/src/components/AppointmentBooking.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import { supabase } from "../config/supabaseClient";

const AppointmentBooking = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    const user = supabase.auth.user();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    if (!error && data) {
      setAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBooking = async () => {
    if (!date || !time || !doctor) {
      setSnackbarMsg("Please fill all fields.");
      return;
    }
    const user = supabase.auth.user();
    if (!user) {
      setSnackbarMsg("User not authenticated.");
      return;
    }

    const { error } = await supabase.from("appointments").insert([
      {
        user_id: user.id,
        doctor,
        date,
        time,
        status: "Scheduled",
      },
    ]);

    if (error) {
      setSnackbarMsg("Failed to book appointment.");
    } else {
      setSnackbarMsg("Appointment booked!");
      setDate("");
      setTime("");
      setDoctor("");
      fetchAppointments();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Book Appointment
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          label="Doctor's Name"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button variant="contained" onClick={handleBooking} disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Upcoming Appointments
      </Typography>
      {appointments.length === 0 ? (
        <Typography>No upcoming appointments.</Typography>
      ) : (
        <List>
          {appointments.map(({ id, doctor, date, time, status }) => (
            <ListItem key={id} divider>
              <ListItemText
                primary={`${doctor} on ${date} at ${time}`}
                secondary={`Status: ${status}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={4000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />
    </Box>
  );
};

export default AppointmentBooking;
