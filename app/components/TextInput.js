'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';

export default function TextInput({ value, onChange, t }) {
  const [wordCount, setWordCount] = useState(0);

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
        rows={22}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none', // 去掉边框
            },
            lineHeight: '1.5', // 设置行高
            padding: '16px', // 设置内边距
          },
          height: '100%',
        }}
      />
      <Typography
        variant="body2"
        sx={{ position: 'absolute', bottom: 8, left: 16, color: 'text.secondary' }}
      >
        {wordCount} words
      </Typography>
    </Box>
  );
}