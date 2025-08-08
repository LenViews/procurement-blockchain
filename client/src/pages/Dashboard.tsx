import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { TenderCard } from '../components/TenderForm';
import type { Bid, Tender } from '../types';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tendersRes, bidsRes] = await Promise.all([
          api.get<Tender[]>('/tenders'),
          api.get<Bid[]>('/bids/my'),
        ]);
        setTenders(tendersRes.data);
        setBids(bidsRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
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
        Welcome, {user?.companyName}
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Active Tenders
              </Typography>
              <Typography variant="h4">
                {tenders.filter(t => t.status === 'Open').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                My Bids
              </Typography>
              <Typography variant="h4">{bids.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Awarded Contracts
              </Typography>
              <Typography variant="h4">
                {bids.filter(b => b.status === 'Awarded').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Recent Tenders
        </Typography>
        <Grid container spacing={2}>
          {tenders.slice(0, 3).map((tender) => (
            <Grid item xs={12} sm={6} md={4} key={tender.id}>
              <TenderCard tender={tender} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;