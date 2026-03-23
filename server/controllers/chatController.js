const { HfInference } = require('@huggingface/inference');

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{role, content}> }
 */
const chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const HF_API_KEY = process.env.HF_API_KEY;
  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'Hugging Face API key not configured on server.' });
  }

  // Initialize the HF Client which automatically handles correct routing and retries
  const hf = new HfInference(HF_API_KEY);

  // Format the conversation for the chat model
  const chatMessages = [
    {
      role: 'system',
      content:
        'You are an expert AI tutor for a Learning Management System. Help students understand concepts clearly, step-by-step. Keep answers friendly, helpful, and readable.',
    },
    ...history.slice(-5), // keep recent context
    { role: 'user', content: message.trim() },
  ];

  try {
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-7B-Instruct', // Much smaller & faster free-tier model
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      response.choices[0]?.message?.content?.trim() ||
      'Sorry, I could not generate a response. Please try again.';

    return res.json({ reply });
  } catch (err) {
    console.error('HF API Error:', err.message);

    if (err.message.includes('401')) {
      return res.status(401).json({ error: 'Invalid Hugging Face API key. Check .env' });
    }
    if (err.message.toLowerCase().includes('rate limit') || err.message.includes('429')) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment.' });
    }
    if (err.message.toLowerCase().includes('loading') || err.message.includes('503')) {
      return res.status(503).json({
        error: 'The AI model is loading, please wait ~20 seconds and try again.',
      });
    }

    return res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
};

module.exports = { chat };
