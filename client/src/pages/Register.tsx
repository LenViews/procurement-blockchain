import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Divider,
  Fade
} from '@mui/material';
import { Email, Lock, Business, Receipt, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      kraPin: '',
      companyName: '',
      phoneNumber: '',
      category: 'goods' as 'goods' | 'services',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Confirm Password is required'),
      kraPin: Yup.string()
        .required('KRA PIN is required')
        .matches(/^[A-Z]\d{9}[A-Z]$/, 'Invalid KRA PIN format (e.g., A123456789Z)'),
      companyName: Yup.string().required('Company name is required'),
      phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^\+254\d{9}$/, 'Invalid Kenyan phone number format (+254XXXXXXXXX)'),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);
        await register(values);
        navigate('/dashboard');
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Registration failed. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/kenya.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
      }}
    >
      <Fade in timeout={500}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            width: '100%',
            maxWidth: 700,
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4"
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: '#2E7D32',
                mb: 1
              }}
            >
              VENDOR REGISTRATION
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our trusted procurement network
            </Typography>
          </Box>

          {error && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(211, 47, 47, 0.3)',
                textAlign: 'center'
              }}
            >
              <Typography color="error.main" sx={{ fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          )}

          <Box 
            component="form" 
            onSubmit={formik.handleSubmit}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 3
            }}
          >
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField
                fullWidth
                id="companyName"
                name="companyName"
                label="Company Name"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2E7D32',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2E7D32',
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              id="kraPin"
              name="kraPin"
              label="KRA PIN"
              placeholder="A123456789Z"
              value={formik.values.kraPin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.kraPin && Boolean(formik.errors.kraPin)}
              helperText={formik.touched.kraPin && formik.errors.kraPin}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Receipt color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7D32',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7D32',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
            />

            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              placeholder="+254712345678"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7D32',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7D32',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
            />

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7D32',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
            />

            <FormControl 
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7D32',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Category"
                error={formik.touched.category && Boolean(formik.errors.category)}
              >
                <MenuItem value="goods">Goods</MenuItem>
                <MenuItem value="services">Services</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  py: 1.75,
                  backgroundColor: '#2E7D32',
                  '&:hover': {
                    backgroundColor: '#1B5E20',
                  },
                }}
              >
                {isSubmitting ? 'Registering...' : 'Register Account'}
              </Button>
            </Box>

            <Divider sx={{ gridColumn: '1 / -1', my: 2 }} />

            <Typography variant="body2" align="center" sx={{ gridColumn: '1 / -1', color: 'text.secondary' }}>
              Already have an account?{' '}
              <MuiLink 
                component={Link} 
                to="/login"
                sx={{ 
                  color: '#2E7D32',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'none',
                  }
                }}
              >
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Register;