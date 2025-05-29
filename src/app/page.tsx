'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';

const demos = [
  {
    title: 'PTO Calendar',
    description: 'A calendar view showing employee time off, sick days, and holidays',
    href: '/demos/pto-calendar'
  },
  {
    title: 'Stock Dashboard',
    description: 'A dashboard showing stock prices and trends',
    href: '/stock-dashboard'
  },
  {
    title: 'Pixel Art Generator',
    description: 'Create pixel art using a customizable grid with color palette',
    href: '/demos/pixel-art'
  }
];

export default function Home() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f7f6f9',
      p: 8
    }}>
      <Typography variant="h1">Demos</Typography>
      <ul>
        {demos.map((demo) => (
          <li key={demo.href}>
            <Link href={demo.href}>
              <Typography variant="h6">{demo.title}</Typography>
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
} 