import fetch from 'node-fetch'
import Sale from '../models/Sale.js';
import productModel from '../models/productModel.js';
import PDFDocument from 'pdfkit'
const Product = productModel;
import { emailService } from './emailService.js'

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
    const sale = new Sale(saleData)
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

      console.log('Updating order status:', { orderId: id, newStatus: status })
      
      const sale = await Sale.findByIdAndUpdate(
        id,
        { orderStatus: status },
        { new: true }
      ).populate('customer', 'name email');
  
      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }

      console.log('Order found:', {
        orderId: sale._id,
        customer: sale.customer,
        status: sale.orderStatus
      })
  
      try {
        await emailService.sendOrderStatusUpdate(sale, status)
        console.log('Email sent successfully')
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
      }
  
      res.status(200).json(sale);
    } catch (error) {
      console.error('Status update failed:', error)
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
    const currentStock = await Product.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    // Previous month stock
    const previousStock = await Product.countDocuments({
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
      {
        $match: {
          orderStatus: 'delivered',
          createdAt: { $gte: lastMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Previous month revenue
    const previousMonthRevenue = await Sale.aggregate([
      {
        $match: {
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
      
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: 'A4'
      })

      // Colors
      const primaryColor = '#c27c4c'
      const textColor = '#333333'
      const lightGray = '#f5f5f5'
      
      // Logo
      const imageUrl = 'https://res.cloudinary.com/daqh8noyb/image/upload/v1740427427/ecommerce/logo/dqfbmgopyjn4e6thkq9f.png'
      const imageBuffer = await fetchImageBuffer(imageUrl)
      doc.image(imageBuffer, 430, 45, { width: 120 })
      
      // Invoice Title
      doc.fillColor(textColor)
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('INVOICE', 50, 50)
      
      // Company Details
      doc.fontSize(10)
        .font('Helvetica')
        .text('www.yarees.in', 50, 85)
        .text('support@yarees.in', 50, 100)
        .text('+91 70050 71911', 50, 115)
      
      // Separator Line
      doc.strokeColor('#e0e0e0')
        .lineWidth(1)
        .moveTo(50, 140)
        .lineTo(550, 140)
        .stroke()
      
      // Customer Section
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('ISSUED TO:', 50, 160)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text(sale.customer.name, 50, 180)
        .text(sale.customer.email, 50, 195)
      
      // Invoice Details
      const detailsX = 350
      const valueX = 450
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice No:', detailsX, 160)
        .font('Helvetica')
        .text(sale._id, valueX, 160, { width: 150 })
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Date:', detailsX, 180)
        .font('Helvetica')
        .text(new Date(sale.createdAt).toLocaleDateString(), valueX, 180)
      
      if (sale.paymentMode) {
        doc.fontSize(10)
          .font('Helvetica-Bold')
          .text('Payment Method:', detailsX, 200)
          .font('Helvetica')
          .text(sale.paymentMode, valueX, 200)
      }
      
      // Table Configuration
      const tableTop = 240
      const tableWidth = 500
      const columns = [
        { title: 'DESCRIPTION', x: 50, width: 250, align: 'left' },
        { title: 'UNIT PRICE', x: 300, width: 100, align: 'center' },
        { title: 'QTY', x: 400, width: 50, align: 'center' },
        { title: 'TOTAL', x: 450, width: 100, align: 'right' }
      ]
      
      // Table Header
      doc.fillColor(primaryColor)
        .rect(50, tableTop, tableWidth, 25)
        .fill()
      
      doc.fillColor('white')
        .fontSize(10)
        .font('Helvetica-Bold')
      
      columns.forEach(column => {
        doc.text(
          column.title,
          column.x,
          tableTop + 8,
          { width: column.width, align: column.align }
        )
      })
      
      // Table Content
      let y = tableTop + 25
      let alternateRow = false
      
      doc.fillColor(textColor)
      
      sale.orderItems.forEach(item => {
        const rowHeight = Math.max(
          doc.heightOfString(item.product.name, {
            width: columns[0].width,
            align: 'left'
          }),
          20
        )
        
        if (alternateRow) {
          doc.fillColor(lightGray)
            .rect(50, y, tableWidth, rowHeight)
            .fill()
        }
        
        doc.fillColor(textColor)
          .fontSize(10)
          .font('Helvetica')
        
        // Product Details
        doc.text(
          item.product.name,
          columns[0].x,
          y + 5,
          { width: columns[0].width, align: 'left' }
        )
        
        doc.text(
          `₹${item.price.toFixed(2)}`,
          columns[1].x,
          y + 5,
          { width: columns[1].width, align: 'center', encoding: 'UTF-8' }
        )
        
        doc.text(
          item.quantity.toString(),
          columns[2].x,
          y + 5,
          { width: columns[2].width, align: 'center' }
        )
        
        doc.text(
          `₹${(item.price * item.quantity).toFixed(2)}`,
          columns[3].x,
          y + 5,
          { width: columns[3].width, align: 'right', encoding: 'UTF-8' }
        )
        
        y += rowHeight
        alternateRow = !alternateRow
      })
      
      // Tax Row
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Tax', columns[2].x, y + 15, { width: columns[2].width, align: 'right' })
        .font('Helvetica')
        .text('0%', columns[3].x, y + 15, { width: columns[3].width, align: 'right' })
      
      // Summary Section
      const summaryY = y + 40
      
      doc.fillColor(lightGray)
        .rect(50, summaryY, tableWidth, 25)
        .fill()
      
      doc.fillColor(textColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('SUBTOTAL', columns[0].x, summaryY + 8)
        .text('TOTAL', columns[2].x, summaryY + 8, { width: columns[2].width, align: 'right' })
        .text(
          `₹${sale.totalAmount.toFixed(2)}`,
          columns[3].x,
          summaryY + 8,
          { width: columns[3].width, align: 'right', encoding: 'UTF-8' }
        )
      
      // Thank You Message
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('THANK YOU FOR YOUR BUSINESS!', 50, summaryY + 50, { align: 'center' })
      
      // Notes Section
      const notesY = summaryY + 90
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('NOTES:', 50, notesY)
      
      doc.fontSize(9)
        .font('Helvetica')
        .text(
          'Please make the payment by the due date mentioned on the invoice. If you have any questions or require further details, feel free to contact us. We appreciate your prompt payment and look forward to serving you again.',
          50,
          notesY + 20,
          { width: 300 }
        )
      
      // Bottom Design
      const designY = notesY + 40
      const designWidth = 300
      const designHeight = 150
      
      doc.save()
      
      // Light beige section
      doc.fillColor('#e8e1d9')
        .moveTo(550, designY)
        .lineTo(550, designY + designHeight)
        .lineTo(550 - designWidth, designY + designHeight)
        .fill()
      
      // Medium beige section
      doc.fillColor('#d9c3b0')
        .moveTo(550, designY + (designHeight * 0.35))
        .lineTo(550, designY + designHeight)
        .lineTo(550 - (designWidth * 0.65), designY + designHeight)
        .fill()
      
      // Dark section
      doc.fillColor(primaryColor)
        .moveTo(550, designY + (designHeight * 0.65))
        .lineTo(550, designY + designHeight)
        .lineTo(550 - (designWidth * 0.35), designY + designHeight)
        .fill()
      
      doc.restore()
      
      res.setHeader('Content-Type', 'application/pdf')
      doc.pipe(res)
      doc.end()
      
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  export const downloadInvoice = async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate('customer')
        .populate('orderItems.product')
      
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: 'A4'
      })
      
      // Colors
      const primaryColor = '#c27c4c'
      const textColor = '#333333'
      const lightGray = '#f5f5f5'
      
      // Logo
      const imageUrl = 'https://res.cloudinary.com/daqh8noyb/image/upload/v1740427427/ecommerce/logo/dqfbmgopyjn4e6thkq9f.png'
      const imageBuffer = await fetchImageBuffer(imageUrl)
      doc.image(imageBuffer, 430, 45, { width: 120 })
      
      // Invoice Title
      doc.fillColor(textColor)
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('INVOICE', 50, 50)
      
      // Company Details
      doc.fontSize(10)
        .font('Helvetica')
        .text('www.yarees.in', 50, 85)
        .text('support@yarees.in', 50, 100)
        .text('+91 70050 71911', 50, 115)
      
      // Separator Line
      doc.strokeColor('#e0e0e0')
        .lineWidth(1)
        .moveTo(50, 140)
        .lineTo(550, 140)
        .stroke()
      
      // Customer Section
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('ISSUED TO:', 50, 160)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text(sale.customer.name, 50, 180)
        .text(sale.customer.email, 50, 195)
      
      // Invoice Details
      const detailsX = 350
      const valueX = 450
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice No:', detailsX, 160)
        .font('Helvetica')
        .text(sale._id, valueX, 160, { width: 150 })
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Date:', detailsX, 180)
        .font('Helvetica')
        .text(new Date(sale.createdAt).toLocaleDateString(), valueX, 180)
      
      if (sale.paymentMode) {
        doc.fontSize(10)
          .font('Helvetica-Bold')
          .text('Payment Method:', detailsX, 200)
          .font('Helvetica')
          .text(sale.paymentMode, valueX, 200)
      }
      
      // Table Configuration
      const tableTop = 240
      const tableWidth = 500
      const columns = [
        { title: 'DESCRIPTION', x: 50, width: 250, align: 'left' },
        { title: 'UNIT PRICE', x: 300, width: 100, align: 'center' },
        { title: 'QTY', x: 400, width: 50, align: 'center' },
        { title: 'TOTAL', x: 450, width: 100, align: 'right' }
      ]
      
      // Table Header
      doc.fillColor(primaryColor)
        .rect(50, tableTop, tableWidth, 25)
        .fill()
      
      doc.fillColor('white')
        .fontSize(10)
        .font('Helvetica-Bold')
      
      columns.forEach(column => {
        doc.text(
          column.title,
          column.x,
          tableTop + 8,
          { width: column.width, align: column.align }
        )
      })
      
      // Table Content
      let y = tableTop + 25
      let alternateRow = false
      
      doc.fillColor(textColor)
      
      sale.orderItems.forEach(item => {
        const rowHeight = Math.max(
          doc.heightOfString(item.product.name, {
            width: columns[0].width,
            align: 'left'
          }),
          20
        )
        
        if (alternateRow) {
          doc.fillColor(lightGray)
            .rect(50, y, tableWidth, rowHeight)
            .fill()
        }
        
        doc.fillColor(textColor)
          .fontSize(10)
          .font('Helvetica')
        
        // Product Details
        doc.text(
          item.product.name,
          columns[0].x,
          y + 5,
          { width: columns[0].width, align: 'left' }
        )
        
        doc.text(
          `₹${item.price.toFixed(2)}`,
          columns[1].x,
          y + 5,
          { width: columns[1].width, align: 'center', encoding: 'UTF-8' }
        )
        
        doc.text(
          item.quantity.toString(),
          columns[2].x,
          y + 5,
          { width: columns[2].width, align: 'center' }
        )
        
        doc.text(
          `₹${(item.price * item.quantity).toFixed(2)}`,
          columns[3].x,
          y + 5,
          { width: columns[3].width, align: 'right', encoding: 'UTF-8' }
        )
        
        y += rowHeight
        alternateRow = !alternateRow
      })
      
      // Tax Row
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Tax', columns[2].x, y + 15, { width: columns[2].width, align: 'right' })
        .font('Helvetica')
        .text('0%', columns[3].x, y + 15, { width: columns[3].width, align: 'right' })
      
      // Summary Section
      const summaryY = y + 40
      
      doc.fillColor(lightGray)
        .rect(50, summaryY, tableWidth, 25)
        .fill()
      
      doc.fillColor(textColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('SUBTOTAL', columns[0].x, summaryY + 8)
        .text('TOTAL', columns[2].x, summaryY + 8, { width: columns[2].width, align: 'right' })
        .text(
          `₹${sale.totalAmount.toFixed(2)}`,
          columns[3].x,
          summaryY + 8,
          { width: columns[3].width, align: 'right', encoding: 'UTF-8' }
        )
      
      // Thank You Message
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('THANK YOU FOR YOUR BUSINESS!', 50, summaryY + 50, { align: 'center' })
      
      // Notes Section
      const notesY = summaryY + 90
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('NOTES:', 50, notesY)
      
      doc.fontSize(9)
        .font('Helvetica')
        .text(
          'Please make the payment by the due date mentioned on the invoice. If you have any questions or require further details, feel free to contact us. We appreciate your prompt payment and look forward to serving you again.',
          50,
          notesY + 20,
          { width: 300 }
        )
      
      // Bottom Design
      const designY = notesY + 40
      const designWidth = 300
      const designHeight = 150
      
      doc.save()
      
      // Light beige section
      doc.fillColor('#e8e1d9')
        .moveTo(550, designY)
        .lineTo(550, designY + designHeight)
        .lineTo(550 - designWidth, designY + designHeight)
        .fill()
      
      // Medium beige section
      doc.fillColor('#d9c3b0')
        .moveTo(550, designY + (designHeight * 0.35))
        .lineTo(550, designY + designHeight)
        .lineTo(550 - (designWidth * 0.65), designY + designHeight)
        .fill()
      
      // Dark section
      doc.fillColor(primaryColor)
        .moveTo(550, designY + (designHeight * 0.65))
        .lineTo(550, designY + designHeight)
        .lineTo(550 - (designWidth * 0.35), designY + designHeight)
        .fill()
      
      doc.restore()
      
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



