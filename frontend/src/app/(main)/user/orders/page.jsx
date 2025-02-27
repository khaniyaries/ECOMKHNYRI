"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/userAuth'
import Link from 'next/link'
import { FileDown, Eye } from 'lucide-react'
import { env } from '../../../../../config/config.js'

export default function UserOrders() {
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
      const response = await fetch(`${env.API_URL}/api/v1/sales/user/${user._id}/orders`)
      const data = await response.json()
      // Initialize as empty array if no orders
      setOrders(data.orders || [])
      setLoading(false)
    } catch (error) {
      // Set empty array on error
      setOrders([])
      setLoading(false)
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
                  <Link 
                    href={`/sales/invoice/${order._id}/view`}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Eye size={16} />
                    View Invoice
                  </Link>
                  <Link 
                    href={`/sales/invoice/${order._id}/download`}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <FileDown size={16} />
                    Download
                  </Link>
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
                      <p className="text-sm text-gray-500">Price: ${item.price}</p>
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
                    <p className="font-medium">${order.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
