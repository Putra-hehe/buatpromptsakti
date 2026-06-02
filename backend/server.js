import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running (Groq)' });
});

app.post('/api/generate-prompt', async (req, res) => {
  const { userInput, category, tone } = req.body;

  if (!userInput?.trim()) {
    return res.status(400).json({ success: false, error: 'Input tidak boleh kosong' });
  }

  const finalCategory = category || 'Umum';
  const finalTone = tone || 'Netral';

  if (!process.env.GROQ_API_KEY) {
    return res.json({
      success: true,
      prompt: `Buatkan konten yang ${finalTone.toLowerCase()} untuk ${finalCategory.toLowerCase()}:\n\n"${userInput}"`,
      isFromAI: false,
      note: 'GROQ_API_KEY belum diatur'
    });
  }

  const systemPrompt = `Kamu adalah ahli prompt engineering terbaik di Indonesia. Buat prompt yang sangat detail, powerful, dan siap pakai. Jawab HANYA dengan prompt-nya saja.`;

  const userMessage = `Request: "${userInput}"\nKategori: ${finalCategory}\nTone: ${finalTone}\n\nBuatkan prompt terbaik sesuai permintaan di atas.`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',     // ← Model terbaru yang aktif
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 900
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const prompt = response.data.choices[0].message.content.trim();

    return res.json({
      success: true,
      prompt,
      isFromAI: true
    });

  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);

    const fallback = `Buatkan konten yang ${finalTone.toLowerCase()} untuk ${finalCategory.toLowerCase()}:\n\n"${userInput}"`;

    return res.json({
      success: true,
      prompt: fallback,
      isFromAI: false,
      note: 'Gagal terhubung ke Groq'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT} (Groq + llama-3.3-70b)`);
});