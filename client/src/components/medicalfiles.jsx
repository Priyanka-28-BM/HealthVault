import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  Modal,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { supabase } from "../config/supabaseClient";

function MedicalFiles() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hospitalName: initialHospitalName } = location.state || {};

   // State to manage hospital name, notes, files, and file previews

  const [hospitalName, setHospitalName] = useState(initialHospitalName || "");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  // Reset state when hospital name changes
  useEffect(() => {
    if (initialHospitalName && initialHospitalName !== hospitalName) {
      setHospitalName(initialHospitalName);
      setNote("");
      setFiles({});
      setFilePreviews({});
      setLoading(true);
    }
  }, [initialHospitalName]);

  // Fetch data when hospitalName changes
  useEffect(() => {
    if (!hospitalName) {
      navigate("/hospitals");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchNotes(), fetchFiles()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalName]);

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("note")
        .eq("hospital_name", hospitalName);

      if (error) throw error;
      if (data.length > 0) setNote(data[0].note);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch files from Supabase Storage
  const fetchFiles = async () => {
    try {
      const categories = ["prescription", "labReport", "scanningReport", "additionalFiles"];
      const filesData = {};
      const previews = {};

      for (const category of categories) {
        const { data, error } = await supabase.storage
          .from("medical_files")
          .list(`${hospitalName}/${category}/`);

        if (error) throw error;

        filesData[category] = [];
        previews[category] = [];

        for (const file of data) {
          const filePath = `${hospitalName}/${category}/${file.name}`;
          const { publicUrl } = supabase.storage
            .from("medical_files")
            .getPublicUrl(filePath).data;

          filesData[category].push(file.name);
          previews[category].push(publicUrl);
        }
      }

      setFiles(filesData);
      setFilePreviews(previews);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Save note to Supabase
  const handleAddNote = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .upsert([{ hospital_name: hospitalName, note }], { onConflict: "hospital_name" });

      if (error) throw error;
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    }
  };

  // Upload files to Supabase Storage
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filePath = `${hospitalName}/${type}/${sanitizedFileName}`;

      const { error } = await supabase.storage
        .from("medical_files")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (error) throw error;

      await fetchFiles();
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Check the console for details.");
    }
  };

  // Open image in model
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  // Close model
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage("");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width:'100vw',
        minHeight: "90vh",
        backgroundImage: 'url("https://i.pinimg.com/736x/84/44/4c/84444c1440e6c2463f6c1bc6aa159448.jpg")',
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        display: "flex",
        padding: "2rem",
      }}
    >
      <Grid container spacing={3} sx={{ height: "fit-content" }}>
        {/* Left Side - Note Section */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            marginLeft:'20px',
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(5px)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            borderRadius: "15px",
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: "#2e7d32", fontWeight: "bold" }}>
                Notes for {hospitalName}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                label="Write your notes here"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddNote}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#388e3c" },
                  borderRadius: "8px",
                  py: 1,
                  fontWeight: "bold",
                }}
              >
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - File Management */}
        <Grid item xs={12} md={9}>
          <Card sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(5px)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            borderRadius: "15px",
            height: "250%",
            overflowY: "auto",
            maxHeight: "80vh",
            width:"160vh"
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ 
                mb: 4, 
                color: "#2e7d32",
                fontWeight: "bold",
                textAlign: "center",
              }}>
                    Medical Files for {hospitalName}
              </Typography>

              <Grid container spacing={3}>
                {["prescription", "labReport", "scanningReport", "additionalFiles"].map((type) => (
                  <Grid item xs={12} sm={6} key={type}>
                    <Card sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "12px",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ 
                          mb: 2,
                          color: "#2e7d32",
                          fontWeight: "medium",
                        }}>
                          {type.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <input
                            type="file"
                            id={`file-upload-${type}`}
                            hidden
                            onChange={(e) => handleFileUpload(e, type)}
                          />
                          <label htmlFor={`file-upload-${type}`}>
                            <IconButton
                              component="span"
                              sx={{
                                backgroundColor: "#4caf50",
                                color: "white",
                                "&:hover": { backgroundColor: "#388e3c" },
                              }}
                            >
                              <CloudUploadIcon />
                            </IconButton>
                          </label>
                          <Typography variant="body2" color="textSecondary">
                            {files[type]?.length || 0} files
                          </Typography>
                        </Box>

                        {filePreviews[type] && (
                          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {filePreviews[type].map((preview, index) => (
                              <img
                                key={index}
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  border: "2px solid #e0e0e0",
                                }}
                                onClick={() => handleImageClick(preview)}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Preview Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backdropFilter: "blur(8px)",
        }}>
          <Box sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}>

            <IconButton sx={{ position: "absolute", top: 10, right: 10 }} onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1,
              }}
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={selectedImage}
              alt="Full Preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default MedicalFiles;