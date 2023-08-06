import React, { useState, useEffect } from 'react';
import { Container, TextField, Box, Button, Avatar, FormControl, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';

import { query, where, getDocs, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

import { db, storage } from '@/firebase';

interface User {
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

export type ProfileTypes = 'EDIT' | 'WELCOME';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  type: ProfileTypes;
}

interface FormFields {
  displayName: string;
  email: string;
  phoneNumber: string;
}

export const ProfileStates = {
  EDIT: 'EDIT' as ProfileTypes,
  WELCOME: 'WELCOME' as ProfileTypes,
};

const ProfileText: Record<ProfileTypes, { title: string; description: string }> = {
  EDIT: {
    title: 'edit profile',
    description: 'Update your profile information below.',
  },
  WELCOME: {
    title: 'welcome to our community!',
    description:
      'Before setting off on your trail, take a moment to set or change your trail name and profile photo. This unique identifier helps others recognize your contributions. Happy trailing!',
  },
};

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, type }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormFields>();

  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [photo, setPhoto] = useState<string | null>(user?.photoURL || null);

  const phoneNumber = watch('phoneNumber');
  const displayName = watch('displayName');

  useEffect(() => {
    const displayNameChanged = displayName !== (user.displayName || '');
    const phoneNumberChanged = phoneNumber !== (user.phoneNumber || '');
    const photoChanged = photo !== user.photoURL;

    if (displayNameChanged || phoneNumberChanged || photoChanged) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [displayName, phoneNumber, photo]);

  const onSubmit = async (data: FormFields) => {
    setIsLoading(true);

    const q = query(collection(db, 'usernames'), where('displayName', '==', data.displayName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setIsLoading(false);
      setError('displayName', {
        type: 'manual',
        message: 'This trail name has already been taken, please choose another one.',
      });
      return;
    }

    let photoURL = user.photoURL;

    if (photo) {
      const storageRef = ref(storage, `images/thumbnails/${user.uid}`);
      const resizedRef = ref(storage, `images/thumbnails/resized/${user.uid}_320x320`);

      uploadBytes(storageRef, photo)
        .then((snapshot) => {
          // Start polling for the resized image
          getResizedImageURL(resizedRef, 1000, 20)
            .then((resizedURL) => {
              photoURL = resizedURL;
              updateFirebaseProfile(photoURL, data);
            })
            .catch((error) => {
              console.error('Could not get resized image URL', error);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      updateFirebaseProfile(photoURL, data);
    }

    setIsChanged(false);
  };

  const getResizedImageURL = (resizedRef, delay, retries) => {
    return new Promise((resolve, reject) => {
      getDownloadURL(resizedRef)
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          if (retries > 0) {
            setTimeout(() => {
              getResizedImageURL(resizedRef, delay, retries - 1)
                .then((url) => resolve(url))
                .catch((error) => reject(error));
            }, delay);
          } else {
            reject(error);
          }
        });
    });
  };

  const updateFirebaseProfile = async (photoURL: string | null, data: FormFields) => {
    updateProfile(user, {
      displayName: data.displayName,
      photoURL,
      phoneNumber: data.phoneNumber,
    })
      .then(() => {
        setIsLoading(false);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });

    await addDoc(collection(db, 'usernames'), {
      displayName: data.displayName,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const isValidImage = /image\/(jpeg|png|jpg|gif)$/i.test(file.type);

      if (!isValidImage) {
        setError('photo', {
          type: 'manual',
          message: 'Invalid file format. Please upload an image file.',
        });
        return;
      }

      console.log(file);
      setPhoto(file);
    }

    setIsChanged(true);
  };

  const profilePhoto = photo.name ? URL.createObjectURL(photo) : photo || undefined;
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="left" gutterBottom>
        {ProfileText[type].title}
      </Typography>
      <Typography variant="subtitle1" align="left" gutterBottom>
        {ProfileText[type].description}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <Avatar src={profilePhoto} sx={{ width: 80, height: 80 }} />
            <FormControl variant="outlined">
              <TextField
                {...register('photo')}
                type="file"
                onChange={handleFileChange}
                error={Boolean(errors.photo)}
                helperText={errors.photo?.message}
              />
            </FormControl>
          </Box>
          <TextField
            {...register('displayName', { required: 'Display name is required' })}
            defaultValue={user.displayName || ''}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Trail Name"
            autoFocus
            error={Boolean(errors.displayName)}
            helperText={errors.displayName?.message}
          />
          <TextField
            {...register('email')}
            defaultValue={user.email || ''}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            disabled
          />
          <TextField
            {...register('phoneNumber')}
            defaultValue={user.phoneNumber || ''}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Phone Number"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            size="large"
            fullWidth
            disabled={!isChanged || isLoading}
          >
            {isLoading ? 'Loading...' : 'Save Changes'}
          </Button>
          {user.displayName && photo && type === 'WELCOME' && (
            <Button variant="outlined" fullWidth color="secondary" size="large" onClick={onClose}>
              No Changes Needed
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default UserProfile;
