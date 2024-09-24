'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
  Container,
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Link,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import logo from '../../public/logo.svg';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import NextLink from 'next/link';

interface LayoutProps {
  children: ReactNode;
  params?: {
    lang?: string;
  };
  t?: (key: string) => string;
}

export default function Layout({ children, params, t }: LayoutProps) {
  const [mode, setMode] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  };

  const themeConfig = createTheme({
    palette: {
      mode,
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <AppBar position="static" sx={{ bgcolor: '#000' }}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link color="inherit" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Image src={logo} alt="Logo" width={40} height={40} />
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', ml: 2 }}>
                  Humanize-AI.top
                </Typography>
              </Link>
            </NextLink>
            <Box sx={{ flexGrow: 1 }} />
            <NextLink href="/" passHref>
              <Link color="inherit" sx={{ mx: 2, color: '#fff' }}>
                Home
              </Link>
            </NextLink>
            <NextLink href="/about" passHref>
              <Link color="inherit" sx={{ mx: 2, color: '#fff' }}>
                About
              </Link>
            </NextLink>
            <NextLink href="/contact" passHref>
              <Link color="inherit" sx={{ mx: 2, color: '#fff' }}>
                Contact
              </Link>
            </NextLink>
            <NextLink href={isLoggedIn ? "/account" : "/login"} passHref>
              <Link color="inherit" sx={{ mx: 2, color: '#fff' }}>
                {isLoggedIn ? "Account" : "Login"}
              </Link>
            </NextLink>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <NextLink href="/history" passHref>
              <Link color="inherit" sx={{ mx: 2, color: '#fff' }}>
                History
              </Link>
            </NextLink>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
          {children}
        </Container>
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: '#000' }}>
          <Container maxWidth="lg">
            <Typography variant="body1" sx={{ color: '#fff' }}>
              My sticky footer can be found here.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: '#fff' }}>
              © 2023 Your Company. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}