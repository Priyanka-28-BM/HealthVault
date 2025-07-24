import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress, Paper, List, ListItem, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const GEMINI_API_KEY = 'AIzaSyBOi1AVal5k5okLlJEeme2o5s-xSQSX2s8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

function BloodTestAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setAnalysis(null);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const analyzeReport = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      // Convert PDF to base64
      const reader = new FileReader();
      const fileData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result);
        reader.readAsDataURL(selectedFile);
      });
      const base64Data = fileData.split(',')[1];
      const prompt = `You are a medical expert analyzing a blood test report. Please analyze this report and provide a detailed assessment in the following JSON format:\n\n{\n  "abnormalValues": {\n    "high": ["list of parameters that are higher than normal"],\n    "low": ["list of parameters that are lower than normal"]\n  },\n  "possibleConditions": ["list of potential medical conditions based on abnormal values"],\n  "dietaryRecommendations": ["specific food items and nutrients to address deficiencies"],\n  "medicationSuggestions": ["types of supplements or medications that might help"],\n  "lifestyleChanges": ["recommended lifestyle modifications"]\n}\n\nPlease be specific and thorough in your analysis. Include normal range references where relevant.`;
      const body = {
        contents: [
          { parts: [
            { text: prompt },
            { inlineData: { mimeType: 'application/pdf', data: base64Data } }
          ] }
        ]
      };
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      let responseText = '';
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
        responseText = data.candidates[0].content.parts[0].text.trim();
      } else {
        setError('Failed to analyze the report.');
        setLoading(false);
        return;
      }
      // Remove markdown code block if present
      const cleanJson = responseText.replace(/^```json\s*|```$/g, '').trim();
      const analysisResult = JSON.parse(cleanJson);
      setAnalysis(analysisResult);
    } catch (err) {
      setError('Failed to analyze the report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', backgroundImage: 'url("https://i.pinimg.com/736x/84/44/4c/84444c1440e6c2463f6c1bc6aa159448.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Card sx={{ minWidth: 400, maxWidth: 600, p: 4, borderRadius: 4, boxShadow: 6, backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" color="#d32f2f" align="center" gutterBottom>
            Blood Test Analyzer
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" mb={3}>
            Upload your blood test report (PDF) for a comprehensive analysis and personalized recommendations.
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="upload-pdf"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="upload-pdf">
              <Button
                variant="contained"
                color="error"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ borderRadius: '50px', px: 4, py: 1.5, fontWeight: 'bold', fontSize: 16 }}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload PDF'}
              </Button>
            </label>
            {selectedFile && (
              <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.primary">Selected file: {selectedFile.name}</Typography>
                <Button
                  onClick={analyzeReport}
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, borderRadius: '10px', px: 4 }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Analyze Report'}
                </Button>
              </Box>
            )}
            {error && <Typography color="error" align="center" mt={2}>{error}</Typography>}
            {analysis && (
              <Box mt={4}>
                {((analysis.abnormalValues && (analysis.abnormalValues.high.length > 0 || analysis.abnormalValues.low.length > 0))) && (
                  <Paper sx={{ p: 2, mb: 2, background: '#ffebee' }}>
                    <Typography variant="h6" color="error" gutterBottom>Abnormal Values</Typography>
                    {analysis.abnormalValues.high.length > 0 && (
                      <Box mb={1}>
                        <Typography variant="subtitle1" color="error">Elevated Levels:</Typography>
                        <List dense>
                          {analysis.abnormalValues.high.map((item, idx) => (
                            <ListItem key={`high-${idx}`}><ListItemText primary={item} /></ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                    {analysis.abnormalValues.low.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" color="error">Low Levels:</Typography>
                        <List dense>
                          {analysis.abnormalValues.low.map((item, idx) => (
                            <ListItem key={`low-${idx}`}><ListItemText primary={item} /></ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Paper>
                )}
                {analysis.possibleConditions && analysis.possibleConditions.length > 0 && (
                  <Paper sx={{ p: 2, mb: 2, background: '#fffde7' }}>
                    <Typography variant="h6" color="warning.main" gutterBottom>Possible Conditions</Typography>
                    <List dense>
                      {analysis.possibleConditions.map((item, idx) => (
                        <ListItem key={`cond-${idx}`}><ListItemText primary={item} /></ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
                {analysis.dietaryRecommendations && analysis.dietaryRecommendations.length > 0 && (
                  <Paper sx={{ p: 2, mb: 2, background: '#e8f5e9' }}>
                    <Typography variant="h6" color="success.main" gutterBottom>Dietary Recommendations</Typography>
                    <List dense>
                      {analysis.dietaryRecommendations.map((item, idx) => (
                        <ListItem key={`diet-${idx}`}><ListItemText primary={item} /></ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
                {analysis.medicationSuggestions && analysis.medicationSuggestions.length > 0 && (
                  <Paper sx={{ p: 2, mb: 2, background: '#e3f2fd' }}>
                    <Typography variant="h6" color="info.main" gutterBottom>Medication Suggestions</Typography>
                    <List dense>
                      {analysis.medicationSuggestions.map((item, idx) => (
                        <ListItem key={`med-${idx}`}><ListItemText primary={item} /></ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
                {analysis.lifestyleChanges && analysis.lifestyleChanges.length > 0 && (
                  <Paper sx={{ p: 2, mb: 2, background: '#f3e5f5' }}>
                    <Typography variant="h6" color="secondary" gutterBottom>Lifestyle Changes</Typography>
                    <List dense>
                      {analysis.lifestyleChanges.map((item, idx) => (
                        <ListItem key={`life-${idx}`}><ListItemText primary={item} /></ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BloodTestAnalyzer; 