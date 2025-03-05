'use client';

import { Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPaperProps {
  children: ReactNode;
}

export default function AnimatedPaper({ children }: AnimatedPaperProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1.05, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='flex justify-center items-center w-full'
      style={{ height: '100%', marginRight: '-35px' }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '95%',
          height: '95%',
          minHeight: '200px',
          padding: 4,
          position: 'relative',
          borderRadius: 2,
          overflow: 'auto',
        }}
        className='bg-white shadow-xl transition-all'
      >
        {children}
      </Paper>
    </motion.div>
  );
}
