'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import Image from 'next/image';

export default function TextOutput({ value, isLoading }) {
  const [wordCount, setWordCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const countWords = (text) => {
      const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
      const englishWords = text.match(/\b\w+\b/g) || [];
      return chineseChars.length + englishWords.length;
    };

    setWordCount(countWords(value));
  }, [value]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          <Image src="/loading.svg" alt="Loading" width={100} height={100} />
        </Box>
      ) : (
        <TextField
          fullWidth
          value={value}
          multiline
          rows={21}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none', // 去掉边框
              },
              lineHeight: '1.5', // 设置行高
              padding: '16px', // 设置内边距
            },
            height: '100%',
            overflow: 'auto', // 支持滚动
          }}
        />
      )}
      <Typography
        variant="body2"
        sx={{ position: 'absolute', bottom: 2, left: 16, color: 'text.secondary' }}
      >
        {wordCount} words
      </Typography>
      <Tooltip title={copySuccess ? "Copied!" : "Copy"}>
        <IconButton
          onClick={handleCopy}
          sx={{ position: 'absolute', bottom: 0, right: 0 }}
        >
          <ContentCopy />
        </IconButton>
      </Tooltip>
    </Box>
  );
}