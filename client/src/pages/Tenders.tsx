import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import  TenderCard  from '../components/TenderCard';
import type { Tender } from '../types';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import BidForm from '../components/BidForm';

const Tenders = () => {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await api.get<Tender[]>('/tenders');
        setTenders(response.data);
      } catch (err) {
        setError('Failed to fetch tenders');
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const handleBidClick = (tender: Tender) => {
    setSelectedTender(tender);
    setShowBidForm(true);
  };

  const handleBidSubmitSuccess = () => {
    setShowBidForm(false);
    // Optionally refresh bids list
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading tenders...</Typography>
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
        Available Tenders
      </Typography>

      {showBidForm && selectedTender ? (
        <Box mb={4}>
          <BidForm 
            tenderId={selectedTender.id} 
            onSuccess={handleBidSubmitSuccess}
            onCancel={() => setShowBidForm(false)}
          />
        </Box>
      ) : null}

      <Grid container spacing={3}>
        {tenders.map((tender) => (
          <Grid item xs={12} sm={6} md={4} key={tender.id}>
            <TenderCard 
              tender={tender} 
              action={
                tender.status === 'Open' && (
                  <Button 
                    variant="contained" 
                    onClick={() => handleBidClick(tender)}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Place Bid
                  </Button>
                )
              }
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Tenders;