// frontend/src/api/ziibot-reply.ts
import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const ziibotReply = async (req: Request, res: Response) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'No comment provided' });
    }

    const prompt = `Reply as ZiiBot, the friendly, cheeky assistant on a social media platform. Respond to this comment: "${comment}"`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const reply = response.data.choices[0]?.message?.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('ZiiBot error:', error);
    res.status(500).json({ error: 'Failed to generate reply' });
  }
};
