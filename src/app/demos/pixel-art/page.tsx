'use client';

import { Box } from '@mui/material';
import { PixelArtGenerator } from '../../components/PixelArt';

export default function PixelArtDemo() {
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
        <PixelArtGenerator />
      </Box>
    </Box>
  );
} 