'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { Box, Button, TextField, Typography, Paper, Container, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Layout from '../components/Layout';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const initializeUserDocument = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const now = new Date();
      const oneMonthLater = new Date(now.setMonth(now.getMonth() + 1));
      await setDoc(userRef, {
        email: user.email,
        accountLevel: 'free',
        wordsLimit: 5000,
        wordsUsed: 0,
        wordsExpiry: oneMonthLater.toISOString(),
        subscriptionStatus: 'inactive',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await initializeUserDocument(userCredential.user);
      router.push('/account');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await initializeUserDocument(result.user);
      router.push('/account');
    } catch (error) {
      setError('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontFamily: 'var(--font-playfair-display)' }}>
            Log In
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mt: 1, mb: 2, fontFamily: 'var(--font-montserrat)' }}
          >
            Log in with Google
          </Button>
          <Divider sx={{ width: '100%', my: 2 }}>or</Divider>
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 3, mb: 2, fontFamily: 'var(--font-montserrat)' }}
            >
              Log In with Email
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