import { kv } from '@vercel/kv';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { categoryId, index } = req.body;

    if (!categoryId || index === undefined) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const stored = (await kv.get('citas_v2')) || {};
    const entries = stored[categoryId] || [];

    const entry = entries[index];

    if (!entry) {
      return res.status(404).json({ error: 'Recuerdo no encontrado' });
    }

    if (entry.public_id) {
      await cloudinary.uploader.destroy(entry.public_id);
    }

    entries.splice(index, 1);
    stored[categoryId] = entries;

    await kv.set('citas_v2', stored);

    return res.status(200).json({
      ok: true,
      data: stored
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}