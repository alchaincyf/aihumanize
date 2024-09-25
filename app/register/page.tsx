'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import Layout from '../components/Layout';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 初始化用户文档
      const now = new Date();
      const oneMonthLater = new Date(now.setMonth(now.getMonth() + 1));
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        accountLevel: 'free',
        wordsLimit: 5000,
        wordsUsed: 0,
        wordsExpiry: oneMonthLater.toISOString(),
        subscriptionStatus: 'inactive',
        createdAt: new Date().toISOString(),
      });

      router.push('/account');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontFamily: 'var(--font-playfair-display)' }}>
            Register
          </Typography>
          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, fontFamily: 'var(--font-montserrat)' }}
            >
              Register
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </Layout>
  );
}