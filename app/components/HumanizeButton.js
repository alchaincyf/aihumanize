'use client';

import { Button } from '@mui/material';

export default function HumanizeButton({ onClick, t, isLoading }) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      variant="contained"
      color="primary"
      disabled={isLoading}
      sx={{ backgroundColor: '#1976d2' }} // 更自然的按钮颜色
    >
      {t('humanize_button')}
    </Button>
  );
}