import cors from 'cors';
import express from "express";
import connectdb from "./connectionDB/connectionDB.js";
import adminRoute from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import saleHeaderRoutes from './routes/saleHeaderRoutes.js'
import saleRoutes from './routes/saleRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import addressRoutes from './routes/addressRoutes.js'
import paymentMethodRoutes from './routes/paymentMethodRoutes.js'

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const port = 8080;
const app = express();

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors())

app.use(express.json());

// Connect to the database
connectdb();

// Mount routes

app.use('/api/v1', adminRoute);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/saleheader', saleHeaderRoutes);
app.use('/api/v1/sales', saleRoutes);
app.use('/api/v1', analyticsRoutes);
app.use('/api/v1/user/address',addressRoutes);
app.use('/api/v1/user', paymentMethodRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
