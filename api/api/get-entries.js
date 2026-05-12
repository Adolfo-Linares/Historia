import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const stored = (await kv.get('citas_v2')) || {};
    return res.status(200).json(stored);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}