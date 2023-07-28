import React from 'react';
import Image from 'next/image';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import Login from '@/components/LoginScreen';

export default function LoginPage() {
  return (
    <>
      <Image
        src="/images/background.png"
        alt="Picture of map"
        fill
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <Container
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            style={{ color: 'black', textAlign: 'center', fontWeight: '400' }}
          >
            switchbacks
          </Typography>
          <Typography component="h2" variant="h4" style={{ color: '#565656', textAlign: 'center' }}>
            trail talk begins here
          </Typography>
          <Container
            style={{
              marginTop: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Login />
          </Container>
        </Container>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
          }}
        >
          {'Copyright © '}
          <Link color="inherit" href="https://sauerApple.com/">
            sauerApple
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </div>
    </>
  );
}
