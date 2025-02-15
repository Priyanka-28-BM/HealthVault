import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; 
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
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch profile and hospital data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        fetchProfileData(user.id);
        fetchHospitalData(user.id);
        fetchProfileImage(user.id);
      }
    };

    fetchUserData();
  }, []);

  // Fetch profile data from Supabase
  const fetchProfileData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profile_details")
        .select("*")
        .eq("user_id", userId);
  
      if (error) throw error;
  
      if (data && data.length > 0) {
        const profile = data[0]; // Get first record
        setUserData({
          name: profile.name, // Changed from data.name to profile.name
          age: profile.age,
          bloodGroup: profile.blood_group,
          dob: profile.dob,
          height: profile.height,
          weight: profile.weight,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      return;
    }

    const { data: urlData } = await supabase.storage
      .from("profile_images")
      .getPublicUrl(fileName);

    setProfileImageUrl(urlData.publicUrl + `?t=${Date.now()}`);
  };






  // Fetch hospital data from Supabase
  const fetchHospitalData = async (userId) => {
    try {
      const { data: hospitalsData, error: hospitalsError } = await supabase
        .from("hospital_name")
        .select("name")
        .eq("user_id", userId); // Fetch hospital data for the logged-in user

      if (hospitalsError) throw hospitalsError;

      if (hospitalsData) {
        const hospitalNames = hospitalsData.map((hospital) => hospital.name);
        setHospitals(hospitalNames);

        const notes = {};
        const documents = {};
        for (const hospital of hospitalNames) {
          const { data: notesData, error: notesError } = await supabase
            .from("notes")
            .select("note")
            .eq("hospital_name", hospital)
            .eq("user_id", userId);

          if (notesError) throw notesError;

          if (notesData.length > 0) {
            notes[hospital] = notesData[0].note;
          }

          const { data: filesData, error: filesError } = await supabase.storage
            .from("medical_files")
            .list(`${userId}/${hospital}/`);

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


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
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

    const { data: { user } } = await supabase.auth.getUser();
    const dataToInsert = {
      user_id: user.id, // Include user_id to associate profile with the user
      name: userData.name,
      age: userData.age,
      blood_group: userData.bloodGroup,
      dob: userData.dob,
      height: userData.height,
      weight: userData.weight,
    };

    try {
      const { data, error } = await supabase
        .from("profile_details")
        .upsert([dataToInsert], { onConflict: "user_id" }); // Upsert based on user_id

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

    const { data: { user } } = await supabase.auth.getUser();

    try {
      const { data, error } = await supabase
        .from("hospital_name")
        .insert([{ user_id: user.id, name: hospitalName }]); // Include user_id

      if (error) throw error;

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
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("hospital_name")
        .delete()
        .eq("name", hospital)
        .eq("user_id", user.id); // Ensure the hospital belongs to the logged-in user

      if (error) throw error;

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
  //chatbot handle
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
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundImage: 'url("https://i.pinimg.com/474x/2b/a7/bb/2ba7bbe33b4368d173f4085f440d55f6.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "30px",
    borderRight: "2px solid #e0e0e0",
  }}
>
  <Typography variant="h5" fontWeight="bold" mb={2} color="white">
    Profile Information
  </Typography>

  <Paper
    elevation={6}
    sx={{
      padding: "30px",
      borderRadius: "20px",
      width: "85%",
      maxWidth: "400px", // Limits max width for a clean look
      backgroundColor: "white",
      boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      textAlign: "center", 
    }}
  >
    {/* Logout Button - Positioned at the Top Right */}
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <IconButton
        color="error"
        onClick={handleLogout}
        sx={{
          backgroundColor: "lightgreen", // Pastel Green
          "&:hover": {
            backgroundColor: "#cc0000",
          },
        }}
      >
        <LogoutIcon />
      </IconButton>
    </Box>

    {isEditing ? (
      <>
        <TextField label="Name" name="name" value={userData.name} onChange={handleInputChange} fullWidth />
        <TextField label="Age" name="age" value={userData.age} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="Blood Group" name="bloodGroup" value={userData.bloodGroup} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="Date of Birth" name="dob" value={userData.dob} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="Height" name="height" value={userData.height} onChange={handleInputChange} fullWidth margin="normal" />
        <TextField label="Weight" name="weight" value={userData.weight} onChange={handleInputChange} fullWidth margin="normal" />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveProfile}
          fullWidth
          sx={{ mt: 2, borderRadius: "10px" }}
        >
          Save Profile
        </Button>
      </>
    ) : (
      <>
        <Avatar
          src="https://via.placeholder.com/150"
          alt="Profile"
          sx={{ width: 90, height: 90, marginBottom: 2 }}
          onError={(e) => { e.target.src = 'https://picsum.photos/150'; }}
        />
        <Typography variant="h6" fontWeight="bold" color="black">
          {userData.name || "John Doe"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "4px", fontSize: "16px", color: "#333", textAlign: "justify" }}>
          Age: {userData.age || "28"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "4px", fontSize: "16px", color: "#333", textAlign: "justify" }}>
          Blood Group: {userData.bloodGroup || "O+"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "4px", fontSize: "16px", color: "#333", textAlign: "justify" }}>
          DOB: {userData.dob || "01-01-1996"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "4px", fontSize: "16px", color: "#333", textAlign: "justify" }}>
          Height: {userData.height || "5'9\""}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "16px", color: "#333", textAlign: "justify" }}>
          Weight: {userData.weight || "70kg"}
        </Typography>

        {/* Motivational Quote After Saving Profile */}
        <Typography
          variant="body2"
          sx={{
            marginTop: 3,
            fontStyle: "italic",
            color: "#4CAF50", // Green shade for positivity
            fontWeight: "bold",
          }}
        >
          "Take care of your body. It's the only place you have to live. 🌿"
        </Typography>
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
    backgroundImage: 'url("https://i.pinimg.com/736x/84/44/4c/84444c1440e6c2463f6c1bc6aa159448.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <Typography variant="h5" fontWeight="bold" mb={2}>
    Manage Hospitals
  </Typography>
  <Box sx={{ display: "flex", gap: 2, mb: 2, border: "1.5px solid black" }}>
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

  {/* Hospital List Section */}
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      overflowY: "auto",
      overflowX: "hidden", // Prevents horizontal scrollbar
      maxHeight: "calc(100% - 100px)",
      "&::-webkit-scrollbar": {
        width: "0px", // Hide vertical scrollbar
      },
    }}
  >
    {hospitals.map((hospital) => (
      <Card
        key={hospital}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px",
          borderRadius: "10px",
          backgroundColor: "white",
          width: "100%",
          minHeight: "50px",
          color: "#333",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
        onClick={() => handleNavigateToMedicalFiles(hospital)}
      >
        {/* Hospital Icon Container */}
        <Box
          sx={{
            width: 50,
            height: 50,
            minWidth: 50,
            borderRadius: "8px",
            overflow: "hidden",
            marginRight: "15px",
            backgroundColor: "white",
          }}
        >
          <img
            src="/src/images/hospital icon.jpg" // Replace with your image path
            alt="Hospital"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Hospital Name - Centered and Bold */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {hospital}
          </Typography>
        </Box>

        {/* Delete Icon - Moved slightly to the left */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteHospital(hospital);
          }}
          color="error"
          sx={{ marginRight: "40px" }} 
        >
          <DeleteIcon />
        </IconButton>
      </Card>
    ))}
  </Box>
</Box>


      <Box sx={{ position: "fixed", bottom: 30, right: 40, textAlign: "center" }}>
      {/* Label Text */}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: "bold",
          color: "white",
          backgroundColor: "black",
          padding: "4px 8px",
          borderRadius: "8px",
          marginLeft: "200px",
          display: "inline-block",
        }}
      >
        Ask health-related queries
      </Typography>

      {/* Floating Chat Button */}
      <IconButton
        sx={{
          marginLeft:'10px',
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "gray" },
        }}
        onClick={() => setIsChatOpen(true)}
      >
        <ChatIcon sx={{ fontSize: 40 }} />
      </IconButton>
    </Box>

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