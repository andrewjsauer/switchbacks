import * as React from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Loading(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <CircularProgress />
      <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
}
