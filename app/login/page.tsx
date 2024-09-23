'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // 设置新用户的默认等级和积分
        await setDoc(doc(db, 'users', user.uid), {
          accountLevel: 'lv0',
          points: 5000,
          pointsExpiry: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // 30天有效期
        });
        router.push('/account');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/account');
      }
    } catch (error) {
      console.error('Error:', error);
      // 可以在这里添加错误处理逻辑，比如显示错误消息给用户
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      // 检查用户是否是新用户
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // 设置新用户的默认等级和积分
        await setDoc(doc(db, 'users', user.uid), {
          accountLevel: 'lv0',
          points: 5000,
          pointsExpiry: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // 30天有效期
        });
      }
      router.push('/account');
    } catch (error) {
      console.error('Error:', error);
      // 可以在这里添加错误处理逻辑，比如显示错误消息给用户
    }
  };

  return (
    <Layout>
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4">{isSignUp ? 'Sign Up' : 'Login'}</Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{ mb: 2 }}
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGoogleLogin}
            fullWidth
            sx={{ mb: 2 }}
          >
            Login with Google
          </Button>
          <Link
            component="button"
            variant="body2"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </Layout>
  );
}