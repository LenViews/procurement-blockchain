import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar, Paper, CircularProgress } from '@mui/material';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

interface ProfileFormData {
  companyName: string;
  email: string;
  phoneNumber: string;
  kraPin: string;
  category: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    companyName: '',
    email: '',
    phoneNumber: '',
    kraPin: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        kraPin: user.kraPin || '',
        category: user.category || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user makes changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      await api.put('/vendors/me', formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Typography color="error">Failed to load user profile</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
            {user.companyName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h6">{user.companyName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.category === 'goods' ? 'Goods Supplier' : 'Service Provider'}
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            fullWidth
            label="KRA PIN"
            name="kraPin"
            value={formData.kraPin}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 11 }}
          />
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updating}
              startIcon={updating ? <CircularProgress size={20} /> : null}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;