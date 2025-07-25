import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { useUser } from "../context/UserContext";
import { supabase } from "../config/supabaseClient";
import Navbar2 from "./Navbar2";

const Profile = () => {
  const { userData, updateUserData, authUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    blood_group: "",
    dob: "",
    height: "",
    weight: "",
    phone: "",
    address: "",
    emergency_contact: "",
    medical_conditions: "",
    allergies: "",
    medications: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Initialize form with existing user data
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        age: userData.age || "",
        blood_group: userData.blood_group || "",
        dob: userData.dob || "",
        height: userData.height || "",
        weight: userData.weight || "",
        phone: userData.phone || "",
        address: userData.address || "",
        emergency_contact: userData.emergency_contact || "",
        medical_conditions: userData.medical_conditions || "",
        allergies: userData.allergies || "",
        medications: userData.medications || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Name is required" });
      return false;
    }

    if (
      formData.age &&
      (isNaN(formData.age) || formData.age < 0 || formData.age > 150)
    ) {
      setMessage({ type: "error", text: "Please enter a valid age" });
      return false;
    }

    if (
      formData.height &&
      (isNaN(formData.height) || formData.height < 0 || formData.height > 300)
    ) {
      setMessage({ type: "error", text: "Please enter a valid height in cm" });
      return false;
    }

    if (
      formData.weight &&
      (isNaN(formData.weight) || formData.weight < 0 || formData.weight > 500)
    ) {
      setMessage({ type: "error", text: "Please enter a valid weight in kg" });
      return false;
    }

    if (formData.dob && new Date(formData.dob) > new Date()) {
      setMessage({
        type: "error",
        text: "Date of birth cannot be in the future",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Get the current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage({
          type: "error",
          text: "You must be logged in to save profile data",
        });
        setLoading(false);
        return;
      }

      // Prepare data for API
      const profileData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      // Remove empty strings and convert to null
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] === "") {
          profileData[key] = null;
        }
      });

      // Call the backend API
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000"
        }/api/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        // Update the user context with the new data
        updateUserData(result.user);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to save profile",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({
        type: "error",
        text: "An error occurred while saving your profile",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) {
    return (
      <Alert severity="warning">Please log in to access your profile.</Alert>
    );
  }

  return (
    <Card sx={{ overflow: "scroll" }}>
      <CardContent>
        <Navbar2></Navbar2>

        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          {userData?.name ? "Update Your Profile" : "Complete Your Profile"}
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                required
                fullWidth
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                name="age"
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ min: 0, max: 150 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                name="dob"
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                name="blood_group"
                label="Blood Group"
                select
                value={formData.blood_group}
                onChange={handleInputChange}
                variant="outlined"
              >
                <MenuItem value="">Select Blood Group</MenuItem>
                {bloodGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Physical Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Physical Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                name="height"
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ min: 0, max: 300, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                name="weight"
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ min: 0, max: 500, step: 0.1 }}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                name="emergency_contact"
                label="Emergency Contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                name="address"
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Medical Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                name="medical_conditions"
                label="Medical Conditions"
                multiline
                rows={2}
                value={formData.medical_conditions}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="List any medical conditions you have"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                name="allergies"
                label="Allergies"
                multiline
                rows={2}
                value={formData.allergies}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="List any allergies you have"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                name="medications"
                label="Current Medications"
                multiline
                rows={2}
                value={formData.medications}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="List any medications you're currently taking"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Saving...
                    </>
                  ) : userData?.name ? (
                    "Update Profile"
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;
