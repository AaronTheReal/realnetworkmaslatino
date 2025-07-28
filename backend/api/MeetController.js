// controllers/VoiceController.js
import VoiceMember from '../models/MeetOur.js';

class voiceController {
  // Ping
  async apiGetTests(_req, res) {
    res.json('VOICES OK');
  }

  // CREATE
  async apiCreate(req, res) {
    try {
      const {
        name,
        role,
        imageUrl,
        bio,
        order = 0,
        isActive = true,
        tags = [],
        socials = {},
      } = req.body;

      const created = await VoiceMember.create({
        name,
        role,
        imageUrl,
        bio,
        order,
        isActive,
        tags,
        socials,
      });

      return res.status(201).json(created);
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: 'Error creating voice member', error: err.message });
    }
  }

  // READ ALL (con paginación opcional)
  async apiGetAll(req, res) {
    try {
      const {
        page = 1,
        limit = 100,
        sort = 'order',
        isActive, // opcional para filtrar activos
      } = req.query;

      const filter = {};
      if (typeof isActive !== 'undefined') {
        filter.isActive = isActive === 'true';
      }

      const members = await VoiceMember.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

      const total = await VoiceMember.countDocuments(filter);

      return res.json({
        data: members,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: 'Error fetching voice members', error: err.message });
    }
  }

  // READ ONE
  async apiGetById(req, res) {
    try {
      const { id } = req.params;
      const member = await VoiceMember.findById(id);

      if (!member) return res.status(404).json({ message: 'Voice member not found' });

      return res.json(member);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Invalid ID', error: err.message });
    }
  }

  // UPDATE
  async apiUpdate(req, res) {
    try {
      const { id } = req.params;

      const updated = await VoiceMember.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) return res.status(404).json({ message: 'Voice member not found' });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: 'Error updating voice member', error: err.message });
    }
  }

  // DELETE
  async apiDelete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await VoiceMember.findByIdAndDelete(id);

      if (!deleted) return res.status(404).json({ message: 'Voice member not found' });

      return res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: 'Error deleting voice member', error: err.message });
    }
  }

  /**
   * REORDER (bulk)
   * Body:
   * {
   *   "items": [
   *     { "id": "xxx", "order": 0 },
   *     { "id": "yyy", "order": 1 }
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

      await VoiceMember.bulkWrite(ops);

      const updatedList = await VoiceMember.find({}).sort('order').lean();
      return res.json({ message: 'Order updated', data: updatedList });
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: 'Error reordering voice members', error: err.message });
    }
  }
}

const VoiceController = new voiceController();
export default VoiceController;
