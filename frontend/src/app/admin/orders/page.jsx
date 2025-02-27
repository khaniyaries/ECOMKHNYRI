"use client"
import Link from "next/link"
import { useAdminAuth } from '@/hooks/useAdminAuth.js'
import { useState, useEffect } from 'react'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { env } from "../../../../config/config.js"

const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]

export default function Orders() {
  const { isAuthenticated } = useAdminAuth()
  const [orders, setOrders] = useState([])
  const [editingStatus, setEditingStatus] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated, pagination.currentPage])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/sales?page=${pagination.currentPage}`)
      const data = await response.json()
      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleStatusEdit = (orderId, currentStatus) => {
    setEditingStatus(orderId)
    setSelectedStatus(currentStatus)
  }

  const handleStatusUpdate = async (orderId) => {
    try {
      console.log('Sending status update:', { orderId, status: selectedStatus })
  
      const response = await fetch(`${env.API_URL}/api/v1/sales/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: selectedStatus })
      })
  
      const data = await response.json()
      console.log('Status update response:', data)
  
      if (response.ok) {
        // Refresh the orders list to show updated data
        await fetchOrders()
        setEditingStatus(null)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }
  
  

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and process customer orders</p>
        </div>
        <div>
          <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <input 
          type="text" 
          placeholder="Search orders..." 
          className="flex-1 min-w-[200px] px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        />
        <select className="min-w-[150px] px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        <input 
          type="date" 
          className="min-w-[150px] px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        />
        <input 
          type="date" 
          className="min-w-[150px] px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>


      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* Table headers remain the same */}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  <Link href={`/admin/orders/${order._id}`}>#{order._id.slice(-6)}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStatus === order._id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-md border-gray-300 text-sm"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleStatusUpdate(order._id)}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => handleStatusEdit(order._id, order.orderStatus)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        {/* Mobile Pagination */}
        <div className="flex-1 flex justify-between sm:hidden">
          <button 
            onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage - 1}))}
            disabled={pagination.currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${
              pagination.currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button 
            onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage + 1}))}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${
              pagination.currentPage === pagination.totalPages ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>

        {/* Desktop Pagination */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>{" "}
              of <span className="font-medium">{pagination.totalItems}</span> results
            </p>
          </div>

          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {/* Previous Page Button */}
              <button
                onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage - 1}))}
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  pagination.currentPage === 1 ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Page Numbers */}
              {[...Array(pagination.totalPages)]?.map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPagination(prev => ({...prev, currentPage: idx + 1}))}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pagination.currentPage === idx + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              {/* Next Page Button */}
              <button
                onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage + 1}))}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  pagination.currentPage === pagination.totalPages ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

