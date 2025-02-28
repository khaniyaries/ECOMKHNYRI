import { User } from '../models/userModel.js'
import mongoose from 'mongoose';

// Fetch user profile(s)
export const getUsers = async (req, res) => {
  try {
    const { role, userId } = req.query // From auth middleware

    if (!role) {
      const user = await User.findById(userId).select('name email phone address authProvider')

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

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
    }

    // Admin flow 
    if (role === 'admin') {
      const { targetUserId } = req.query

      if (targetUserId) {
        const user = await User.findById(targetUserId).select('name email phone address authProvider')
        return res.json({ success: true, user })
      }

      const users = await User.find().select('name email phone address authProvider')
      return res.json({ success: true, users })
    }

  } catch (error) {
    console.log('Profile fetch error:', error)
    res.status(500).json({ success: false, message: 'Error fetching profile data' })
  }
}

// Update user profile
export const updateUser = async (req, res) => {
  console.log("request came");
  try {
    const { role, userId } = req.query
    const { targetUserId } = req.params
    const { currentPassword, newPassword, ...updates } = req.body

    console.log('Update data:', {
      role,
      userId,
      targetUserId,
      updates
    })

    // Handle password change for regular users
    if (currentPassword && newPassword && !role) {
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: 'Cannot update password for this account type'
        })
      }

      const isMatch = user.password === currentPassword

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...updates, password: newPassword },
        { new: true }
      ).select('name email phone address authProvider')

      return res.json({
        success: true,
        message: 'Profile updated successfully with new password',
        user: updatedUser
      })
    }

    // Admin can update any user
    if (role === 'admin' && targetUserId) {
      const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        updates,
        { new: true }
      ).select('name email phone address authProvider')

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Target user not found'
        })
      }

      return res.json({
        success: true,
        message: 'User updated by admin successfully',
        user: updatedUser
      })
    }

    // Regular users can only update themselves
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('name email phone address authProvider')

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.log('Profile update error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    })
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

  export const deleteCustomer = async (req, res) => {
    try {
      const { role } = req.query
      const { id } = req.params
  
      if (role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Only admins can delete customers' 
        })
      }
  
      const deletedUser = await User.findByIdAndDelete(id)
  
      if (!deletedUser) {
        return res.status(404).json({ 
          success: false, 
          message: 'Customer not found' 
        })
      }
  
      res.json({ 
        success: true, 
        message: 'Customer deleted successfully' 
      })
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting customer',
        error: error.message 
      })
    }
  }
  
  
