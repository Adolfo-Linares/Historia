import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { text, date } = req.body;
    // Guardamos la nueva nota al inicio de la lista
    await kv.lpush('love_notes', { text, date });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}