import fetch from 'node-fetch'
import Sale from '../models/Sale.js';
import productModel from '../models/productModel.js';
import PDFDocument from 'pdfkit'

  const calculatePercentageChange = (previous, current) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const fetchImageBuffer = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };
  

export const createSale = async (req, res) => {
  try {
    const saleData = req.body;
    const sale = new Sale(saleData);
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllSales = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const totalItems = await Sale.countDocuments();
      const totalPages = Math.ceil(totalItems / limit);
  
      const sales = await Sale.find()
        .populate('customer', 'name email')
        .populate('orderItems.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        orders: sales,
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


  export const getUserOrders = async (req, res) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const totalItems = await Sale.countDocuments({ customer: userId });
      const totalPages = Math.ceil(totalItems / limit);
  
      const orders = await Sale.find({ customer: userId })
        .populate('orderItems.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        orders,
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
  

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('orderItems.product', 'name sku image price');
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSaleStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const sale = await Sale.findByIdAndUpdate(
        id,
        { orderStatus: status },
        { new: true }
      ).populate('customer', 'name email');
  
      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }
  
      // Future email service implementation
      // await sendOrderStatusEmail(sale.customer.email, sale.orderStatus);
  
      res.status(200).json(sale);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getDashboardStats = async (req, res) => {
    try {
      const currentDate = new Date();
      const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));

      const currentMonthOrders = await Sale.countDocuments({
        createdAt: { $gte: lastMonth }
      });
  
      // Previous month orders
      const previousMonthOrders = await Sale.countDocuments({
        createdAt: { $gte: previousMonth, $lt: lastMonth }
      });
  
      // Calculate orders growth
      const ordersGrowth = calculatePercentageChange(
        previousMonthOrders,
        currentMonthOrders
      );
  
      // Current month customers
      const currentMonthCustomers = await Sale.distinct('customer', {
        createdAt: { $gte: lastMonth }
      });
  
      // Previous month customers
      const previousMonthCustomers = await Sale.distinct('customer', {
        createdAt: { $gte: previousMonth, $lt: lastMonth }
      });
  
      // Current month stock
      const currentStock = await productModel.countDocuments({ 
        createdAt: { $gte: lastMonth }
      });
  
      // Previous month stock
      const previousStock = await productModel.countDocuments({
        createdAt: { $gte: previousMonth, $lt: lastMonth }
      });
  
      // Calculate growth percentages
      const customerGrowth = calculatePercentageChange(
        previousMonthCustomers.length,
        currentMonthCustomers.length
      );
  
      const stockGrowth = calculatePercentageChange(
        previousStock,
        currentStock
      );

  
      // Current month revenue
      const currentMonthRevenue = await Sale.aggregate([
        { $match: { 
          orderStatus: 'delivered',
          createdAt: { $gte: lastMonth }
        }},
        { $group: { _id: null, total: { $sum: '$totalAmount' } }}
      ]);
  
      // Previous month revenue
      const previousMonthRevenue = await Sale.aggregate([
        { $match: { 
          orderStatus: 'delivered',
          createdAt: { $gte: previousMonth, $lt: lastMonth }
        }},
        { $group: { _id: null, total: { $sum: '$totalAmount' } }}
      ]);
  
      // Calculate revenue growth
      const revenueGrowth = calculatePercentageChange(
        previousMonthRevenue[0]?.total || 0,
        currentMonthRevenue[0]?.total || 0
      );
  
      // Get total metrics
      const totalRevenue = await Sale.aggregate([
        { $match: { orderStatus: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } }}
      ]);
  
      const totalOrders = await Sale.countDocuments();
      const totalCustomers = (await Sale.distinct('customer')).length;
      const productsInStock = await productModel.countDocuments({ stock: { $gt: 0 } });
  
      // Get recent orders
      const recentOrders = await Sale.find()
        .populate('customer', 'name')
        .sort({ createdAt: -1 })
        .limit(10);
  
      res.status(200).json({
        stats: {
          totalRevenue: totalRevenue[0]?.total || 0,
          revenueGrowth,
          totalOrders,
          ordersGrowth,
          totalCustomers,
          customerGrowth,
          productsInStock,
          stockGrowth
        },
        recentOrders
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const viewInvoice = async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate('customer')
        .populate('orderItems.product')
      
      const doc = new PDFDocument()
      
      // Company Branding
      const imageUrl = 'https://res.cloudinary.com/daqh8noyb/image/upload/v1740427427/ecommerce/logo/dqfbmgopyjn4e6thkq9f.png'
      const imageBuffer = await fetchImageBuffer(imageUrl)
      doc.image(imageBuffer, 50, 45, { width: 80 })
      doc.fontSize(24).text('Yarees', 50, 45, { align: 'right' , font: 'Helvetica-Bold' })
      doc.fontSize(12).text('www.yarees.in', 50, 75, { align: 'right'})
      doc.text('contact.yarees@gmail.com', 50, 90, { align: 'right'})
      doc.text('+91 7051350219', 50, 105, { align: 'right'})
      
      // Invoice Header
      doc.fontSize(20).text('INVOICE', 50, 160, { font: 'Helvetica-Bold' })
      doc.fontSize(12)
        .text(`Invoice #: ${sale._id}`, 50, 190)
        .text(`Date: ${new Date(sale.createdAt).toLocaleString()}`, 50, 205)
        .text(`Payment Method: ${sale.paymentMode}`, 50, 220)
      
      // Customer Details
      doc.fontSize(14).text('BILL TO', 50, 260, { font: 'Helvetica-Bold' })
      doc.fontSize(12)
        .text(sale.customer.name, 50, 280)
        .text(sale.customer.email, 50, 295)
      
      // Items Table Header
      let y = 340
      doc.strokeColor('#000000')
      doc.lineWidth(1)
      doc.moveTo(50, y).lineTo(550, y).stroke()

      const columns = {
        product: { x: 50, width: 180 }, // Increased width for product names
        quantity: { x: 250, width: 80 },
        price: { x: 350, width: 80 },
        total: { x: 450, width: 80 }
      }
      
      y += 20
      doc.fontSize(12)
        .text('Products', columns.product.x, y, { font: 'Helvetica-Bold' , width: columns.product.width})
        .text('Quantity', columns.quantity.x, y, { font: 'Helvetica-Bold' , width: columns.quantity.width})
        .text('Price', columns.price.x, y, { font: 'Helvetica-Bold' , width: columns.price.width})
        .text('Total', columns.total.x, y, { font: 'Helvetica-Bold' , width: columns.total.width})
      
      // Items Table Content
      y += 20
      sale.orderItems.forEach(item => {
        const heightOffset = doc.heightOfString(item.product.name, {
          width: columns.product.width,
          align: 'left'
        })
        
        doc.text(item.product.name, columns.product.x, y, {
          width: columns.product.width,
          align: 'left'
        })
        doc.text(item.quantity.toString(), columns.quantity.x, y)
        doc.text(`$${item.price.toFixed(2)}`, columns.price.x, y)
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, columns.total.x, y)
        
        y += Math.max(heightOffset, 25) // Adjust row height based on content
      })
      
      // Total Section
      doc.moveTo(50, y).lineTo(550, y).stroke()
      y += 20
      doc.fontSize(14)
        .text('Total Amount:', 350, y, { font: 'Helvetica-Bold' })
        .text(`$${sale.totalAmount.toFixed(2)}`, 450, y)
      
      // Footer section with decorative elements
      const startX = 50
      const endX = 550
      const y_position = y + 60
      const dashLength = 5
      const gapLength = 5

      for (let x = startX; x <= endX; x += (dashLength + gapLength)) {
        doc.moveTo(x, y_position)
          .lineTo(Math.min(x + dashLength, endX), y_position)
          .stroke()
      }

      doc.fontSize(10)
        .text('Thank you for your business!', 50, y + 70, { align: 'center' })
        .text('Shop with confidence at YAREES', 50, y + 80, { align: 'center' })

      // Add decorative bottom border
      doc.moveTo(50, y + 100).lineTo(550, y + 100).stroke()

      // Add contact details at the very bottom
      doc.fontSize(8)
        .text('For support: contact@yarees.com | Website: www.yarees.com', 50, y + 110, { align: 'center' })

      
      res.setHeader('Content-Type', 'application/pdf')
      doc.pipe(res)
      doc.end()
      
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  
  // Download invoice
  export const downloadInvoice = async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate('customer')
        .populate('orderItems.product')
      
      const doc = new PDFDocument()
      
      // Company Branding
      const imageUrl = 'https://res.cloudinary.com/daqh8noyb/image/upload/v1740427427/ecommerce/logo/dqfbmgopyjn4e6thkq9f.png'
      const imageBuffer = await fetchImageBuffer(imageUrl)
      doc.image(imageBuffer, 50, 45, { width: 80 })
      doc.fontSize(24).text('Yarees', 50, 45, { align: 'right' , font: 'Helvetica-Bold' })
      doc.fontSize(12).text('www.yarees.in', 50, 75, { align: 'right'})
      doc.text('contact.yarees@gmail.com', 50, 90, { align: 'right'})
      doc.text('+91 7051350219', 50, 105, { align: 'right'})
      
      // Invoice Header
      doc.fontSize(20).text('INVOICE', 50, 160, { font: 'Helvetica-Bold' })
      doc.fontSize(12)
        .text(`Invoice #: ${sale._id}`, 50, 190)
        .text(`Date: ${new Date(sale.createdAt).toLocaleString()}`, 50, 205)
        .text(`Payment Method: ${sale.paymentMode}`, 50, 220)
      
      // Customer Details
      doc.fontSize(14).text('BILL TO', 50, 260, { font: 'Helvetica-Bold' })
      doc.fontSize(12)
        .text(sale.customer.name, 50, 280)
        .text(sale.customer.email, 50, 295)
      
      // Items Table Header
      let y = 340
      doc.strokeColor('#000000')
      doc.lineWidth(1)
      doc.moveTo(50, y).lineTo(550, y).stroke()

      const columns = {
        product: { x: 50, width: 180 }, // Increased width for product names
        quantity: { x: 250, width: 80 },
        price: { x: 350, width: 80 },
        total: { x: 450, width: 80 }
      }
      
      y += 20
      doc.fontSize(12)
        .text('Products', columns.product.x, y, { font: 'Helvetica-Bold' , width: columns.product.width})
        .text('Quantity', columns.quantity.x, y, { font: 'Helvetica-Bold' , width: columns.quantity.width})
        .text('Price', columns.price.x, y, { font: 'Helvetica-Bold' , width: columns.price.width})
        .text('Total', columns.total.x, y, { font: 'Helvetica-Bold' , width: columns.total.width})
      
      // Items Table Content
      y += 20
      sale.orderItems.forEach(item => {
        const heightOffset = doc.heightOfString(item.product.name, {
          width: columns.product.width,
          align: 'left'
        })
        
        doc.text(item.product.name, columns.product.x, y, {
          width: columns.product.width,
          align: 'left'
        })
        doc.text(item.quantity.toString(), columns.quantity.x, y)
        doc.text(`$${item.price.toFixed(2)}`, columns.price.x, y)
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, columns.total.x, y)
        
        y += Math.max(heightOffset, 25) // Adjust row height based on content
      })
      
      // Total Section
      doc.moveTo(50, y).lineTo(550, y).stroke()
      y += 20
      doc.fontSize(14)
        .text('Total Amount:', 350, y, { font: 'Helvetica-Bold' })
        .text(`$${sale.totalAmount.toFixed(2)}`, 450, y)
      
      // Footer section with decorative elements
      const startX = 50
      const endX = 550
      const y_position = y + 60
      const dashLength = 5
      const gapLength = 5

      for (let x = startX; x <= endX; x += (dashLength + gapLength)) {
        doc.moveTo(x, y_position)
          .lineTo(Math.min(x + dashLength, endX), y_position)
          .stroke()
      }

      doc.fontSize(10)
        .text('Thank you for your business!', 50, y + 70, { align: 'center' })
        .text('Shop with confidence at YAREES', 50, y + 80, { align: 'center' })

      // Add decorative bottom border
      doc.moveTo(50, y + 100).lineTo(550, y + 100).stroke()

      // Add contact details at the very bottom
      doc.fontSize(8)
        .text('For support: contact@yarees.com | Website: www.yarees.com', 50, y + 110, { align: 'center' })
      
      // Set download headers
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${sale._id}.pdf`)
      
      doc.pipe(res)
      doc.end()
      
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  export const getReturns = async (req, res) => {
    try {
      const returns = await Sale.find({
        customer: req.query.userId,
        orderStatus: 'returned'
      }).populate('orderItems.product');

      if (returns.length === 0) {
        return res.status(200).json([]); 
      }
      
      const formattedReturns = returns.map(returnItem => ({
        id: returnItem._id,
        item: returnItem.orderItems[0].product.name,
        date: returnItem.returnDetails.date,
        reason: returnItem.returnDetails.reason,
        status: returnItem.returnDetails.status
      }));
      
      res.status(200).json(formattedReturns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching returns' });
    }
  };
  
  export const getCancellations = async (req, res) => {
    try {
      const cancellations = await Sale.find({
        customer: req.query.userId,
        orderStatus: 'cancelled'
      }).populate('orderItems.product');
      
      const formattedCancellations = cancellations.map(cancel => ({
        id: cancel._id,
        item: cancel.orderItems[0].product.name,
        date: cancel.cancellationDetails.date,
        reason: cancel.cancellationDetails.reason,
        refundStatus: cancel.cancellationDetails.refundStatus
      }));
      
      res.status(200).json(formattedCancellations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cancellations' });
    }
  };
  
  
  
