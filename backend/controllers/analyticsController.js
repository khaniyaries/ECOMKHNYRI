import Sale from "../models/Sale.js"

export const getAnalytics = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12
    const currentDate = new Date()
    const startDate = new Date(currentDate.setMonth(currentDate.getMonth() - months))

    const salesData = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
          uniqueCustomers: { $addToSet: "$customer" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])

    const formattedData = {
      labels: [],
      orders: [],
      revenue: [],
      customers: [],
      averageOrderValue: []
    }

    salesData.forEach(month => {
      const monthLabel = `${month._id.year}-${String(month._id.month).padStart(2, '0')}`
      formattedData.labels.push(monthLabel)
      formattedData.orders.push(month.orders)
      formattedData.revenue.push(month.revenue)
      formattedData.customers.push(month.uniqueCustomers.length)
      formattedData.averageOrderValue.push(month.revenue / month.orders)
    })

    res.json(formattedData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCustomDateAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const salesData = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
          uniqueCustomers: { $addToSet: "$customer" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])

    const formattedData = {
      labels: [],
      orders: [],
      revenue: [],
      customers: [],
      averageOrderValue: []
    }

    salesData.forEach(month => {
      const monthLabel = `${month._id.year}-${String(month._id.month).padStart(2, '0')}`
      formattedData.labels.push(monthLabel)
      formattedData.orders.push(month.orders)
      formattedData.revenue.push(month.revenue)
      formattedData.customers.push(month.uniqueCustomers.length)
      formattedData.averageOrderValue.push(month.revenue / month.orders)
    })

    res.json(formattedData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
