// @ts-nocheck

import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});

const styles = {
  Standard: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it sound more human-like.

  ### Tone
  - Natural
  - Conversational
  - Emotionally engaging

  ### Instructions
  Please transform the user's AI-generated content to make it sound more like it was written by a human. Human writing typically includes:
  - Natural phrases and simple sentences.
  - Emotional and personal touches.
  - A conversational tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
  Academic: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it sound more academic.

  ### Tone
  - Formal
  - Professional
  - Scholarly

  ### Instructions
  Please transform the user's AI-generated content to make it sound more academic. Academic writing typically includes:
  - Formal phrases and complex sentences.
  - Professional and technical terminology.
  - A scholarly tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
  Simple: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it sound simpler and easier to understand.

  ### Tone
  - Clear
  - Concise
  - Accessible

  ### Instructions
  Please transform the user's AI-generated content to make it sound simpler and easier to understand. Simple writing typically includes:
  - Short phrases and common words.
  - Clear and straightforward language.
  - An accessible tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
  Flowing: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it sound more flowing and natural.

  ### Tone
  - Smooth
  - Natural
  - Coherent

  ### Instructions
  Please transform the user's AI-generated content to make it sound more flowing and natural. Flowing writing typically includes:
  - Smooth phrases and natural transitions.
  - Coherent and connected sentences.
  - A natural tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
  Formal: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it sound more formal.

  ### Tone
  - Polite
  - Respectful
  - Professional

  ### Instructions
  Please transform the user's AI-generated content to make it sound more formal. Formal writing typically includes:
  - Polite phrases and respectful language.
  - Professional and courteous expressions.
  - A formal tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
  Informal: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it sound more informal.

  ### Tone
  - Casual
  - Relaxed
  - Conversational

  ### Instructions
  Please transform the user's AI-generated content to make it sound more informal. Informal writing typically includes:
  - Casual phrases and relaxed language.
  - Conversational and friendly expressions.
  - An informal tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
  Expand: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it more detailed and comprehensive.

  ### Tone
  - Detailed
  - Elaborate
  - Informative

  ### Instructions
  Please transform the user's AI-generated content to make it more detailed and comprehensive. Expanded writing typically includes:
  - Detailed phrases and elaborate explanations.
  - Informative and thorough descriptions.
  - A detailed tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
  Shorten: `
  ### Role
  You are an AI assistant tasked with transforming AI-generated content to make it more concise.

  ### Tone
  - Concise
  - Clear
  - Direct

  ### Instructions
  Please transform the user's AI-generated content to make it more concise. Shortened writing typically includes:
  - Concise phrases and clear language.
  - Direct and to-the-point expressions.
  - A concise tone.
  - Clear and coherent structure.

  Ensure that after the transformation, only the revised content is returned without any additional explanations. Respond in the language used by the user.
  `,
}; // <-- 这里添加了右花括号

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

    return NextResponse.json({ messages: [aiResponse] }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Detailed error in /api/humanize:', error);
    console.error('Request body:', await request.text());
    console.error('Environment variables:', process.env);
    // 注意：不要在生产环境中记录敏感信息
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*', // 或者指定允许的域名
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
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

    return NextResponse.json({ messages: [aiResponse] }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in processAIRequest:', error);

    // Check if the error is a timeout
    if (error.message.includes('timeout')) {
      return NextResponse.json({ error: 'Request timed out. Please try again later.' }, { status: 504 });
    }

    // Check if the response is not JSON
    if (error.message.includes('Unexpected token')) {
      return NextResponse.json({ error: 'Invalid response from AI service. Please try again later.' }, { status: 502 });
    }

    throw error;
  }
}