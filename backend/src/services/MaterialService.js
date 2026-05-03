const Material = require('../models/Material');

class MaterialService {
  async getAllMaterials() {
    return await Material.findAll();
  }

  async getMaterialById(id) {
    return await Material.findByPk(id);
  }

  async createMaterial(data) {
    return await Material.create(data);
  }

  async updateMaterial(id, data) {
    const material = await Material.findByPk(id);
    if (!material) throw new Error('Material not found');
    return await material.update(data);
  }

  async deleteMaterial(id) {
    const material = await Material.findByPk(id);
    if (!material) throw new Error('Material not found');
    return await material.destroy();
  }
}

module.exports = new MaterialService();
