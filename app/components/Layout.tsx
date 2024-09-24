// @ts-nocheck

'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
  Container,
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
  PaletteMode,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import logo from '../../public/logo.svg';
import NextLink from 'next/link';
import { User } from 'firebase/auth';

interface LayoutProps {
  children: ReactNode;
  params?: {
    lang?: string;
  };
  t?: (key: string) => string;
}

export default function Layout({ children, params, t }: LayoutProps) {
  const [mode, setMode] = useState<PaletteMode>('light');
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
    const { auth } = require('../../firebaseConfig');
    const { onAuthStateChanged } = require('firebase/auth');
    
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
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
            <NextLink href="/" passHref legacyBehavior>
              <Button component="a" color="inherit" sx={{ textTransform: 'none' }}>
                <Image src={logo} alt="Logo" width={40} height={40} />
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', ml: 2 }}>
                  Humanize-AI.top
                </Typography>
              </Button>
            </NextLink>
            <Box sx={{ flexGrow: 1 }} />
            <NextLink href="/" passHref legacyBehavior>
              <Button component="a" color="inherit">Home</Button>
            </NextLink>
            <NextLink href="/pricing" passHref legacyBehavior>
              <Button component="a" color="inherit">Pricing</Button>
            </NextLink>
            <NextLink href="/history" passHref legacyBehavior>
              <Button component="a" color="inherit">History</Button>
            </NextLink>
            <NextLink href={isLoggedIn ? "/account" : "/login"} passHref legacyBehavior>
              <Button component="a" color="inherit">
                {isLoggedIn ? "Account" : "Login"}
              </Button>
            </NextLink>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
          {children}
        </Container>
        
        <Box component="footer" sx={{ py: 4, px: 2, mt: 'auto', bgcolor: '#000', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <NextLink href="/" passHref>
              <Box component="a" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                <Image src={logo} alt="Logo" width={40} height={40} />
                <Typography variant="h6" sx={{ ml: 2, color: '#fff' }}>
                  Humanize-AI.top
                </Typography>
              </Box>
            </NextLink>
            <Typography variant="body2" color="text.secondary" sx={{ color: '#fff' }}>
              © 2024 Humanize-AI.top. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}