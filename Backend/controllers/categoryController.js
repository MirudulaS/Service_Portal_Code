import Category from '../models/Category.js';


const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createCategory = async (req, res) => {
  try {
    const { name, department, description } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message: 'Category already exists'
      });
    }

    const category = await Category.create({
      name,
      department,
      description
    });

    res.status(201).json(category);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    category.name = req.body.name || category.name;
    category.department = req.body.department || category.department;

    category.description =
      req.body.description !== undefined
        ? req.body.description
        : category.description;

    category.isActive =
      req.body.isActive !== undefined
        ? req.body.isActive
        : category.isActive;

    const updated = await category.save();

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    await category.deleteOne();

    res.json({
      message: 'Category deleted'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};