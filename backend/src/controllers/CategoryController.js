const CategoryService = require('../services/CategoryService');

class CategoryController {
  async getAll(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
