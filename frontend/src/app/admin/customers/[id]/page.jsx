"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useAdminAuth } from '@/hooks/useAdminAuth.js'
import { env } from "../../../../../config/config.js"
import EditCustomerModal from "@/components/AdminComponents/EditCustomerModal.jsx"
import toast from "react-hot-toast"

export default function CustomerDetails() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { isAuthenticated } = useAdminAuth()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const [usernotfound, setusernotfound] = useState(false)
  const customerId = params.id

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomerDetails()
    }
  }, [isAuthenticated, customerId])

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/user/customers/${customerId}`)
      const data = await response.json()
      if (!response.ok) {
        setusernotfound(true)
      }
      setCustomer(data)
      setLoading(false)

    } catch (error) {
      console.error('Error fetching customer details:', error)
      setLoading(false)
    }
  }

  const handleSaveCustomer = async (formData) => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/user/profile/update/${customerId}?role=admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
  
      if (response.ok) {
        toast.success("Updated Succesfully");
        setIsEditModalOpen(false)
        fetchCustomerDetails() // Refresh the details
      }
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  if (!isAuthenticated || loading) {
    return null
  }

  if (usernotfound) {
    return (
      <div className="space-x-5">
        <div className="text-3xl">
          Customer not found...


        </div>

      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex-row flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Customer Details</h1>
          <p className="text-gray-600">View customer information and orders</p>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Edit Customer
        </button>
      </div>
      
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Info */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`${env.API_URL}/api/v1/user/customers/${customer._id}`, {
                      method: 'DELETE',
                    });

                    if (response.ok) {
                      toast.success('user deleted successfully');
                      window.location.href = '/admin/customers'

                    } else {
                      throw new Error('Failed to delete user');
                    }
                  } catch (error) {
                    toast.error('Failed to delete user');
                  }

                }}

                className="bg-red-500 text-white px-3 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <Image
                src={`https://ui-avatars.com/api/?name=${customer.name}&size=80`}
                alt={customer.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h2 className="text-2xl font-semibold">{customer.name}</h2>
                <p className="text-gray-600">{customer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p>{customer.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p>{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p>${customer.totalSpent?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Order</p>
                <p>{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders yet'}</p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customer.orders?.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/admin/orders/${order._id}`}>{order._id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === "delivered" ? "bg-green-100 text-green-800" :
                        order.orderStatus === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
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
        </div>
      </div>
      <EditCustomerModal 
        customer={customer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  )
}
