const MaterialService = require('../services/MaterialService');

class MaterialController {
  async getAll(req, res) {
    try {
      const materials = await MaterialService.getAllMaterials();
      res.status(200).json(materials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const material = await MaterialService.getMaterialById(req.params.id);
      if (!material) return res.status(404).json({ message: 'Material not found' });
      res.status(200).json(material);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const material = await MaterialService.createMaterial(req.body);
      res.status(201).json(material);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const material = await MaterialService.updateMaterial(req.params.id, req.body);
      res.status(200).json(material);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await MaterialService.deleteMaterial(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new MaterialController();
