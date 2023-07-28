'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export const metadata = {
  title: 'switchbacks | page not found',
  description: 'trail talk begins here',
};

export default function PageNotFound() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <Box
      display="grid"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      px={6}
      py={24}
    >
      <Box maxWidth="3xl" textAlign="center">
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h2" fontWeight="semibold" gutterBottom>
          Oops! Page not found
        </Typography>
        <Typography variant="body1" marginBottom={10}>
          We&apos;re sorry. The page you requested could not be found. Please go back to the
          homepage or contact us.
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button variant="contained" color="primary" size="large" onClick={handleClick}>
            Go back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
