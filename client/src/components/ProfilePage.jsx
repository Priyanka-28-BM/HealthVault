import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Box, Typography, Paper, Avatar, TextField, Button, Card,
  IconButton, Grid, Stack, CircularProgress, LinearProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText
} from '@mui/material';
import { Delete, Close, Chat, Logout, CameraAlt, Sort } from '@mui/icons-material';
import { supabase } from '../config/supabaseClient';

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // State management
  const [userData, setUserData] = useState({
    name: '', age: '', bloodGroup: '', dob: null, height: '', weight: ''
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState('');
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('hospital_name')
          .select('name')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching hospitals:', error);
          return;
        }
        
        if (data) {
          setHospitals(data.map(item => item.name));
        }
      }
    };
    
    fetchHospitals();
  }, []);

  // Responsive layout config
  const layoutStyles = {
    profileSection: {
      width: isMobile ? '100%' : '400px',
      padding: isMobile ? 2 : 4
    },
    hospitalSection: {
      width: isMobile ? '100%' : 'calc(100% - 400px)'
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const { error } = await supabase.storage
      .from('profile_images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
        }
      });

    if (error) {
      setNotification({ type: 'error', message: 'Upload failed' });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile_images')
      .getPublicUrl(fileName);

    setAvatarUrl(publicUrl);
    setNotification({ type: 'success', message: 'Profile image updated' });
  };

  // Hospital management functions
  const handleAddHospital = async () => {
    if (!newHospital.trim()) {
      setNotification({ type: 'error', message: 'Hospital name cannot be empty!' });
      return;
    }

    if (hospitals.includes(newHospital)) {
      setNotification({ type: 'error', message: 'Hospital already exists!' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('hospital_name')
        .insert([{ user_id: user.id, name: newHospital }]);

      if (error) throw error;

      setHospitals([...hospitals, newHospital]);
      setNewHospital('');
      setNotification({ type: 'success', message: 'Hospital added successfully!' });
    } catch (error) {
      console.error('Error adding hospital:', error);
      setNotification({ type: 'error', message: 'Failed to add hospital' });
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('hospital_name')
        .delete()
        .eq('user_id', user.id)
        .eq('name', hospitalToDelete);

      if (error) throw error;

      setHospitals(hospitals.filter(h => h !== hospitalToDelete));
      setNotification({ type: 'success', message: 'Hospital deleted successfully!' });
    } catch (error) {
      console.error('Error deleting hospital:', error);
      setNotification({ type: 'error', message: 'Failed to delete hospital' });
    } finally {
      setHospitalToDelete(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        p: isMobile ? 1 : 2,
        mt:10
      }}>
        {/* Profile Section */}
        <Paper sx={{ 
          ...layoutStyles.profileSection,
          margin: isMobile ? '0 auto 20px' : '20px',
          p: 3
        }}>
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Avatar
              src={avatarUrl}
              sx={{ 
                width: 120, 
                height: 120, 
                border: '3px solid #589F78'
              }}
            >
              {uploadProgress > 0 && uploadProgress < 100 && (
                <CircularProgress size={68} />
              )}
            </Avatar>
            <IconButton 
              component="label"
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0,
                backgroundColor: '#589F78',
                '&:hover': {
                  backgroundColor: '#478c66'
                }
              }}
            >
              <CameraAlt sx={{ color: 'white' }} />
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Age"
                fullWidth
                value={userData.age}
                onChange={(e) => setUserData({...userData, age: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Blood Group"
                fullWidth
                value={userData.bloodGroup}
                onChange={(e) => setUserData({...userData, bloodGroup: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Date of Birth"
                value={userData.dob}
                onChange={(newValue) => setUserData({...userData, dob: newValue})}
                renderInput={(params) => (
                  <TextField {...params} fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Height"
                fullWidth
                value={userData.height}
                onChange={(e) => setUserData({...userData, height: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Weight"
                fullWidth
                value={userData.weight}
                onChange={(e) => setUserData({...userData, weight: e.target.value})}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.5, backgroundColor: '#589F78' }}
          >
            Save Profile
          </Button>
        </Paper>

        {/* Hospital Section */}
        <Paper sx={{ 
          ...layoutStyles.hospitalSection,
          margin: isMobile ? '0 auto' : '20px',
          p: 3
        }}>
          <Typography variant="h6" gutterBottom>
            Hospital Management
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Add Hospital"
              fullWidth
              value={newHospital}
              onChange={(e) => setNewHospital(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHospital()}
            />
            <Button 
              variant="contained" 
              onClick={handleAddHospital}
              sx={{ 
                whiteSpace: 'nowrap',
                backgroundColor: '#589F78'
              }}
            >
              Add Hospital
            </Button>
          </Box>

          {hospitals.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              p: 4,
              border: '1px dashed #ccc',
              borderRadius: 1
            }}>
              <Typography variant="body1" color="text.secondary">
                No hospitals added yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ 
              maxHeight: '400px',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#589F78',
                borderRadius: '3px'
              }
            }}>
              {hospitals.map((hospital) => (
                <ListItem 
                  key={hospital}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={() => setHospitalToDelete(hospital)}
                      sx={{ color: '#ff4444' }}
                    >
                      <Delete />
                    </IconButton>
                  }
                  sx={{
                    backgroundColor: '#f5f5f5',
                    mb: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#e0e0e0'
                    }
                  }}
                >
                  <ListItemText 
                    primary={hospital} 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Chatbot Floating Button */}
        <IconButton
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#589F78',
            color: 'white',
            '&:hover': { 
              backgroundColor: '#478c66',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease',
            width: 56,
            height: 56
          }}
          onClick={() => setIsChatOpen(true)}
        >
          <Chat />
        </IconButton>

        {/* Notification System */}
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={notification?.type} 
            onClose={() => setNotification(null)}
            sx={{ width: '100%' }}
          >
            {notification?.message}
          </Alert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={!!hospitalToDelete}
          onClose={() => setHospitalToDelete(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 1
            }
          }}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete <strong>{hospitalToDelete}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setHospitalToDelete(null)}
              sx={{ color: '#589F78' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirmed}
              sx={{ 
                color: '#ff4444',
                '&:hover': {
                  backgroundColor: 'rgba(255, 68, 68, 0.08)'
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}