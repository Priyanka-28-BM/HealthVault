import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

function MedicalDocuments() {
  const [selectedFile, setSelectedFile] = useState(null);

 

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Upload Medical Documents
      </Typography>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2, backgroundColor: "#4caf50" }}
      >
        Choose File
        <input
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {selectedFile && (
        <Typography variant="body1" mb={2}>
          Selected File: {selectedFile.name}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ backgroundColor: "#4caf50" }}
      >
        Upload
      </Button>
    </Box>
  );
}

export default MedicalDocuments;
