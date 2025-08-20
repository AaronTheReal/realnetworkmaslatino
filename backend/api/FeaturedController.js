// controllers/FeaturedPageController.js
import FeaturedPage from '../models/FeaturedShows.js'; // Ajusta el nombre del modelo si es necesario

class FeaturedPageController {
  // TEST
  async apiGetTests(req, res) {
    try {
      res.json({ success: true, message: 'Ruta de prueba para featured-pages funcionando' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE
  async apiCreate(req, res) {
    try {
      console.log("que paso??");
      const { title, subtitle, imageUrl, author, description, order } = req.body;

      const page = await FeaturedPage.create({
        title,
        subtitle,
        imageUrl,
        author,
        description,
        order: typeof order === 'number' ? order : 0,
      });

      return res.status(201).json(page);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error creating featured page', error: err.message });
    }
  }

  // READ ALL
  async apiGetAll(req, res) {
    try {
      const { page = 1, limit = 100, sort = 'order' } = req.query;

      const pages = await FeaturedPage.find({})
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

      const total = await FeaturedPage.countDocuments();

      return res.json({
        data: pages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching featured pages', error: err.message });
    }
  }

  // READ ONE
  async apiGetById(req, res) {
    try {
      const { id } = req.params;
      const page = await FeaturedPage.findById(id);

      if (!page) return res.status(404).json({ message: 'Featured page not found' });

      return res.json(page);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Invalid ID', error: err.message });
    }
  }

  // UPDATE
  async apiUpdate(req, res) {
    try {
      const { id } = req.params;
      const { title, subtitle, imageUrl, author, description, order } = req.body;

      const updated = await FeaturedPage.findByIdAndUpdate(
        id,
        { title, subtitle, imageUrl, author, description, order },
        { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ message: 'Featured page not found' });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error updating featured page', error: err.message });
    }
  }

  // DELETE
  async apiDelete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await FeaturedPage.findByIdAndDelete(id);

      if (!deleted) return res.status(404).json({ message: 'Featured page not found' });

      return res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error deleting featured page', error: err.message });
    }
  }

  /**
   * REORDER (bulk)
   * Espera un payload:
   * {
   *   "items": [
   *     { "id": "66a5...", "order": 0 },
   *     { "id": "66a6...", "order": 1 }
   *   ]
   * }
   */
  async apiReorder(req, res) {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'items array is required' });
      }

      const ops = items.map((it) => ({
        updateOne: {
          filter: { _id: it.id },
          update: { $set: { order: it.order } },
        },
      }));

      await FeaturedPage.bulkWrite(ops);

      const updatedList = await FeaturedPage.find({}).sort('order').lean();
      return res.json({ message: 'Order updated', data: updatedList });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error reordering featured pages', error: err.message });
    }
  }
}

const featuredPageController = new FeaturedPageController();
export default featuredPageController;