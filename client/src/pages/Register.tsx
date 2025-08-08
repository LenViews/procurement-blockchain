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
  Paper,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

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
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Vendor Registration
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
          Create your procurement account
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box 
          component="form" 
          onSubmit={formik.handleSubmit}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2
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
              error={formik.touched.companyName && Boolean(formik.errors.companyName)}
              helperText={formik.touched.companyName && formik.errors.companyName}
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
            error={formik.touched.kraPin && Boolean(formik.errors.kraPin)}
            helperText={formik.touched.kraPin && formik.errors.kraPin}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <TextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            placeholder="+254712345678"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              label="Category"
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <MenuItem value="goods">Goods</MenuItem>
              <MenuItem value="services">Services</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ gridColumn: '1 / -1' }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" underline="hover">
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;