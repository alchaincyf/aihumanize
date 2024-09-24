// @ts-nocheck


import { NextResponse } from 'next/server';
import { db } from '../../../../firebaseConfig';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function GET(req: Request) {
  // 添加一个简单的授权检查
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const usersRef = collection(db, 'users');
    const activeSubscriptionsQuery = query(usersRef, where('subscriptionStatus', '==', 'active'));
    const querySnapshot = await getDocs(activeSubscriptionsQuery);

    const now = new Date();
    const resetPromises = querySnapshot.docs.map(async (doc) => {
      const userData = doc.data();
      const lastResetDate = new Date(userData.lastWordsResetDate);
      const monthsSinceLastReset = (now.getMonth() - lastResetDate.getMonth()) + 
        (12 * (now.getFullYear() - lastResetDate.getFullYear()));

      if (monthsSinceLastReset >= 1) {
        await updateDoc(doc.ref, {
          wordsUsed: 0,
          lastWordsResetDate: now.toISOString(),
        });
        console.log(`Reset words for user ${doc.id}`);
      }
    });

    await Promise.all(resetPromises);

    return NextResponse.json({ success: true, message: 'Words reset completed' });
  } catch (error) {
    console.error('Error resetting words:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}