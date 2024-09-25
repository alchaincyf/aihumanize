'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { Box, Typography, Paper, Container, Button, Divider, CircularProgress } from '@mui/material';
import Layout from '../components/Layout';

interface UserData {
  email: string;
  accountLevel: string;
  wordsLimit: number;
  wordsUsed: number;
  wordsExpiry: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
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
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'var(--font-playfair-display)' }}>
            Account Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-montserrat)' }}>Email</Typography>
            <Typography>{userData?.email}</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-montserrat)' }}>Account Level</Typography>
            <Typography>{userData?.accountLevel || 'Free'}</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-montserrat)' }}>Words Limit</Typography>
            <Typography>{userData?.wordsLimit || 'N/A'}</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-montserrat)' }}>Words Used</Typography>
            <Typography>{userData?.wordsUsed || 0}</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-montserrat)' }}>Words Expiry</Typography>
            <Typography>
              {userData?.wordsExpiry ? new Date(userData.wordsExpiry).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ mt: 2, fontFamily: 'var(--font-montserrat)' }}
          >
            Logout
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}