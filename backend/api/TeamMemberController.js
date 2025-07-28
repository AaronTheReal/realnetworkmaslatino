// controllers/TeamController.js
import TeamMember from '../models/TeamMember.js';

class teamController {
  // Simple ping
  async apiGetTests(req, res) {
    res.json('HOLA');
  }

  // CREATE
  async apiCreate(req, res) {
    try {
      const { name, position, imageUrl, order } = req.body;

      const member = await TeamMember.create({
        name,
        position,
        imageUrl,
        order: typeof order === 'number' ? order : 0,
      });

      return res.status(201).json(member);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error creating team member', error: err.message });
    }
  }

  // READ ALL (optional: filtros, paginación)
  async apiGetAll(req, res) {

    try {
      const { page = 1, limit = 100, sort = 'order' } = req.query;

      const members = await TeamMember.find({})
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

      const total = await TeamMember.countDocuments();

      console.log("members", members);
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
      return res.status(500).json({ message: 'Error fetching team members', error: err.message });
    }
  }

  // READ ONE
  async apiGetById(req, res) {
    try {
      const { id } = req.params;
      const member = await TeamMember.findById(id);

      if (!member) return res.status(404).json({ message: 'Team member not found' });

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
      const { name, position, imageUrl, order } = req.body;

      const updated = await TeamMember.findByIdAndUpdate(
        id,
        { name, position, imageUrl, order },
        { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ message: 'Team member not found' });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error updating team member', error: err.message });
    }
  }

  // DELETE
  async apiDelete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TeamMember.findByIdAndDelete(id);

      if (!deleted) return res.status(404).json({ message: 'Team member not found' });

      return res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error deleting team member', error: err.message });
    }
  }

  /**
   * REORDER (bulk)
   * Espera un payload:
   * {
   *   "items": [
   *     { "id": "66a5...", "order": 0 },
   *     { "id": "66a6...", "order": 1 },
   *     ...
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

      await TeamMember.bulkWrite(ops);

      const updatedList = await TeamMember.find({}).sort('order').lean();
      return res.json({ message: 'Order updated', data: updatedList });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error reordering team members', error: err.message });
    }
  }
}

const TeamController = new teamController();
export default TeamController;
