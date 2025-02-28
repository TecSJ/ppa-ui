'use client';

import { Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface AnimatedPaperProps {
  children: ReactNode;
}

export default function AnimatedPaper({ children }: AnimatedPaperProps) {
  const [maxHeight, setMaxHeight] = useState('90vh');

  useEffect(() => {
    const updateMaxHeight = () => {
      setMaxHeight(`${window.innerHeight * 0.9}px`);
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);

    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1.05, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      className='flex justify-center items-center w-full h-full'
    >
      <Paper
        elevation={4}
        sx={{
          width: '90%',
          maxHeight,
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
