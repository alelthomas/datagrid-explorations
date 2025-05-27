'use client';

import { Box, Typography, Card, CardContent, CardActionArea, Container } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import Link from 'next/link';

const demos = [
  {
    title: 'PTO Calendar',
    description: 'A calendar view showing employee time off, sick days, and holidays',
    icon: <CalendarMonth sx={{ fontSize: 40, color: '#3E63DD' }} />,
    href: '/demos/pto-calendar'
  }
];

export default function Home() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f7f6f9',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 6,
            fontWeight: 'bold',
            color: '#1f1f20'
          }}
        >
          MUI DataGrid Demos
        </Typography>
        
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {demos.map((demo) => (
            <Card 
              key={demo.title}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardActionArea 
                component={Link}
                href={demo.href}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  p: 3
                }}>
                  {demo.icon}
                  <Typography 
                    variant="h5" 
                    component="h2"
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#1f1f20'
                    }}
                  >
                    {demo.title}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      color: '#75758d'
                    }}
                  >
                    {demo.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
} 