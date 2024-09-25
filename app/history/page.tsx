// @ts-nocheck

'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import Layout from '../components/Layout';

interface HistoryItem {
  id: string;
  inputText: string;
  outputText: string;
  timestamp: Timestamp;
  style: string;
  inputWordCount: number;
  outputWordCount: number;
  wordsUsed: number;
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchHistory(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchHistory = async (userId: string) => {
    const historyRef = collection(db, 'users', userId, 'history');
    const q = query(historyRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const items: HistoryItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as HistoryItem);
    });
    setHistoryItems(items);
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontFamily: 'var(--font-playfair-display)' }}>Your History</Typography>
        <List>
          {historyItems.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && <Divider />}
              <ListItem alignItems="flex-start">
                <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontFamily: 'var(--font-montserrat)' }}>
                    Style: {item.style}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'var(--font-roboto)' }}>
                    Input Word Count: {item.inputWordCount}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'var(--font-roboto)' }}>
                    Output Word Count: {item.outputWordCount}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'var(--font-roboto)' }}>
                    Words Used: {item.wordsUsed}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'var(--font-roboto)' }}>
                    Date: {item.timestamp.toDate().toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontFamily: 'var(--font-roboto)' }}>
                    Input: {item.inputText}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'var(--font-roboto)' }}>
                    Output: {item.outputText}
                  </Typography>
                </Paper>
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Box>
    </Layout>
  );
}