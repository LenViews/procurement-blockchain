import {
  Card,
  CardContent,
  Typography,
  //Button,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import type { Tender } from '../types';
import { format } from 'date-fns';

interface TenderCardProps {
  tender: Tender;
  action?: React.ReactNode;
}

const TenderCard = ({ tender, action }: TenderCardProps) => {
  const getStatusColor = () => {
    switch (tender.status) {
      case 'Open':
        return 'success';
      case 'Closed':
        return 'error';
      case 'Awarded':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="h6">{tender.title}</Typography>
          <Chip
            label={tender.status}
            color={getStatusColor()}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Category: {tender.category}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Budget: KES {tender.budget.toLocaleString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Deadline: {format(new Date(tender.deadline), 'PPpp')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {tender.description.length > 150
            ? `${tender.description.substring(0, 150)}...`
            : tender.description}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Posted: {format(new Date(tender.createdAt), 'PP')}
        </Typography>
      </CardContent>
      {action && (
        <Box sx={{ p: 2 }}>
          {action}
        </Box>
      )}
    </Card>
  );
};

export default TenderCard;