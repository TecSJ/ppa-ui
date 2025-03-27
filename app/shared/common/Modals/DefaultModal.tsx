'use client';

import { ReactNode } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.8, y: -50, transition: { duration: 0.2, ease: 'easeIn' } },
};

interface DefaultModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function DefaultModal({ open, onClose, title, children }: DefaultModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        variants={modalVariants}
        initial='hidden'
        animate={open ? 'visible' : 'hidden'}
        exit='exit'
        style={{
          width: '80%',
          maxWidth: '1000px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          padding: '24px',
        }}
      >
        <Typography
          id='modal-title'
          variant='h4'
          component='h2'
          sx={{ color: '#32169b', textAlign: 'initial', userSelect: 'none' }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            mt: 1,
            mb: 3,
            width: '100%',
            height: '2px',
            backgroundColor: 'rgb(50, 22, 155)',
            borderRadius: '1px',
          }}
        />
        <Box sx={{ mt: 2 }}>{children}</Box>
      </motion.div>
    </Modal>
  );
}

