import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { categoryId, entry } = req.body;

    if (!categoryId || !entry) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const key = 'citas_v2';
    const stored = (await kv.get(key)) || {};

    if (!stored[categoryId]) stored[categoryId] = [];
    stored[categoryId].push(entry);

    await kv.set(key, stored);

    return res.status(200).json({ ok: true, data: stored });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}