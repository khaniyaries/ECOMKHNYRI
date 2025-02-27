import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { generateOTP, isOTPExpired } from '../utils/otp.js'
import { emailService } from './emailService.js'

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const googleSignup = async (req, res) => {
  const { email, name, photo } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = createToken(existingUser);
      return res.json({ token, user: existingUser });
    }

    const newUser = await User.create({
      email,
      name,
      photo,
      authProvider: 'google'
    });

    const token = createToken(newUser);
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, emailOrPhone, password } = req.body;

  try {
    const isEmail = emailOrPhone.includes('@');
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const otp = generateOTP();

    const newUser = await User.create({
      name,
      ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }),
      password: password,
      authProvider: 'local',
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
      }
    });

    if (isEmail) {
      await emailService.sendOTPEmail(emailOrPhone, otp);
    }

    const token = createToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: newUser,
      message: 'Please verify your email to complete registration'
    });
  } catch (error) {
    console.log('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
};



export const loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const isEmail = emailOrPhone.includes('@');
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Incoming password:', password);
    console.log('Stored hash:', user.password);


    if (user.authProvider === 'google') {
      return res.status(400).json({ message: 'Please use Google login' });
    }

    // In your login controller
    console.log('Login attempt with:', password)
    console.log('Stored hash:', user.password)


    const isValidPassword = user.password === password;

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!user.isVerified) {
      // Check if there's a valid existing OTP
      if (user.otp && !isOTPExpired(user.otp.expiresAt)) {
        // Resend the same OTP details
        if (isEmail) {
          await emailService.sendOTPEmail(user.email, user.otp.code);
        }
      } else {
        // Generate new OTP only if no valid OTP exists
        const otp = generateOTP();
        user.otp = {
          code: otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };
        await user.save();

        if (isEmail) {
          await emailService.sendOTPEmail(user.email, otp);
        }
      }

      return res.status(403).json({
        message: 'Please verify your email first',
        userId: user._id,
        requiresVerification: true
      });
    }

    const token = createToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp, userId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    if (!user.otp || isOTPExpired(user.otp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired' })
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    user.isVerified = true
    user.otp = undefined
    await user.save()

    const token = createToken(user)

    res.json({ 
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const resendOTP = async (req, res) => {
  const { userId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    // Check if current OTP is still valid
    if (user.otp && !isOTPExpired(user.otp.expiresAt)) {
      return res.json({ 
        message: 'Current OTP is still valid. Please check your email.',
        validUntil: user.otp.expiresAt
      })
    }

    // Generate new OTP only if current one is expired or doesn't exist
    const otp = generateOTP()
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }
    await user.save()

    await emailService.sendOTPEmail(user.email, otp)

    res.json({ message: 'New OTP sent successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const otp = generateOTP()
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    }
    await user.save()

    await emailService.sendPasswordResetOTP(email, otp)

    res.json({
      message: 'OTP sent successfully',
      userId: user._id
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyForgotPasswordOTP = async (req, res) => {
  const { otp, userId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.otp || isOTPExpired(user.otp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired' })
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    // Generate a temporary reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    )

    // Clear OTP and save reset token
    user.otp = undefined
    user.passwordResetToken = resetToken
    await user.save()

    res.json({ 
      message: 'OTP verified successfully',
      resetToken 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  const { userId, newPassword, resetToken } = req.body

  try {
    const user = await User.findById(userId)
    if (!user || user.passwordResetToken !== resetToken) {
      return res.status(401).json({ message: 'Invalid reset request' })
    }

    user.password = newPassword
    user.passwordResetToken = undefined
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const resendForgotPasswordOTP = async (req, res) => {
  const { userId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.otp && !isOTPExpired(user.otp.expiresAt)) {
      return res.json({
        message: 'Current OTP is still valid',
        validUntil: user.otp.expiresAt
      })
    }

    const otp = generateOTP()
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
    await user.save()

    await emailService.sendPasswordResetOTP(user.email, otp)

    res.json({ message: 'New OTP sent successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
