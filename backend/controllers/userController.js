import { User } from '../models/userModel.js'
import bcrypt from 'bcrypt'

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
            const isMatch = await user.comparePassword(currentPassword)
            
            if (!isMatch) {
                return res.json({ 
                    success: false, 
                    message: 'Current password is incorrect' 
                })
            }
            
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { ...updates, password: hashedPassword },
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

