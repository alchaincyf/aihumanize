// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Tooltip,
} from '@mui/material';
import Layout from './components/Layout';
import TextInput from './components/TextInput';
import TextOutput from './components/TextOutput';
import translations from './translations'; // 确保路径正确
// @ts-ignore
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // 使用 next/navigation 而不是 next/router

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

const styles = {
  Standard: 'Make the text more human-like and simple.',
  Academic: 'Make the text more academic and formal.',
  Simple: 'Make the text simpler and easier to understand.',
  Flowing: 'Make the text more flowing and natural.',
  Formal: 'Make the text more formal and polite.',
  Informal: 'Make the text more casual and conversational.',
  Expand: 'Expand the text with more details.',
  Shorten: 'Shorten the text, keeping core information.',
};

interface HomePageProps {
  params: {
    lang?: string;
  };
}

export default function HomePage({ params }: HomePageProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter(); // 使用 next/navigation 的 useRouter
  const t = (key: string) => {
    const lang = params?.lang || 'en';
    return (translations as Translations)[lang]?.[key] || key;
  };
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState('Standard');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleHumanize = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText, 
          userId: auth.currentUser?.uid, 
          style: style, // 修改这里，使用 style 而不是 selectedStyle
          messages: []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 && errorData.requireLogin) {
          router.push('/login?redirect=humanize');
          return;
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutputText(data.messages[0].content);
    } catch (error) {
      console.error('Error in handleHumanize:', error);
      setOutputText(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null; // 或者返回一个加载指示器
  }

  return (
    <Layout params={params} t={t}>
      <Box sx={{ textAlign: 'center', mb: 3 }}> {/* 调整 margin-bottom */}
        <Typography variant="h2">Humanize AI Text</Typography>
        <Typography variant="h6" color="text.secondary" fontWeight="light">
          Effortlessly convert AI-generated text from ChatGPT, Bard, Jasper, Grammarly, GPT4, and more into natural, human-like writing. Achieve 100% originality and bypass AI detection with the best Humanize AI tool.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}> {/* 调整 margin-bottom */}
        {Object.keys(styles).map((styleKey) => (
          <Tooltip key={styleKey} title={styles[styleKey as keyof typeof styles]}>
            <Box
              onClick={() => setStyle(styleKey)}
              sx={{
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: style === styleKey ? '#1976d2' : 'transparent',
                color: style === styleKey ? '#fff' : 'inherit',
                '&:hover': {
                  backgroundColor: style === styleKey ? '#1565c0' : '#f0f0f0',
                },
              }}
            >
              {styleKey}
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box
          sx={{
            flex: 1,
            border: 1,
            borderRadius: 1,
            p: 3,
            boxShadow: 3,
            bgcolor: 'var(--main-area-background)', // 使用新的背景色变量
            position: 'relative',
            height: '75vh', // 增加高度
            top: '-10px', // 向上移动10px
          }}
        >
          <TextInput
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
            t={t}
          />
          <Button
            onClick={handleHumanize}
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ position: 'absolute', bottom: 16, right: 16, backgroundColor: '#1976d2' }} // 更自然的按钮颜色
          >
            {t('humanize_button')}
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            border: 1,
            borderRadius: 1,
            p: 3,
            boxShadow: 3,
            bgcolor: 'var(--main-area-background)', // 使用新的背景色变量
            position: 'relative',
            height: '75vh', // 增加高度
            top: '-10px', // 向上移动10px
          }}
        >
          <TextOutput value={outputText} isLoading={isLoading} />
        </Box>
      </Box>
    </Layout>
  );
}