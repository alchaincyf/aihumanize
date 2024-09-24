// @ts-nocheck

'use client';

import { useState } from 'react';
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
  const t = (key: string) => {
    const lang = params?.lang || 'en';
    return (translations as Translations)[lang]?.[key] || key;
  };
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState('Standard');

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, messages, style }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages);
      setOutputText(data.messages[data.messages.length - 1].content);

      // 保存历史记录
      // @ts-ignore
      const user = auth.currentUser;
      if (user) {
        // @ts-ignore
        const historyRef = collection(db, 'users', user.uid, 'history');
        await addDoc(historyRef, {
          inputText,
          outputText: data.messages[data.messages.length - 1].content,
          style,
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // 可以在这里添加错误处理逻辑，比如显示错误消息给用户
    } finally {
      setIsLoading(false);
    }
  };

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
          {isLoading ? (
            <CircularProgress
              size={60}
              sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          ) : (
            <TextOutput value={outputText} />
          )}
        </Box>
      </Box>
    </Layout>
  );
}