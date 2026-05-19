const Variety = require('../models/Variety');
const Category = require('../models/Category');
const { Op } = require("sequelize");

const getCategoryAliases = (category) => {
  if (!category) return [];

  const normalized = String(category).trim().toLowerCase();
  if (!normalized) return [];

  const aliases = new Set([normalized]);
  aliases.add(normalized.replace(/-/g, " "));
  aliases.add(normalized.replace(/\s+/g, "-"));

  return [...aliases];
};

class VarietyService {
  async getAllVarieties(filters = {}) {
    const categoryAliases = getCategoryAliases(filters.category);
    const categoryInclude = {
      model: Category,
      required: categoryAliases.length > 0,
    };

    if (categoryAliases.length > 0) {
      categoryInclude.where = {
        [Op.or]: [
          { slug: { [Op.in]: categoryAliases } },
          { name: { [Op.in]: categoryAliases } },
        ],
      };
    }

    return await Variety.findAll({
      include: categoryInclude,
      order: [["name", "ASC"]],
    });
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
