import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { madaniArabicBold } from '@/public/assets/fonts';

interface CardProps {
  title: string;
  description?: React.ReactNode;
  image?: string;
  width?: string | number;
  height?: string | number;
  icon?: React.ReactNode;
}

export default function CardTemplate({
  title = '', description = '', image = '', width = 1500, height = 'auto', icon = undefined,
}: CardProps) {
  return (
    <Box sx={{ maxWidth: width, height, padding: 2 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          height: '100%',
          borderRadius: '16px',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {image && (
          <Box
            component='img'
            sx={{
              height: 250,
              width: '100%',
              objectFit: 'cover',
              mb: 3,
            }}
            alt={title}
            src={image}
          />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon && (
            <Box sx={{ mr: 2, fontSize: '3rem' }}>
              {' '}
              {icon}
            </Box>
          )}
          <Typography
            gutterBottom
            variant='h5'
            className={madaniArabicBold.className}
            sx={{ color: '#32129a' }}
          >
            {title}
          </Typography>
        </Box>
        {description && (
          <Box sx={{ color: 'textSecondary' }}>
            {description}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
