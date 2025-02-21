import SaleHeader from '../models/saleHeaderModel.js';

export const getCurrentSaleHeader = async (req, res) => {
    try {
        const saleHeader = await SaleHeader.findOne({ isActive: true });
        res.status(200).json(saleHeader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSaleHeader = async (req, res) => {
    try {
        const { headerText, linkText, linkUrl } = req.body;
        
        // Deactivate all existing headers
        await SaleHeader.updateMany({}, { isActive: false });
        
        // Create new active header
        const newHeader = await SaleHeader.create({
            headerText,
            linkText,
            linkUrl,
            isActive: true
        });

        res.status(200).json(newHeader);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInactive = async (req, res) => {
    try {
        const headers = await SaleHeader.find({ isActive: false });
        res.json(headers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const setActive = async (req, res) => {
    try {
        await SaleHeader.updateMany({}, { isActive: false });
        await SaleHeader.findByIdAndUpdate(req.params.id, { isActive: true });
        res.json({ message: 'Header activated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteHeader = async (req, res) => {
    try {
        await SaleHeader.findByIdAndDelete(req.params.id);
        res.json({ message: 'Header deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

