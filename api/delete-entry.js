import { kv } from "@vercel/kv";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { id } = req.body;

    const entries = await kv.get("entries") || [];

    const entry = entries.find(e => e.id === id);

    if (!entry) {
      return res.status(404).json({ error: "Entrada no encontrada" });
    }

    // borrar imagen de cloudinary
    if (entry.public_id) {
      await cloudinary.uploader.destroy(entry.public_id);
    }

    // borrar de la BD
    const nuevas = entries.filter(e => e.id !== id);

    await kv.set("entries", nuevas);

    res.status(200).json({
      success: true
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}