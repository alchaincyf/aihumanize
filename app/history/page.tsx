'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import Layout from '../components/Layout';

interface HistoryItem {
  id: string;
  inputText: string;
  outputText: string;
  timestamp: Date;
  style: string;
}

export default function HistoryPage() {
  const [user, setUser] = useState(null);
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
        <Typography variant="h4" sx={{ mb: 2 }}>Your History</Typography>
        <List>
          {historyItems.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && <Divider />}
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`Style: ${item.style}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Input: {item.inputText}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.primary">
                        Output: {item.outputText}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Date: {item.timestamp.toDate().toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Box>
    </Layout>
  );
}