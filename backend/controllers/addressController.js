import { Address } from '../models/addressModel.js';

export const addressController = {
    getAddresses: async (req, res) => {
      try {
        const { userId } = req.query;
        const addresses = await Address.find({ userId });
        res.json(addresses);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    createAddress: async (req, res) => {
      try {
        const { userId, name, fullName, phone, address, locality, city, state, pinCode } = req.body;
        
        const addressCount = await Address.countDocuments({ userId });
        const isDefault = addressCount === 0;
  
        const newAddress = new Address({
          userId,
          name,
          fullName,
          phone,
          address,
          locality,
          city,
          state,
          pinCode,
          isDefault
        });
  
        await newAddress.save();
        res.status(201).json(newAddress);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
  
    updateAddress: async (req, res) => {
      try {
        const { userId } = req.body;
        const updatedAddress = await Address.findOneAndUpdate(
          { _id: req.params.id, userId },
          req.body,
          { new: true }
        );
        res.json(updatedAddress);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
  
    deleteAddress: async (req, res) => {
      try {
        const { userId } = req.query;
        const address = await Address.findOneAndDelete({
          _id: req.params.id,
          userId
        });
        res.json({ message: 'Address deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    setDefaultAddress: async (req, res) => {
      try {
        const { userId } = req.body;
        await Address.updateMany(
          { userId },
          { isDefault: false }
        );
  
        const address = await Address.findOneAndUpdate(
          { _id: req.params.id, userId },
          { isDefault: true },
          { new: true }
        );
  
        res.json(address);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  };
  
