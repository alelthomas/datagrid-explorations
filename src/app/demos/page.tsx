'use client';

import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Container } from '@mui/material';
import PTOCalendar from '../components/PTOCalendar/PTOCalendar';

interface Demo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  component: React.ComponentType;
}

const demos: Demo[] = [
  {
    id: 'pto-calendar',
    title: 'PTO Calendar',
    description: 'A calendar view showing employee PTO days with continuous period highlighting',
    thumbnail: '/demos/pto-calendar.png',
    component: PTOCalendar
  },
  // Add more demos here as we create them
];

export default function DemosPage() {
  const [selectedDemo, setSelectedDemo] = useState<string>('pto-calendar');
  const SelectedComponent = demos.find(demo => demo.id === selectedDemo)?.component;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Data Grid Examples
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          {demos.map((demo) => (
            <Grid item xs={12} sm={6} md={4} key={demo.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  height: '100%',
                  border: (theme) => 
                    selectedDemo === demo.id 
                      ? `2px solid ${theme.palette.primary.main}`
                      : '2px solid transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
                onClick={() => setSelectedDemo(demo.id)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={demo.thumbnail}
                  alt={demo.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {demo.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {demo.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Demo Content */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 3,
        boxShadow: 1
      }}>
        {SelectedComponent && <SelectedComponent />}
      </Box>
    </Container>
  );
} 