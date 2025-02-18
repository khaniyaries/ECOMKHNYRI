import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connection.setMaxListeners(15);

const connectdb = async (dbName) => {
    try {
        const mongoURL = `${MONGODB_URL}/${dbName}`;
        console.log('Attempting to connect to:', mongoURL);
        
        const connection = await mongoose.connect(mongoURL);
        console.log('Database Name:', connection.connection.db.databaseName);
        console.log('Collections:', await connection.connection.db.listCollections().toArray());
        
        return connection;
    } catch (error) {
        console.log('Connection Error Details:', error);
        return null;
    }
};


export default connectdb;
