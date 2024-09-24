// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import Layout from '../components/Layout';

interface UserData {
  accountLevel: string;
  subscriptionStatus: string;
  wordsLimit: number;
  wordsUsed: number;
  planExpiryDate: string;
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
    await signOut(auth);
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

  if (!user || !userData) {
    return <Typography>No user data available.</Typography>;
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 3 }}>
        <Typography variant="h4" gutterBottom>Account Information</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">Account Level: {userData.accountLevel}</Typography>
        <Typography variant="body1">Subscription Status: {userData.subscriptionStatus}</Typography>
        <Typography variant="body1">Words Limit: {userData.wordsLimit}</Typography>
        <Typography variant="body1">Words Used: {userData.wordsUsed}</Typography>
        <Typography variant="body1">Plan Expiry Date: {new Date(userData.planExpiryDate).toLocaleDateString()}</Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>Logout</Button>
      </Box>
    </Layout>
  );
}