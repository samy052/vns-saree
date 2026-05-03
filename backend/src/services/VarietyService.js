const Variety = require('../models/Variety');
const Category = require('../models/Category');

class VarietyService {
  async getAllVarieties() {
    return await Variety.findAll({ include: Category });
  }

  async getVarietyById(id) {
    return await Variety.findByPk(id, { include: Category });
  }

  async createVariety(data) {
    return await Variety.create(data);
  }

  async updateVariety(id, data) {
    const variety = await Variety.findByPk(id);
    if (!variety) throw new Error('Variety not found');
    return await variety.update(data);
  }

  async deleteVariety(id) {
    const variety = await Variety.findByPk(id);
    if (!variety) throw new Error('Variety not found');
    return await variety.destroy();
  }
}

module.exports = new VarietyService();
