import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }),
            password: hashedPassword,
            authProvider: 'local'
        });
        
        const token = createToken(newUser);
        
        return res.status(201).json({
            success: true,
            token,
            user: newUser
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

      console.log('Incoming password:', password);
      console.log('Stored hash:', user.password);
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      if (user.authProvider === 'google') {
          return res.status(400).json({ message: 'Please use Google login' });
      }
      
      // In your login controller
      console.log('Login attempt with:', password)
      console.log('Stored hash:', user.password)


    const isValidPassword = await Promise.resolve(bcrypt.compare(password, user.password));
    console.log('Password match result:', isValidPassword);

      
      if (!isValidPassword) {
          return res.status(401).json({ message: 'Invalid password' });
      }
      
      const token = createToken(user);
      res.json({ token, user });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

