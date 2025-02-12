import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../config/supabaseClient"; // Ensure this path is correct

function ProfilePage() {
  const navigate = useNavigate();
  // State to manage user profile data
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    dob: "",
    height: "",
    weight: "",
  });
  const [isEditing, setIsEditing] = useState(true);

  // State to manage hospital-related data
  const [hospitals, setHospitals] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalNotes, setHospitalNotes] = useState({});
  const [hospitalDocuments, setHospitalDocuments] = useState({});

  // Fetch profile and hospital data on component mount
  useEffect(() => {
    fetchProfileData();
    fetchHospitalData();
  }, []);

  // Fetch profile data from Supabase
  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profile_details")
        .select("*")
        .single(); // Fetch the first profile entry

      if (error) throw error;

      if (data) {
        // Map database column names to React state keys
        setUserData({
          name: data.name,
          age: data.age,
          bloodGroup: data.blood_group, // Map blood_group to bloodGroup
          dob: data.dob,
          height: data.height,
          weight: data.weight,
        });
        setIsEditing(false); // Disable editing mode if data exists
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch hospital data from Supabase
  const fetchHospitalData = async () => {
    try {
      const { data: hospitalsData, error: hospitalsError } = await supabase
        .from("hospital_name")
        .select("name");

      if (hospitalsError) throw hospitalsError;

      if (hospitalsData) {
        const hospitalNames = hospitalsData.map((hospital) => hospital.name);
        setHospitals(hospitalNames);

        // Fetch notes and documents for each hospital
        const notes = {};
        const documents = {};
        for (const hospital of hospitalNames) {
          const { data: notesData, error: notesError } = await supabase
            .from("notes")
            .select("note")
            .eq("hospital_name", hospital);

          if (notesError) throw notesError;

          if (notesData.length > 0) {
            notes[hospital] = notesData[0].note;
          }

          const { data: filesData, error: filesError } = await supabase.storage
            .from("medical_files")
            .list(`${hospital}/`);

          if (filesError) throw filesError;

          const filePreviews = {};
          for (const file of filesData) {
            const type = file.name.split("/")[1];
            const { publicUrl } = supabase.storage
              .from("medical_files")
              .getPublicUrl(file.name).data;

            if (!filePreviews[type]) filePreviews[type] = [];
            filePreviews[type].push(publicUrl);
          }

          documents[hospital] = filePreviews;
        }

        setHospitalNotes(notes);
        setHospitalDocuments(documents);
      }
    } catch (error) {
      console.error("Error fetching hospital data:", error);
    }
  };

  // Handle input changes for profile fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Save profile data to Supabase
  const handleSaveProfile = async () => {
    if (Object.values(userData).some((value) => value === "")) {
      alert("Please fill out all fields before saving.");
      return;
    }

    // Map React state keys to database column names
    const dataToInsert = {
      name: userData.name,
      age: userData.age,
      blood_group: userData.bloodGroup, // Map bloodGroup to blood_group
      dob: userData.dob,
      height: userData.height,
      weight: userData.weight,
    };

    try {
      const { data, error } = await supabase
        .from("profile_details")
        .upsert([dataToInsert], { onConflict: "name" }); // Upsert to update or insert

      if (error) throw error;

      alert("Profile saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Check the console for details.");
    }
  };

  // Add hospital to Supabase
  const handleAddHospital = async () => {
    if (hospitalName.trim() === "")
      return alert("Hospital name cannot be empty!");

    if (hospitals.includes(hospitalName)) {
      alert("Hospital already exists!");
      return;
    }

    try {
      // Insert hospital name into the `hospital_name` table
      const { data, error } = await supabase
        .from("hospital_name")
        .insert([{ name: hospitalName }]);

      if (error) throw error;

      // Update local state
      setHospitals([...hospitals, hospitalName]);
      setHospitalNotes({ ...hospitalNotes, [hospitalName]: "" });
      setHospitalDocuments({
        ...hospitalDocuments,
        [hospitalName]: {
          prescription: null,
          labReport: null,
          scanningReport: null,
          randomFile: null,
        },
      });
      setHospitalName("");

      alert("Hospital added successfully!");
    } catch (error) {
      console.error("Error adding hospital:", error);
      alert("Failed to add hospital.");
    }
  };

  // Delete hospital from Supabase
  const handleDeleteHospital = async (hospital) => {
    try {
      // Delete hospital from the `hospital_name` table
      const { data, error } = await supabase
        .from("hospital_name")
        .delete()
        .eq("name", hospital);

      if (error) throw error;

      // Update local state
      setHospitals(hospitals.filter((h) => h !== hospital));
      const updatedNotes = { ...hospitalNotes };
      delete updatedNotes[hospital];
      setHospitalNotes(updatedNotes);
      const updatedDocs = { ...hospitalDocuments };
      delete updatedDocs[hospital];
      setHospitalDocuments(updatedDocs);

      alert("Hospital deleted successfully!");
    } catch (error) {
      console.error("Error deleting hospital:", error);
      alert("Failed to delete hospital.");
    }
  };

  // Navigate to the medical files page for a specific hospital
  const handleNavigateToMedicalFiles = (hospital) => {
    navigate("/medicalfiles", {
      state: {
        hospitalName: hospital,
        hospitalNotes: hospitalNotes[hospital],
        hospitalDocuments: hospitalDocuments[hospital],
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "#d0f0c0",
          padding: "30px",
          paddingLeft: "30px",
          borderRight: "2px solid #e0e0e0",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Profile Information
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            borderRadius: "20px",
            width: "80%",
            backgroundColor: "#e8f5e9",
            boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isEditing ? (
            <>
              <TextField
                label="Name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Age"
                name="age"
                value={userData.age}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Blood Group"
                name="bloodGroup"
                value={userData.bloodGroup}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date of Birth"
                name="dob"
                value={userData.dob}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Height"
                name="height"
                value={userData.height}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Weight"
                name="weight"
                value={userData.weight}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
                fullWidth
                sx={{ mt: 1 }}
              >
                Save Profile
              </Button>
            </>
          ) : (
            <>
              <Avatar
                src="https://via.placeholder.com/150"
                alt="Profile"
                sx={{ width: 120, height: 120, marginBottom: "20px" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {userData.name || "John Doe"}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                  Age: {userData.age || "28"}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                  Blood Group: {userData.bloodGroup || "O+"}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                  DOB: {userData.dob || "01-01-1996"}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                  Height: {userData.height || "5'9\""}
                </Typography>
                <Typography variant="body1">
                  Weight: {userData.weight || "70kg"}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Hospital Management Section */}
      <Box
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Manage Hospitals
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Add Hospital"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddHospital}
          >
            Add
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            maxHeight: "calc(100% - 100px)",
          }}
        >
          {hospitals.map((hospital) => (
            <Card
              key={hospital}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#e8f5e9",
                cursor: "pointer",
                position: "relative",
                width: "100%",
              }}
              onClick={() => handleNavigateToMedicalFiles(hospital)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography>{hospital}</Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHospital(hospital);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ProfilePage;