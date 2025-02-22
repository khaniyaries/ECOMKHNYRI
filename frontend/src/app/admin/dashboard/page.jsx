"use client"
import { useAdminAuth } from '@/hooks/useAdminAuth.js'
import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/utils/formatters.js'
import {env} from '../../../../config/config.js'

const renderGrowthIndicator = (value) => {
  const isPositive = value >= 0;
  return (
    <div className="flex items-center">
      {isPositive ? (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" />
        </svg>
      ) : (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" />
        </svg>
      )}
      <span>{Math.abs(value).toFixed(2)}%</span>
    </div>
  );
};

export default function Dashboard() {
  const { isAuthenticated } = useAdminAuth()

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: 0,
      revenueGrowth: 0,
      totalOrders: 0,
      ordersGrowth: 0,
      totalCustomers: 0,
      customerGrowth: 0,
      productsInStock: 0,
      stockGrowth: 0
    },
    recentOrders: []
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${env.API_URL}/api/v1/dashboard/stats`)
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    if (isAuthenticated) {
      fetchDashboardData()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  const { stats, recentOrders } = dashboardData

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-semibold">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className={`text-sm mt-2 flex items-center ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {renderGrowthIndicator(stats.revenueGrowth)}
            <span className="ml-1">from last month</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-semibold">{stats.totalOrders}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className={`text-sm mt-2 flex items-center ${stats.ordersGrowth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {renderGrowthIndicator(stats.ordersGrowth)}
            <span className="ml-1">from last month</span>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Customers</p>
              <h3 className="text-2xl font-semibold">{stats.totalCustomers}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className={`text-sm mt-2 flex items-center ${stats.customerGrowth >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            {renderGrowthIndicator(stats.customerGrowth)}
            <span className="ml-1">from last month</span>
          </div>
        </div>

        {/* Stock Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Products in Stock</p>
              <h3 className="text-2xl font-semibold">{stats.productsInStock}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className={`text-sm mt-2 flex items-center ${stats.stockGrowth >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {renderGrowthIndicator(stats.stockGrowth)}
            <span className="ml-1">new products</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
