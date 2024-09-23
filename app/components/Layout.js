'use client';

import { useState } from 'react';
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
import logo from '../../public/logo.svg'; // 引入 logo

export default function Layout({ children, params, t }) {
  const [mode, setMode] = useState('light');
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
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // 渐变背景
          backgroundAttachment: 'fixed', // 背景固定
        }}
      >
        <AppBar position="static" sx={{ bgcolor: '#000' }}> {/* 黑色背景 */}
          <Toolbar>
            <Image src={logo} alt="Logo" width={40} height={40} /> {/* 添加 logo */}
            <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', ml: 2 }}> {/* 白色文字 */}
              Humanize-AI.top
            </Typography>
            <Link href="/" color="inherit" sx={{ mx: 2, color: '#fff' }}> {/* 白色文字 */}
              Home
            </Link>
            <Link href="/about" color="inherit" sx={{ mx: 2, color: '#fff' }}> {/* 白色文字 */}
              About
            </Link>
            <Link href="/contact" color="inherit" sx={{ mx: 2, color: '#fff' }}> {/* 白色文字 */}
              Contact
            </Link>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
          {children}
        </Container>
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: '#000' }}> {/* 黑色背景 */}
          <Container maxWidth="lg">
            <Typography variant="body1" sx={{ color: '#fff' }}> {/* 白色文字 */}
              My sticky footer can be found here.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ color: '#fff' }}> {/* 白色文字 */}
              © 2023 Your Company. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}