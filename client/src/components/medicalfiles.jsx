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

  // Open image in modal
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  // Close modal
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
    <Box sx={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
    }}>
      <Box sx={{
        width: "90%",
        maxWidth: "1200px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        overflowY: "auto",
        maxHeight: "90vh",
      }}>
        <Typography variant="h4" fontWeight="bold" mb={4} color="#4caf50">
          Medical Files for {hospitalName}
        </Typography>

        <Card sx={{ backgroundColor: "#e8f5e9", mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2} color="#2e7d32">
              Notes
            </Typography>
            <TextField
              label="Add Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNote}
              sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
            >
              Save Note
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: "#e8f5e9", mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2} color="#2e7d32">
              Upload Files
            </Typography>
            <Grid container spacing={3}>
              {["prescription", "labReport", "scanningReport", "additionalFiles"].map((type) => (
                <Grid item xs={12} sm={6} key={type}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body1" fontWeight="bold" mb={1}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, " $1")}
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
                          sx={{ backgroundColor: "#4caf50", color: "white" }}
                        >
                          <CloudUploadIcon />
                        </IconButton>
                      </label>
                      <Typography variant="body2">
                        {files[type]?.length ? `${files[type].length} file(s) uploaded` : "No file uploaded"}
                      </Typography>
                    </Box>
                    {filePreviews[type] && (
                      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {filePreviews[type].map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "150px",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                              cursor: "pointer",
                            }}
                            onClick={() => handleImageClick(preview)}
                          />
                        ))}
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <Box sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
          }}>
            <IconButton sx={{ position: "absolute", top: 10, right: 10 }} onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
            <IconButton
              sx={{ position: "absolute", top: 10, left: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", color: "white" }}
              onClick={handleCloseModal}
            >
              <ArrowBackIcon />
            </IconButton>
            <img
              src={selectedImage}
              alt="Full Preview"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default MedicalFiles;