import CarouselItem from '../models/BestContent.js';
import { computeIframeUrl, detectProvider } from '../utils/embed.js';

export default class BestController {
  static async apiGetTests(req, res) {
    res.json('HOLA');
  }

  static async apiGetAll(req, res) {
    try {
      const items = await CarouselItem.find().sort({ position: 1 });
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener items del carrusel', details: err.message });
    }
  }

  // 👉 helper para adjuntar iframe en create/update
  static attachIframeFields(payload) {
    const data = { ...payload };

    // Si ya viene un iframeUrl explícito, solo detectamos provider
    if (data.iframeUrl) {
      data.embedProvider = detectProvider(data.iframeUrl);
      return data;
    }

    const { iframeUrl, provider } = computeIframeUrl({
      type: data.type,
      videoUrl: data.videoUrl,
      audioUrl: data.audioUrl,
      linkUrl: data.linkUrl,
    });

    data.iframeUrl = iframeUrl || null;
    data.embedProvider = provider || null;
    return data;
  }

  static async apiCreate(req, res) {
    try {
      const data = BestController.attachIframeFields(req.body);
      const item = new CarouselItem(data);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: 'Error al crear item', details: err.message });
    }
  }

  static async apiUpdate(req, res) {
    try {
      const { id } = req.params;
      const data = BestController.attachIframeFields(req.body);
      const updated = await CarouselItem.findByIdAndUpdate(id, data, { new: true });
      if (!updated) return res.status(404).json({ error: 'Item no encontrado' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: 'Error al actualizar item', details: err.message });
    }
  }

  static async apiDelete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await CarouselItem.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Item no encontrado' });
      res.status(200).json({ message: 'Item eliminado' });
    } catch (err) {
      res.status(400).json({ error: 'Error al eliminar item', details: err.message });
    }
  }

  static async apiGetById(req, res) {
    try {
      const { id } = req.params;
      const item = await CarouselItem.findById(id);
      if (!item) return res.status(404).json({ error: 'Item no encontrado' });
      res.status(200).json(item);
    } catch (err) {
      res.status(400).json({ error: 'Error al buscar item', details: err.message });
    }
  }

  // (Opcional) endpoint para recalcular iframes en masa
  static async apiRefreshEmbeds(req, res) {
    try {
      const items = await CarouselItem.find();
      const ops = await Promise.all(
        items.map(async (doc) => {
          const { iframeUrl, provider } = computeIframeUrl({
            type: doc.type,
            videoUrl: doc.videoUrl,
            audioUrl: doc.audioUrl,
            linkUrl: doc.linkUrl,
          });
          doc.iframeUrl = iframeUrl || null;
          doc.embedProvider = provider || null;
          return doc.save();
        })
      );
      res.status(200).json({ updated: ops.length });
    } catch (err) {
      res.status(500).json({ error: 'Error regenerando iframes', details: err.message });
    }
  }
}
