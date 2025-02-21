// controllers/categoryController.js
import Category from '../models/categoryModel.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const createCategory = async (req, res) => {
    try {
        const categoryData = {
            name: req.body.name,
            isSubcategory: req.body.isSubcategory || false,
            parent: req.body.parent || null
        };
        
        if (req.body.image) {
            categoryData.image = req.body.image;
        }
        
        const category = new Category(categoryData);
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.log('Creation error:', error);
        res.status(400).json({ message: error.message });
    }
};


export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Find the category and its subcategories
        const [category, subcategories] = await Promise.all([
            Category.findById(categoryId),
            Category.find({ parent: categoryId })
        ]);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete all subcategories first
        if (subcategories.length > 0) {
            await Category.deleteMany({ parent: categoryId });
        }

        // Delete the main category
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ 
            message: 'Category and all associated subcategories deleted successfully',
            deletedCount: subcategories.length + 1
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
