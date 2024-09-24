'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import Layout from '../components/Layout';

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoToAccount = () => {
    router.push('/account');
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4">Thank you for your subscription!</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your account has been successfully upgraded. Enjoy your new features!
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoToAccount} sx={{ mt: 3 }}>
          Go to My Account
        </Button>
      </Box>
    </Layout>
  );
}