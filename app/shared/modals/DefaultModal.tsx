'use client';

import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 6,
};

interface DefaultModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function DefaultModal({
  open, onClose, title, children,
}: DefaultModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
    >
      <Box sx={style}>
        <Typography
          id='modal-title'
          variant='h4'
          component='h2'
          sx={{
            color: '#32169b',
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            mt: 0.5,
            mb: 3,
            width: '100%',
            height: '2px',
            backgroundColor: 'rgb(50, 22, 155)',
            borderRadius: '1px',
          }}
        />
        <Box sx={{ mt: 6 }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
