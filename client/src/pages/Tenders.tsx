import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TenderCard from '../components/TenderCard';
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
        setLoading(true);
        setError(null);
        const response = await api.get<Tender[]>('/tenders');
        console.log('Tenders data:', response.data); //for debugging
        setTenders(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tenders');
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
    const fetchUpdatedTenders = async () => {
      const response = await api.get<Tender[]>('/tenders');
      setTenders(response.data);
    };
    fetchUpdatedTenders();
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
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!tenders.length) {
    return (
      <Box p={3}>
        <Typography>No tenders available at the moment.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Available Tenders
      </Typography>

      {showBidForm && selectedTender && (
        <Box mb={4}>
          <BidForm 
            tenderId={selectedTender.id} 
            onSuccess={handleBidSubmitSuccess}
            onCancel={() => setShowBidForm(false)}
          />
        </Box>
      )}

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3,
        width: '100%'
      }}>
        {tenders.map((tender) => (
          <Box key={tender.id} sx={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TenderCard 
              tender={tender} 
              action={
                tender.status === 'Open' && (
                  <Button 
                    variant="contained" 
                    onClick={() => handleBidClick(tender)}
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!user}
                  >
                    {user ? 'Place Bid' : 'Login to Bid'}
                  </Button>
                )
              }
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Tenders;