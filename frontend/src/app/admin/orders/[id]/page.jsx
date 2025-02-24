"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useAdminAuth } from '@/hooks/useAdminAuth.js'
import { formatCurrency, formatDate } from '@/utils/formatters.js'
import { useParams } from "next/navigation"
import { env } from "../../../../../config/config.js"

export default function OrderDetails() {
  const { isAuthenticated } = useAdminAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const orderId = params.id

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, params.id])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/sales/${orderId}`)
      const data = await response.json()
      setOrder(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching order details:', error)
      setLoading(false)
    }
  }

  const handleViewInvoice = () => {
    window.open(`${env.API_URL}/api/v1/sales/invoice/${orderId}/view`, '_blank')
  }

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/sales/invoice/${orderId}/download`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${params.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading invoice:', error)
    }
  }

  if (!isAuthenticated || loading) {
    return null
  }

  if (!order) {
    return <div>Order not found</div>
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      processing: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      shipped: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      delivered: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      cancelled: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
    return icons[status] || icons.pending
  }
  
  const getStatusMessage = (status) => {
    const messages = {
      pending: 'Order is awaiting processing',
      processing: 'Order is being processed',
      shipped: 'Order has been shipped',
      delivered: 'Order has been delivered',
      cancelled: 'Order has been cancelled'
    }
    return messages[status] || 'Status unknown'
  }
  

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Order #{orderId}</h1>
          <p className="text-gray-600">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadInvoice}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Download Invoice
          </button>
          <button 
            onClick={handleViewInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="col-span-2 space-y-8">
          {/* Order Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="flex items-center">
              <div className="relative">
                <div className={`h-16 w-16 rounded-full ${getStatusColor(order.orderStatus)} flex items-center justify-center`}>
                  {getStatusIcon(order.orderStatus)}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{order.orderStatus}</h3>
                <p className="text-gray-600">{getStatusMessage(order.orderStatus)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                          <div className="text-sm text-gray-500">ID: {item.product._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="space-y-2">
              <p><strong>Payment Method:</strong> {order.paymentMode}</p>
              <p><strong>Transaction ID:</strong> {order.transactionId}</p>
              <p><strong>Status:</strong> Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
