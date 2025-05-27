'use client';

import { Box } from '@mui/material';
import PTOCalendar from '../../components/PTOCalendar';

export default function PTOCalendarDemo() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      p: 6,
      backgroundColor: '#f7f6f9'
    }}>
      <Box sx={{ 
        height: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <PTOCalendar />
      </Box>
    </Box>
  );
} 