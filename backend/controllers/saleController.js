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
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      })
      
      // Define colors
      const primaryColor = '#c27c4c' // Orange/brown color from the design
      const textColor = '#333333'
      const lightGray = '#f5f5f5'
      
      // Company Logo (top right)
      const imageUrl = 'https://res.cloudinary.com/daqh8noyb/image/upload/v1740427427/ecommerce/logo/dqfbmgopyjn4e6thkq9f.png'
      const imageBuffer = await fetchImageBuffer(imageUrl)
      doc.image(imageBuffer, 430, 45, { width: 120 })
      
      // INVOICE title and company details (top left)
      doc.fillColor(textColor)
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('INVOICE', 50, 50)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text('www.yarees.in', 50, 85)
        .text('support@yarees.in', 50, 100)
        .text('+91 70050 71911', 50, 115)
      
      // Add a line separator
      doc.strokeColor('#e0e0e0')
        .lineWidth(1)
        .moveTo(50, 140)
        .lineTo(550, 140)
        .stroke()
      
      // ISSUED TO section
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('ISSUED TO:', 50, 160)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text(sale.customer.name, 50, 180)
        .text(sale.customer.email, 50, 195)
      
      // Invoice details (right side)
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice No:', 400, 160)
        .text('Date:', 400, 175)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text(sale._id, 470, 160)
        .text(new Date(sale.createdAt).toLocaleDateString(), 470, 175)
      
      // Add payment method if needed
      if (sale.paymentMode) {
        doc.fontSize(10)
          .font('Helvetica-Bold')
          .text('Payment Method:', 400, 190)
        
        doc.fontSize(10)
          .font('Helvetica')
          .text(sale.paymentMode, 470, 190)
      }
      
      // Table header
      const tableTop = 240
      const tableHeaders = [
        { title: 'DESCRIPTION', x: 50, width: 250 },
        { title: 'UNIT PRICE', x: 300, width: 80 },
        { title: 'QTY', x: 380, width: 70 },
        { title: 'TOTAL', x: 450, width: 80 }
      ]
      
      // Draw table header background
      doc.fillColor(primaryColor)
        .rect(50, tableTop, 500, 25)
        .fill()
      
      // Draw table header text
      doc.fillColor('white')
        .fontSize(10)
        .font('Helvetica-Bold')
      
      tableHeaders.forEach(header => {
        doc.text(
          header.title,
          header.x,
          tableTop + 8,
          { width: header.width, align: header.title === 'DESCRIPTION' ? 'left' : 'center' }
        )
      })
      
      // Reset fill color
      doc.fillColor(textColor)
      
      // Table content
      let y = tableTop + 25
      let alternateRow = false
      
      sale.orderItems.forEach(item => {
        // Calculate row height based on product name length
        const heightOffset = Math.max(
          doc.heightOfString(item.product.name, {
            width: tableHeaders[0].width,
            align: 'left'
          }),
          20
        )
        
        // Draw alternating row background
        if (alternateRow) {
          doc.fillColor(lightGray)
            .rect(50, y, 500, heightOffset)
            .fill()
          doc.fillColor(textColor)
        }
        alternateRow = !alternateRow
        
        // Product name
        doc.fontSize(10)
          .font('Helvetica')
          .text(
            item.product.name,
            tableHeaders[0].x,
            y + 5,
            { width: tableHeaders[0].width, align: 'left' }
          )
        
        // Unit price
        doc.text(
          `$${item.price.toFixed(2)}`,
          tableHeaders[1].x,
          y + 5,
          { width: tableHeaders[1].width, align: 'center' }
        )
        
        // Quantity
        doc.text(
          item.quantity.toString(),
          tableHeaders[2].x,
          y + 5,
          { width: tableHeaders[2].width, align: 'center' }
        )
        
        // Total
        doc.text(
          `$${(item.price * item.quantity).toFixed(2)}`,
          tableHeaders[3].x,
          y + 5,
          { width: tableHeaders[3].width, align: 'center' }
        )
        
        y += heightOffset
      })
      
      // Tax line
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Tax', 400, y + 15)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text('0%', 500, y + 15, { align: 'right' })
      
      // Subtotal and Total
      const summaryY = y + 40
      
      // Subtotal background
      doc.fillColor(lightGray)
        .rect(50, summaryY, 500, 25)
        .fill()
      
      doc.fillColor(textColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('SUBTOTAL', 60, summaryY + 8)
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('TOTAL', 390, summaryY + 8)
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text(`$${sale.totalAmount.toFixed(2)}`, 500, summaryY + 8, { align: 'right' })
      
      // Thank you message
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('THANK YOU FOR YOUR BUSINESS!', 50, summaryY + 50, { align: 'center' })
      
      // Notes section
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
          { width: 300, align: 'left' }
        )
      
      // Decorative diagonal element in bottom right
      doc.save()
      doc.fillColor('#e8e1d9')
        .moveTo(550, notesY + 120)
        .lineTo(550, notesY - 20)
        .lineTo(400, notesY + 120)
        .fill()
      
      doc.fillColor('#d9c3b0')
        .moveTo(550, notesY + 120)
        .lineTo(550, notesY + 40)
        .lineTo(470, notesY + 120)
        .fill()
      
      doc.fillColor(primaryColor)
        .moveTo(550, notesY + 120)
        .lineTo(550, notesY + 80)
        .lineTo(510, notesY + 120)
        .fill()
      doc.restore()
      
      // Send the PDF
      res.setHeader('Content-Type', 'application/pdf')
      doc.pipe(res)
      doc.end()
      
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  // Download invoice - same implementation but with download headers
  export const downloadInvoice = async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate('customer')
        .populate('orderItems.product')
      
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      })
      
      // Define colors
      const primaryColor = '#c27c4c' // Orange/brown color from the design
      const textColor = '#333333'
      const lightGray = '#f5f5f5'
      
      // Company Logo (top right)
      const imageUrl = 'https://res.cloudinary.com/daqh8noyb/image/upload/v1740427427/ecommerce/logo/dqfbmgopyjn4e6thkq9f.png'
      const imageBuffer = await fetchImageBuffer(imageUrl)
      doc.image(imageBuffer, 430, 45, { width: 120 })
      
      // INVOICE title and company details (top left)
      doc.fillColor(textColor)
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('INVOICE', 50, 50)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text('www.yarees.in', 50, 85)
        .text('support@yarees.in', 50, 100)
        .text('+91 70050 71911', 50, 115)
      
      // Add a line separator
      doc.strokeColor('#e0e0e0')
        .lineWidth(1)
        .moveTo(50, 140)
        .lineTo(550, 140)
        .stroke()
      
      // ISSUED TO section
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('ISSUED TO:', 50, 160)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text(sale.customer.name, 50, 180)
        .text(sale.customer.email, 50, 195)
      
      // Invoice details (right side)
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice No:', 400, 160)
        .text('Date:', 400, 175)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text(sale._id, 470, 160)
        .text(new Date(sale.createdAt).toLocaleDateString(), 470, 175)
      
      // Add payment method if needed
      if (sale.paymentMode) {
        doc.fontSize(10)
          .font('Helvetica-Bold')
          .text('Payment Method:', 400, 190)
        
        doc.fontSize(10)
          .font('Helvetica')
          .text(sale.paymentMode, 470, 190)
      }
      
      // Table header
      const tableTop = 240
      const tableHeaders = [
        { title: 'DESCRIPTION', x: 50, width: 250 },
        { title: 'UNIT PRICE', x: 300, width: 80 },
        { title: 'QTY', x: 380, width: 70 },
        { title: 'TOTAL', x: 450, width: 80 }
      ]
      
      // Draw table header background
      doc.fillColor(primaryColor)
        .rect(50, tableTop, 500, 25)
        .fill()
      
      // Draw table header text
      doc.fillColor('white')
        .fontSize(10)
        .font('Helvetica-Bold')
      
      tableHeaders.forEach(header => {
        doc.text(
          header.title,
          header.x,
          tableTop + 8,
          { width: header.width, align: header.title === 'DESCRIPTION' ? 'left' : 'center' }
        )
      })
      
      // Reset fill color
      doc.fillColor(textColor)
      
      // Table content
      let y = tableTop + 25
      let alternateRow = false
      
      sale.orderItems.forEach(item => {
        // Calculate row height based on product name length
        const heightOffset = Math.max(
          doc.heightOfString(item.product.name, {
            width: tableHeaders[0].width,
            align: 'left'
          }),
          20
        )
        
        // Draw alternating row background
        if (alternateRow) {
          doc.fillColor(lightGray)
            .rect(50, y, 500, heightOffset)
            .fill()
          doc.fillColor(textColor)
        }
        alternateRow = !alternateRow
        
        // Product name
        doc.fontSize(10)
          .font('Helvetica')
          .text(
            item.product.name,
            tableHeaders[0].x,
            y + 5,
            { width: tableHeaders[0].width, align: 'left' }
          )
        
        // Unit price
        doc.text(
          `$${item.price.toFixed(2)}`,
          tableHeaders[1].x,
          y + 5,
          { width: tableHeaders[1].width, align: 'center' }
        )
        
        // Quantity
        doc.text(
          item.quantity.toString(),
          tableHeaders[2].x,
          y + 5,
          { width: tableHeaders[2].width, align: 'center' }
        )
        
        // Total
        doc.text(
          `$${(item.price * item.quantity).toFixed(2)}`,
          tableHeaders[3].x,
          y + 5,
          { width: tableHeaders[3].width, align: 'center' }
        )
        
        y += heightOffset
      })
      
      // Tax line
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Tax', 400, y + 15)
      
      doc.fontSize(10)
        .font('Helvetica')
        .text('0%', 500, y + 15, { align: 'right' })
      
      // Subtotal and Total
      const summaryY = y + 40
      
      // Subtotal background
      doc.fillColor(lightGray)
        .rect(50, summaryY, 500, 25)
        .fill()
      
      doc.fillColor(textColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('SUBTOTAL', 60, summaryY + 8)
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('TOTAL', 390, summaryY + 8)
      
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text(`$${sale.totalAmount.toFixed(2)}`, 500, summaryY + 8, { align: 'right' })
      
      // Thank you message
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('THANK YOU FOR YOUR BUSINESS!', 50, summaryY + 50, { align: 'center' })
      
      // Notes section
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
          { width: 300, align: 'left' }
        )
      
      // Decorative diagonal element in bottom right
      doc.save()
      doc.fillColor('#e8e1d9')
        .moveTo(550, notesY + 120)
        .lineTo(550, notesY - 20)
        .lineTo(400, notesY + 120)
        .fill()
      
      doc.fillColor('#d9c3b0')
        .moveTo(550, notesY + 120)
        .lineTo(550, notesY + 40)
        .lineTo(470, notesY + 120)
        .fill()
      
      doc.fillColor(primaryColor)
        .moveTo(550, notesY + 120)
        .lineTo(550, notesY + 80)
        .lineTo(510, notesY + 120)
        .fill()
      doc.restore()
      
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



