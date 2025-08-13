import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar, Paper } from '@mui/material';
import useAuth from '../hooks/useAuth';
import api from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phoneNumber: '',
    kraPin: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        kraPin: user.kraPin,
        category: user.category,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.put('/vendors/me', formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box p={3}>
        <Typography>Loading profile...</Typography>
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
            {user.companyName.charAt(0).toUpperCase()}
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
          />
          <TextField
            fullWidth
            label="KRA PIN"
            name="kraPin"
            value={formData.kraPin}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
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