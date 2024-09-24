import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});

const styles = {
  Standard: '请将用户描述的内容改造得更像"人话"，使用短语，简单的语句，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
  Academic: '请将用户描述的内容改造得更学术化，使用正式的语句和专业术语，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
  Simple: '请将用户描述的内容改造得更简单易懂，使用简短的语句和常用词汇，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
  Flowing: '请将用户描述的内容改造得更流畅，使用连贯的语句和自然的过渡，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
  Formal: '请将用户描述的内容改造得更正式，使用正式的语句和礼貌的表达，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
  Informal: '请将用户描述的内容改造得更随意，使用口语化的表达和轻松的语气，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
  Expand: '请将用户描述的内容扩展得更详细，增加更多的细节和解释，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
  Shorten: '请将用户描述的内容缩短，保留核心信息并去掉不必要的细节，并且在用户输入后只返回改造后的内容，不做任何别的说明。',
};

export async function POST(request: Request) {
  try {
    const { text, userId, style, messages } = await request.json();
    console.log('Received request:', { text, userId, style });

    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount <= 200) {
      return await processAIRequest(text, style, messages);
    }

    if (!userId) {
      return NextResponse.json({ error: 'Login required for texts over 200 words', requireLogin: true }, { status: 401 });
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const subscriptionEndDate = new Date(userData.subscriptionEndDate);

    if (now > subscriptionEndDate || userData.subscriptionStatus !== 'active') {
      return NextResponse.json({ error: 'Subscription expired' }, { status: 403 });
    }

    if (userData.wordsUsed + wordCount > userData.wordsLimit) {
      return NextResponse.json({ error: 'Word limit exceeded' }, { status: 403 });
    }

    const aiResponse = await processAIRequest(text, style, messages);

    const newWordsUsed = userData.wordsUsed + wordCount;
    console.log('Updating wordsUsed:', { userId, newWordsUsed });

    await updateDoc(userRef, { wordsUsed: newWordsUsed });
    console.log('wordsUsed updated successfully');

    return aiResponse;
  } catch (error) {
    console.error('Detailed error in /api/humanize:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

async function processAIRequest(text: string, style: string, messages: any[]) {
  try {
    const systemMessage = {
      role: 'system',
      content: styles[style] || styles.Standard,
    };
    const newMessage = { role: 'user', content: text };
    const updatedMessages = [systemMessage, ...messages, newMessage];

    console.log('Sending request to DeepSeek API:', updatedMessages);

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: updatedMessages,
    });

    console.log('Received response from DeepSeek API:', response);

    const aiResponse = response.choices[0].message;

    return NextResponse.json({ messages: [aiResponse] });
  } catch (error) {
    console.error('Error in processAIRequest:', error);
    throw error;
  }
}