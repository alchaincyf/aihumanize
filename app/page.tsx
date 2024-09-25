// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import Layout from './components/Layout';
import TextInput from './components/TextInput';
import TextOutput from './components/TextOutput';
import translations from './translations'; // 确保路径正确
// @ts-ignore
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Script from 'next/script'

// 移除 metadata 相关的代码

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

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');

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
          style: style,
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
      const outputText = data.messages[0].content;
      setOutputText(outputText);

      // 保存历史记录
      if (auth.currentUser) {
        const historyRef = collection(db, 'users', auth.currentUser.uid, 'history');
        await addDoc(historyRef, {
          inputText,
          outputText,
          style,
          inputWordCount: inputText.split(/\s+/).length,
          timestamp: serverTimestamp(),
        });
      }
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
    <>
      <Layout params={params} t={t}>
        <Box sx={{ textAlign: 'center', mb: isMobile ? 2 : 3 }}>
          <Typography variant={isMobile ? "h4" : "h2"} sx={{ fontFamily: 'var(--font-playfair-display)', fontWeight: 700 }}>
            Humanize AI Text
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary" sx={{ fontFamily: 'var(--font-montserrat)', fontWeight: 400 }}>
            Effortlessly convert AI-generated text from ChatGPT, Bard, Jasper, Grammarly, GPT4, and more into natural, human-like writing. Achieve 100% originality and bypass AI detection with the best Humanize AI tool.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: isMobile ? 2 : 3 }}>
          {Object.keys(styles).map((styleKey) => (
            <Tooltip key={styleKey} title={styles[styleKey as keyof typeof styles]}>
              <Box
                onClick={() => setStyle(styleKey)}
                sx={{
                  padding: isMobile ? '4px 8px' : '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: style === styleKey ? '#1976d2' : 'transparent',
                  color: style === styleKey ? '#fff' : 'inherit',
                  '&:hover': {
                    backgroundColor: style === styleKey ? '#1565c0' : '#f0f0f0',
                  },
                  fontSize: isMobile ? '0.8rem' : '1rem',
                  fontFamily: 'var(--font-roboto)',
                  fontWeight: 400,
                }}
              >
                {styleKey}
              </Box>
            </Tooltip>
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <Box
            sx={{
              flex: 1,
              border: 1,
              borderRadius: 1,
              p: 2,
              boxShadow: 3,
              bgcolor: 'var(--main-area-background)',
              position: 'relative',
              height: isMobile ? '50vh' : '75vh',
              top: isMobile ? 0 : '-10px',
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
              sx={{ 
                position: 'absolute', 
                bottom: 16, 
                right: 16, 
                backgroundColor: '#1976d2',
                fontSize: isMobile ? '0.8rem' : '1rem',
              }}
            >
              {t('humanize_button')}
            </Button>
          </Box>
          <Box
            sx={{
              flex: 1,
              border: 1,
              borderRadius: 1,
              p: 2,
              boxShadow: 3,
              bgcolor: 'var(--main-area-background)',
              position: 'relative',
              height: isMobile ? '50vh' : '75vh',
              top: isMobile ? 0 : '-10px',
            }}
          >
            <TextOutput value={outputText} isLoading={isLoading} />
          </Box>
        </Box>
      </Layout>
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Humanize AI Text",
            "description": "Convert AI-generated text into natural, human-like writing.",
            "url": "https://humanize-ai.top",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        `}
      </Script>
    </>
  );
}