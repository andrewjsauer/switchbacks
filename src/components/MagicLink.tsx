import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/firebase';

interface MagicLinkProps {
  isMagicLinkEmailNeeded: boolean;
  onMagicLink: (email: string) => void;
  onBack: () => void;
  isLoading: boolean;
  onLoading: (isLoading: boolean) => void;
}

const actionCodeSettings = {
  url: window.location.href,
  handleCodeInApp: true,
};

const MagicLink: React.FC<MagicLinkProps> = ({
  isMagicLinkEmailNeeded,
  onMagicLink,
  onBack,
  isLoading,
  onLoading,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [hasSent, setHasSent] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    onLoading(true);

    if (!validateEmail(email)) {
      setError('Invalid email');
      onLoading(false);
      return;
    }

    if (isMagicLinkEmailNeeded) {
      onMagicLink(email);
    } else {
      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);

        onLoading(false);
        setHasSent(true);
      } catch (err: any) {
        setError(err);
        onLoading(false);
      }
    }
  };

  const formText = isMagicLinkEmailNeeded
    ? 'Please confirm your email'
    : "Enter your email address and we'll email you a magic link so you can sign in without a password.";

  return (
    <Box
      component="form"
      onSubmit={handleMagicLinkLogin}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        width: '100%',
        maxWidth: '500px',
        margin: 'auto',
        gap: 4,
      }}
    >
      <Typography variant="h2" sx={{ textAlign: 'center' }}>
        magic link
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'left' }}>
        {formText}
      </Typography>
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={email}
        onChange={(e) => {
          setError('');
          setEmail(e.target.value);
        }}
      />
      {error && (
        <Alert sx={{ width: '100% ' }} severity="error">
          {error}
        </Alert>
      )}
      {hasSent && (
        <Alert sx={{ width: '100% ' }} severity="success">
          Your email has been sent. Please check your inbox.
        </Alert>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        variant="contained"
        size="large"
        sx={{ alignSelf: 'stretch' }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default MagicLink;
