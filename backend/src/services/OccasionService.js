const Occasion = require('../models/Occasion');

class OccasionService {
  async getAllOccasions() {
    return await Occasion.findAll({
      order: [['name', 'ASC']]
    });
  }

  async getOccasionById(id) {
    return await Occasion.findByPk(id);
  }

  async getOccasionBySlug(slug) {
    return await Occasion.findOne({ where: { slug } });
  }

  async createOccasion(data) {
    // Auto-generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    return await Occasion.create(data);
  }

  async updateOccasion(id, data) {
    const occasion = await Occasion.findByPk(id);
    if (!occasion) throw new Error('Occasion not found');
    
    // Auto-generate slug if name changed but slug not provided
    if (data.name && !data.slug && data.name !== occasion.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    return await occasion.update(data);
  }

  async deleteOccasion(id) {
    const occasion = await Occasion.findByPk(id);
    if (!occasion) throw new Error('Occasion not found');
    return await occasion.destroy();
  }
}

module.exports = new OccasionService();
