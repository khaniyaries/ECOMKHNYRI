import cors from 'cors';
import express from "express";
import connectdb from "./connectionDB/connectionDB.js";
import adminRoute from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'

const port = 8080;
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to the specific database
await connectdb("yarees");

// Mount routes
app.use('/api/v1', adminRoute);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
