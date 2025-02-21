// routes/categoryRoutes.js
import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/categories', getAllCategories);
router.get('/categories/get/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

export default router;