import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Obtenemos todas las notas de la lista 'love_notes'
    const notes = await kv.lrange('love_notes', 0, -1);
    return res.status(200).json(notes || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}