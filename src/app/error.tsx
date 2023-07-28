'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

interface Props {
  error: Error | null;
}

export const metadata = {
  title: 'switchbacks | error',
  description: 'trail talk begins here',
};

export default function ErrorPage({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      display="grid"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      px={3}
      py={12}
    >
      <Box maxWidth="md" textAlign="center">
        <Typography variant="h4" color="primary" gutterBottom>
          Oops!
        </Typography>
        <Typography variant="subtitle1" fontWeight="semibold" gutterBottom>
          Please try again later or contact our support team if the problem persists.
        </Typography>
        <Box mt={2} mb={5}>
          <Typography variant="body1">
            <b>Error:</b> {error?.message || 'Unknown error occurred.'}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" gap={2}>
          <Link href="/" passHref>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Back to home
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
