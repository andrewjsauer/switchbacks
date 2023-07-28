'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import MailIcon from '@mui/icons-material/Mail';

import {
  signInWithEmailLink,
  isSignInWithEmailLink,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebase';

import MagicLink from '@/components/MagicLink';
import FullScreenModal from '@/components/FullScreenModal';

export default function LoginPage() {
  const router = useRouter();

  const [isMagicLinkEmailNeeded, setIsMagicLinkEmailNeeded] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showEmailPasswordFields, setShowEmailPasswordFields] = useState(false);

  const handleMagicLink = async (email: string) => {
    setLoading(true);

    try {
      await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');

      router.push('/');
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      CommonError(error);
    }
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      setShowEmailPasswordFields(true);

      if (email) handleMagicLink(email);
      else setIsMagicLinkEmailNeeded(true);
    }
  }, []);

  const CommonError = (err: any) => {
    setLoading(false);

    console.log(err);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('result', result);

      router.push('/');
      setLoading(false);
    } catch (error: any) {
      CommonError(error);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);

    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('result', result);

      router.push('/');
      setLoading(false);
    } catch (error: any) {
      CommonError(error);
    }
  };

  return (
    <>
      <FullScreenModal
        open={showEmailPasswordFields}
        onClose={() => setShowEmailPasswordFields(false)}
        closeButton
      >
        <MagicLink
          isLoading={isLoading}
          isMagicLinkEmailNeeded={isMagicLinkEmailNeeded}
          onBack={() => setShowEmailPasswordFields(false)}
          onLoading={setLoading}
          onMagicLink={handleMagicLink}
        />
      </FullScreenModal>
      <Button
        onClick={handleFacebookLogin}
        size="large"
        startIcon={<FacebookIcon />}
        sx={{ marginBottom: 2, backgroundColor: '#3b5998', color: '#fff', width: 300 }}
        variant="contained"
        disabled={isLoading}
      >
        Facebook
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={handleGoogleLogin}
        sx={{ marginBottom: 2, backgroundColor: '#4285F4', color: '#fff', width: 300 }}
        startIcon={<GoogleIcon />}
        disabled={isLoading}
      >
        Google
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={() => setShowEmailPasswordFields(true)}
        sx={{ marginBottom: 2, backgroundColor: '#3f51b5', width: 300 }}
        startIcon={<MailIcon />}
        disabled={isLoading}
      >
        Email Magic Link
      </Button>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ width: 300 }}>
        Use magic links if you already have an account with switchbacks
      </Typography>
    </>
  );
}
