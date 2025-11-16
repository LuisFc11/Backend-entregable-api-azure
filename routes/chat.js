// backend/routes/chat.js
import express from 'express';
import fetch from 'node-fetch'; // npm i node-fetch
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { contents } = req.body;

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'contents es requerido y debe ser un array' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta GEMINI_API_KEY en el .env' });
    }

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error de Gemini:', response.status, text);
      return res.status(500).json({ error: 'Error al consultar Gemini', detail: text });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error('Error en /api/chat:', err);
    return res.status(500).json({ error: 'Error interno en /api/chat' });
  }
});

export default router;
