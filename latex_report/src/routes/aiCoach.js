// src/routes/aiCoach.js
import express from 'express';

const router = express.Router();

/**
 * POST /api/ai-coach
 * Body: { prompt: string }
 * Returns: { answer: string }
 */
router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI error: ${response.status} ${err}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() ?? '';

    res.json({ answer });
  } catch (err) {
    console.error('AI coach error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
