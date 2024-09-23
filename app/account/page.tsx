'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Box, Button, Typography } from '@mui/material';
import Layout from '../components/Layout';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('No such document!');
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!user || !userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Account Information</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>Email: {user.email}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>Points: {userData.points}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>Points Expiry: {userData.pointsExpiry}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>Account Level: {userData.accountLevel}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>Level Expiry: {userData.levelExpiry}</Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 2 }}>Logout</Button>
      </Box>
    </Layout>
  );
}