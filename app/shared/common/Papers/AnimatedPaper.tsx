'use client';

import { Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPaperProps {
  children: ReactNode;
  title?: string;
}

export default function AnimatedPaper({ children, title }: AnimatedPaperProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1.05, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='flex justify-center items-center w-full'
      style={{ height: '100%' }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '95%',
          height: '95%',
          maxWidth: '95vw',
          minHeight: '200px',
          maxHeight: '85vh',
          padding: 4,
          position: 'relative',
          borderRadius: 2,
          overflow: 'auto',
        }}
        className='bg-white shadow-xl transition-all'
      >
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          align='left'
          sx={{ userSelect: 'none' }}
        >
          {title}
        </Typography>
        {children}
      </Paper>
    </motion.div>
  );
}
