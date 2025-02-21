import mongoose from 'mongoose';

const saleHeaderSchema = new mongoose.Schema({
    headerText: {
        type: String,
        required: true,
        trim: true
    },
    linkText: {
        type: String,
        required: true,
        trim: true
    },
    linkUrl: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SaleHeader = mongoose.model('saleHeader', saleHeaderSchema);
export default SaleHeader;
