import { useState, useEffect } from 'react';
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
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        await login(values.email, values.password);
        navigate('/dashboard');
      } catch (err) {
        setError('Invalid email or password');
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
      <Fade in timeout={800}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            width: '100%',
            maxWidth: 450,
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
              PROCUREMENT PORTAL
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Secure access to the trusted procurement network
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
            sx={{ display: 'grid', gap: 2 }}
          >
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              variant="outlined"
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
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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

            <Box sx={{ textAlign: 'right' }}>
              <MuiLink 
                component={Link} 
                to="/forgot-password"
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: '#2E7D32',
                  }
                }}
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              variant="contained"
              fullWidth
              type="submit"
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                backgroundColor: '#2E7D32',
                '&:hover': {
                  backgroundColor: '#1B5E20',
                },
                mt: 1
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
            Don't have an account?{' '}
            <MuiLink 
              component={Link} 
              to="/register"
              sx={{ 
                color: '#2E7D32',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'none',
                }
              }}
            >
              Register now
            </MuiLink>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;