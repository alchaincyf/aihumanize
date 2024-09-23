'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Typography, IconButton, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

export default function TextOutput({ value }) {
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
      <TextField
        fullWidth
        value={value}
        multiline
        rows={22}
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
      <Typography
        variant="body2"
        sx={{ position: 'absolute', bottom: 8, left: 16, color: 'text.secondary' }}
      >
        {wordCount} words
      </Typography>
      <Tooltip title={copySuccess ? "Copied!" : "Copy"}>
        <IconButton
          onClick={handleCopy}
          sx={{ position: 'absolute', bottom: 8, right: 16 }}
        >
          <ContentCopy />
        </IconButton>
      </Tooltip>
    </Box>
  );
}