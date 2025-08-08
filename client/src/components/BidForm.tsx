import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

interface BidFormProps {
  tenderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BidForm = ({ tenderId, onSuccess, onCancel }: BidFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      amount: '',
      description: '',
      documents: [] as File[],
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Amount is required')
        .min(1, 'Amount must be greater than 0'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('tenderId', tenderId);
        formData.append('amount', values.amount);
        formData.append('description', values.description);
        values.documents.forEach((file) => {
          formData.append('documents', file);
        });

        await api.post('/bids', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to submit bid. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      formik.setFieldValue('documents', files);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit Bid
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="amount"
              name="amount"
              label="Amount (KES)"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mb: 1 }}
              >
                Upload Documents
              </Button>
            </label>
            {formik.values.documents.length > 0 && (
              <Typography variant="body2">
                {formik.values.documents.length} file(s) selected
              </Typography>
            )}
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              {onCancel && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Bid'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BidForm;