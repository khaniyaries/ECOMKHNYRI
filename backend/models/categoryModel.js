// models/categoryModel.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        url: {
            type: String,
            required: true,
        }
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isSubcategory: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
categorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Category = mongoose.model('categories', categorySchema);
export default Category;