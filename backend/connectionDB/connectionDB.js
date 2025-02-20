import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.setMaxListeners(15);

const connectdb = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        
        console.log("MongoDB connected successfully");
        
        // Monitor connection events
        mongoose.connection.on('connected', () => {
            console.log('Database connection established');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database connection lost, attempting reconnection...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Database reconnected successfully');
        });

    } catch (error) {
        console.log('Database connection error:', error.message);
        // Implement retry logic
        setTimeout(connectdb, 5000);
    }
}

export default connectdb;
