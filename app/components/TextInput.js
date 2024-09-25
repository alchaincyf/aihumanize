'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Typography, useMediaQuery } from '@mui/material';

export default function TextInput({ value, onChange, t }) {
  const [wordCount, setWordCount] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const countWords = (text) => {
      const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
      const englishWords = text.match(/\b\w+\b/g) || [];
      return chineseChars.length + englishWords.length;
    };

    setWordCount(countWords(value));
  }, [value]);

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        placeholder={t('input_placeholder')}
        variant="outlined"
        margin="normal"
        multiline
        rows={isMobile ? 10 : 21}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none', // 去掉边框
            },
            lineHeight: '1.5', // 设置行高
            padding: '16px', // 设置内边距
            fontSize: isMobile ? '0.9rem' : '1rem',
          },
          height: '100%',
        }}
      />
      <Typography
        variant="body2"
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 16, 
          color: 'text.secondary',
          fontSize: isMobile ? '0.7rem' : '0.8rem',
        }}
      >
        {wordCount} words
      </Typography>
    </Box>
  );
}