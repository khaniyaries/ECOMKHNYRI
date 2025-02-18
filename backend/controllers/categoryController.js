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
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
