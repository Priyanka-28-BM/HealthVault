import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    dob: "",
    height: "",
    weight: "",
  });
  const [isEditing, setIsEditing] = useState(true);

  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalDocuments, setHospitalDocuments] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveProfile = () => {
    if (Object.values(userData).some((value) => value === "")) {
      alert("Please fill out all fields before saving.");
      return;
    }
    setIsEditing(false);
  };

  const handleAddHospital = () => {
    if (hospitalName.trim() === "") return alert("Hospital name cannot be empty!");
    if (!hospitals.includes(hospitalName)) {
      setHospitals([...hospitals, hospitalName]);
      setHospitalDocuments({ ...hospitalDocuments, [hospitalName]: [] });
      setHospitalName("");
    } else {
      alert("Hospital already exists!");
    }
  };

  const handleDeleteHospital = (hospital) => {
    setHospitals(hospitals.filter((h) => h !== hospital));
    const updatedDocs = { ...hospitalDocuments };
    delete updatedDocs[hospital];
    setHospitalDocuments(updatedDocs);
  };

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleUploadDocument = (e) => {
    const file = e.target.files[0];
    if (file && selectedHospital) {
      const updatedDocs = { ...hospitalDocuments };
      updatedDocs[selectedHospital].push(file);
      setHospitalDocuments(updatedDocs);
    }
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
          backgroundColor: "#d0f0c0", // Pastel Green Background
          padding: "20px",
          borderRight: "2px solid #e0e0e0",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Profile Information
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            borderRadius: "15px",
            width: "100%",
            backgroundColor: "#e8f5e9", // Light Green Background
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
                margin="normal"
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
                sx={{ mt: 2 }}
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
                <Typography>Age: {userData.age || "28"}</Typography>
                <Typography>Blood Group: {userData.bloodGroup || "O+"}</Typography>
                <Typography>DOB: {userData.dob || "01-01-1996"}</Typography>
                <Typography>Height: {userData.height || "5'9\""}</Typography>
                <Typography>Weight: {userData.weight || "70kg"}</Typography>
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
          <Button variant="contained" color="primary" onClick={handleAddHospital}>
            Add
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
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
                flexGrow: 1,
                minWidth: "150px",
              }}
              onDoubleClick={() => handleSelectHospital(hospital)}
            >
              <CardContent>
                <Typography>{hospital}</Typography>
              </CardContent>
              <input
                type="file"
                onChange={handleUploadDocument}
                style={{ marginTop: "10px" }}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteHospital(hospital);
                }}
                sx={{ position: "absolute", top: "5px", right: "5px" }}
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Chatbot Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e0f7fa",
          borderLeft: "2px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Chatbot
        </Typography>
        <IconButton sx={{ backgroundColor: "#4caf50", color: "white", mb: 2 }}>
          <ChatIcon sx={{ fontSize: 40 }} />
        </IconButton>
        <Typography variant="body1" mt={2}>
          Search for home remedies or ask health-related questions!
        </Typography>
      </Box>
    </Box>
  );
}

export default ProfilePage;