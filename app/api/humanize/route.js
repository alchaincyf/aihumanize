import { NextResponse } from 'next/server';
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

export async function POST(request) {
  try {
    const { text, messages, style } = await request.json();
    const systemMessage = {
      role: 'system',
      content: styles[style] || styles.Standard,
    };
    const newMessage = { role: 'user', content: text };
    const updatedMessages = [systemMessage, ...messages, newMessage];

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: updatedMessages,
    });

    const aiResponse = response.choices[0].message;

    return NextResponse.json({ messages: [aiResponse] });
  } catch (error) {
    console.error('Error in humanize API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}