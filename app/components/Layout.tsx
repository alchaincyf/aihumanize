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
  Link,
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
          fontFamily: 'var(--font-roboto)',
        }}
      >
        <AppBar position="static" sx={{ bgcolor: '#000' }}>
          <Toolbar>
            <NextLink href="/" passHref legacyBehavior>
              <Button component="a" color="inherit" sx={{ textTransform: 'none' }}>
                <Image src={logo} alt="Logo" width={40} height={40} />
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', ml: 2, fontFamily: 'var(--font-playfair-display)' }}>
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
        
        <Box component="footer" sx={{ 
          py: 4, 
          px: 2, 
          mt: 'auto', 
          bgcolor: '#000', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center'
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: { xs: 3, md: 0 }
            }}>
              {/* 左侧: 网站图标、名称和 slogan */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'center', md: 'flex-start' }
              }}>
                <NextLink href="/" passHref>
                  <Box component="a" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    textDecoration: 'none', 
                    color: 'white', 
                    mb: 1
                  }}>
                    <Image src={logo} alt="Logo" width={40} height={40} />
                    <Typography variant="h6" sx={{ 
                      ml: 2, 
                      color: '#fff', 
                      fontFamily: 'var(--font-playfair-display)'
                    }}>
                      Humanize-AI.top
                    </Typography>
                  </Box>
                </NextLink>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  color: '#fff', 
                  fontFamily: 'var(--font-montserrat)', 
                  textAlign: { xs: 'center', md: 'left' }
                }}>
                  Humanize AI: Free Humanize AI Text & AI Humanizer Online
                </Typography>
              </Box>

              {/* 右侧: 联系方式、友情链接和版权信息 */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: { xs: 'center', md: 'flex-end' },
                gap: 1
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  color: '#fff', 
                  fontFamily: 'var(--font-montserrat)'
                }}>
                  Contact: <Link href="mailto:alchaincyf@gmail.com" color="inherit">alchaincyf@gmail.com</Link>
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap', 
                  gap: 2
                }}>
                  <Link href="https://www.img2046.com/" target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', fontFamily: 'var(--font-montserrat)' }}>
                    img2046.com
                  </Link>
                  <Link href="https://www.coderwithai.top/" target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', fontFamily: 'var(--font-montserrat)' }}>
                    coderwithai.top
                  </Link>
                  <Link href="https://www.bookai.top/" target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', fontFamily: 'var(--font-montserrat)' }}>
                    bookai.top
                  </Link>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  color: '#fff', 
                  fontFamily: 'var(--font-montserrat)',
                  textAlign: { xs: 'center', md: 'right' }
                }}>
                  © 2024 Humanize-AI.top. All rights reserved.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}