import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import type { Bid } from '../types';
import api from '../services/api';
//import useAuth from '../hooks/useAuth';

const Bids = () => {
//  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.get<Bid[]>('/bids/my');
        setBids(response.data);
      } catch (err) {
        setError('Failed to fetch bids');
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading bids...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Bids
      </Typography>
      
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tender ID</TableCell>
              <TableCell>Amount (KES)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submission Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>{bid.tenderId}</TableCell>
                <TableCell>{bid.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Box 
                    component="span" 
                    sx={{
                      color: bid.status === 'Awarded' ? 'success.main' : 
                            bid.status === 'Rejected' ? 'error.main' : 'text.primary'
                    }}
                  >
                    {bid.status}
                  </Box>
                </TableCell>
                <TableCell>{new Date(bid.submissionDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Bids;