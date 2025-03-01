"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/userAuth'
import Link from 'next/link'
import { FileDown, Eye, XCircle } from 'lucide-react'
import { env } from '../../../../../config/config.js'
import CancelOrderModal from '@/components/CancelOrderModal.jsx'


export default function UserOrders() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchUserOrders()
    }
  }, [user])

  const fetchUserOrders = async () => {
    try {

      const userId = localStorage.getItem('userId');
      const response = await fetch(`${env.API_URL}/api/v1/sales/user/${userId}/orders`)
      const data = await response.json()
      
      // Add console.log to check the data
      console.log('Fetched orders data:', data)
      
      // The API returns data.orders directly, so we don't need to check for data.orders
      setOrders(data.orders || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
      setLoading(false)
    }
  }

  const handleCancelOrder = async (reason) => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/sales/${selectedOrderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      fetchUserOrders()
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }

  const viewInvoice = async (orderId) => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/sales/invoice/${orderId}/view`, {
        headers: {
          'Accept': 'application/pdf'
        }
      })
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error viewing invoice:', error)
    }
  }
  
  const downloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/sales/invoice/${orderId}/download`, {
        headers: {
          'Accept': 'application/pdf'
        }
      })
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading invoice:', error)
    }
  }
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="text-primary hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order._id}</p>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                <button 
                  onClick={() => viewInvoice(order._id)}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Eye size={16} />
                  View Invoice
                </button>

                <button 
                  onClick={() => downloadInvoice(order._id)}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <FileDown size={16} />
                  Download
                </button>
                </div>
              </div>

              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{order.orderStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">₹{order.totalAmount}</p>
                  </div>
                  {order.orderStatus === 'pending' && 
                    (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60) <= 4 && (
                      <button
                      onClick={() => {
                        setSelectedOrderId(order._id)
                        setIsCancelModalOpen(true)
                      }}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <XCircle size={16} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false)
          setSelectedOrderId(null)
        }}
        onConfirm={handleCancelOrder}
      />
    </div>
  )
}
