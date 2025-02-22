import { User } from '../models/userModel.js'
import mongoose from 'mongoose';

// Fetch user profile(s)
export const getUsers = async (req, res) => {
    try {
        const { role, id } = req.user // From auth middleware
        
        // For admin - fetch all or specific user
        if (role === 'admin') {
            const { targetUserId } = req.query
            if (targetUserId) {
                const user = await User.findById(targetUserId).select('name email phone address authProvider')
                return res.json({ success: true, user })
            }
            const users = await User.find().select('name email phone address authProvider')
            return res.json({ success: true, users })
        }
        
        // For regular user - fetch own profile only
        const user = await User.findById(id).select('name email phone address authProvider')
        return res.json({ 
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                authProvider: user.authProvider
            }
        })
    } catch (error) {
        console.log('Profile fetch error:', error)
        res.status(500).json({ success: false, message: 'Error fetching profile data' })
    }
}

// Update user profile
export const updateUser = async (req, res) => {
    try {
        const { role, id } = req.user
        const { targetUserId } = req.params
        const { currentPassword, newPassword, ...updates } = req.body

        // Handle password change for regular users
        if (currentPassword && newPassword && !role) {
            const user = await User.findById(id)
            const isMatch = user.password === currentPassword;
            
            if (!isMatch) {
                return res.json({ 
                    success: false, 
                    message: 'Current password is incorrect' 
                })
            }
            
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { ...updates, password: newPassword },
                { new: true }
            ).select('name email phone address authProvider')
            
            return res.json({ success: true, user: updatedUser })
        }

        // Admin can update any user
        if (role === 'admin' && targetUserId) {
            const user = await User.findByIdAndUpdate(
                targetUserId, 
                updates, 
                { new: true }
            ).select('name email phone address authProvider')
            return res.json({ success: true, user })
        }

        // Regular users can only update themselves
        const user = await User.findByIdAndUpdate(
            id, 
            updates, 
            { new: true }
        ).select('name email phone address authProvider')
        return res.json({ success: true, user })

    } catch (error) {
        console.log('Profile update error:', error)
        res.status(500).json({ success: false, message: 'Error updating profile' })
    }
}


export const getCustomers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const status = req.query.status;
  
      const query = {
        authProvider: { $in: ['local', 'google'] }
      };
  
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
  
      const totalItems = await User.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
  
      const customers = await User.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'sales',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders'
          }
        },
        {
          $addFields: {
            totalOrders: { $size: '$orders' },
            totalSpent: {
              $sum: '$orders.totalAmount'
            },
            lastOrderDate: {
              $max: '$orders.createdAt'
            },
            isActive: {
              $cond: {
                if: { $gt: [{ $size: '$orders' }, 0] },
                then: true,
                else: false
              }
            }
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            phone: 1,
            totalOrders: 1,
            totalSpent: 1,
            lastOrderDate: 1,
            isActive: 1,
            createdAt: 1
          }
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $sort: { createdAt: -1 } }
      ]);
  
      res.status(200).json({
        customers,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getCustomerDetails = async (req, res) => {
    try {
      const customerId = req.params.id;
  
      const customerDetails = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(customerId) } },
        {
          $lookup: {
            from: 'sales',
            localField: '_id',
            foreignField: 'customer',
            as: 'orders',
            pipeline: [
              { $sort: { createdAt: -1 } },
              {
                $project: {
                  _id: 1,
                  totalAmount: 1,
                  orderStatus: 1,
                  createdAt: 1
                }
              }
            ]
          }
        },
        {
          $addFields: {
            totalOrders: { $size: '$orders' },
            totalSpent: { $sum: '$orders.totalAmount' },
            lastOrderDate: { $max: '$orders.createdAt' },
            activeStatus: {
              $cond: {
                if: { $gt: [{ $size: '$orders' }, 0] },
                then: 'Active',
                else: 'Inactive'
              }
            }
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            phone: 1,
            totalOrders: 1,
            totalSpent: 1,
            lastOrderDate: 1,
            orders: 1,
            createdAt: 1,
            activeStatus: 1
          }
        }
      ]);
  
      if (!customerDetails.length) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      res.status(200).json(customerDetails[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };  
  
