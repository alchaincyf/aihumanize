import { NextResponse } from 'next/server';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  const { text, userId } = await request.json();

  // 检查用户权限和使用量
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();

  if (!userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const now = new Date();
  const expiryDate = new Date(userData.planExpiryDate);

  if (now > expiryDate || userData.wordsUsed >= userData.wordsLimit) {
    return NextResponse.json({ error: 'Word limit exceeded or plan expired' }, { status: 403 });
  }

  // 处理 AI 请求
  // ... 你的 AI 处理逻辑 ...

  // 更新使用量
  const wordsUsed = userData.wordsUsed + text.split(' ').length;
  await updateDoc(userRef, { wordsUsed: wordsUsed });

  // 返回 AI 处理结果
  return NextResponse.json({ result: 'AI processed text' });
}