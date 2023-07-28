import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface FullScreenModalProps {
  open: boolean;
  onClose?: () => void;
  onBack?: () => void;
  children: ReactNode;
  backButton?: boolean;
  closeButton?: boolean;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  open,
  onClose,
  onBack,
  children,
  backButton = false,
  closeButton = false,
}) => {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '98%',
          height: '98%',
          overflow: 'auto',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {backButton && (
          <IconButton
            size="large"
            onClick={handleBack}
            sx={{ position: 'absolute', top: 10, left: 10 }}
          >
            <ArrowBackIcon fontSize="large" color="action" />
          </IconButton>
        )}

        {closeButton && (
          <IconButton
            size="large"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon fontSize="large" color="action" />
          </IconButton>
        )}

        {children}
      </Box>
    </Modal>
  );
};

export default FullScreenModal;
