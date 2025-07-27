// controllers/BestController.js
import CarouselItem from '../models/BestContent.js';

export default class BestController {
  static async apiGetTests(req, res, next) {
    res.json("HOLA");
  }

  static async apiGetAll(req, res) {
    try {
      const items = await CarouselItem.find().sort({ position: 1 });
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener items del carrusel', details: err.message });
    }
  }

  static async apiCreate(req, res) {
    try {
      const item = new CarouselItem(req.body);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: 'Error al crear item', details: err.message });
    }
  }

  static async apiUpdate(req, res) {
    try {
      const { id } = req.params;
      const updated = await CarouselItem.findByIdAndUpdate(id, req.body, { new: true });
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
}
