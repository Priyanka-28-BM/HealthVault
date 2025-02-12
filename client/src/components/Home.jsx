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
import CloseIcon from "@mui/icons-material/Close";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

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

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await response.json();
      setChatMessages([...newMessages, { role: "bot", content: data.reply }]);
    } catch (error) {
      console.error("Chatbot API error:", error);
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
          backgroundColor: "#d0f0c0",
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
            backgroundColor: "#e8f5e9",
          }}
        >
          {isEditing ? (
            <>
              <TextField label="Name" name="name" value={userData.name} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Age" name="age" value={userData.age} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Blood Group" name="bloodGroup" value={userData.bloodGroup} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Date of Birth" name="dob" value={userData.dob} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Height" name="height" value={userData.height} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Weight" name="weight" value={userData.weight} onChange={handleInputChange} fullWidth margin="normal" />
              <Button variant="contained" color="primary" onClick={handleSaveProfile} fullWidth sx={{ mt: 2 }}>
                Save Profile
              </Button>
            </>
          ) : (
            <>
              <Avatar src="https://via.placeholder.com/150" alt="Profile" sx={{ width: 120, height: 120, marginBottom: "20px" }} />
              <Typography variant="h6" fontWeight="bold">{userData.name || "John Doe"}</Typography>
              <Typography>Age: {userData.age || "28"}</Typography>
              <Typography>Blood Group: {userData.bloodGroup || "O+"}</Typography>
              <Typography>DOB: {userData.dob || "01-01-1996"}</Typography>
              <Typography>Height: {userData.height || "5'9\""}</Typography>
              <Typography>Weight: {userData.weight || "70kg"}</Typography>
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

      {/* Floating Chat Button */}
      <IconButton sx={{ position: "fixed", bottom: 20, right: 20, backgroundColor: "#4caf50", color: "white" }} onClick={() => setIsChatOpen(true)}>
        <ChatIcon sx={{ fontSize: 40 }} />
      </IconButton>

      {/* Chat Popup */}
      {isChatOpen && (
        <Box sx={{ position: "fixed", bottom: 80, right: 20, width: 450, height: 450, backgroundColor: "white", boxShadow: 3, borderRadius: 2, padding: 2, display: "flex", flexDirection: "column" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Chatbot</Typography>
            <IconButton onClick={() => setIsChatOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", padding: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      {chatMessages.map((msg, i) => (
        <Box
          key={i}
          sx={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.role === "user" ? "#4caf50" : "#f0f0f0",
            color: msg.role === "user" ? "white" : "black",
            padding: "10px 14px",
            borderRadius: "16px",
            maxWidth: "75%",
            fontSize: "14px",
            wordBreak: "break-word",
            boxShadow: 1,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {msg.role === "user" ? "You" : "Bot"}
          </Typography>
          <Typography variant="body2">{msg.content}</Typography>
        </Box>
      ))}
    </Box>
            <TextField value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." fullWidth variant="outlined" sx={{ mt: 1 }} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
        </Box>
      )}
    </Box>
  );
}

export default ProfilePage;