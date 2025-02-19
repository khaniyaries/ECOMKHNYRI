import Link from "next/link"
import Image from "next/image"
import { useAdminAuth } from '@/hooks/useAdminAuth.js'


// Sample customer data
const customerData = {
  id: "CUST001",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, AN 12345",
  totalOrders: 15,
  totalSpent: 2500.0,
  lastOrderDate: "2023-05-15",
  status: "Active",
  avatar: "/placeholder.svg?height=80&width=80",
  notes: "Prefers email communication. Interested in new product launches.",
}

// Sample order data
const orderData = [
  { id: "ORD001", date: "2023-05-15", total: 150.0, status: "Delivered" },
  { id: "ORD002", date: "2023-04-22", total: 89.99, status: "Shipped" },
  { id: "ORD003", date: "2023-03-10", total: 210.5, status: "Delivered" },
]

export default function CustomerDetails({ params }) {

  const { isAuthenticated } = useAdminAuth()

    if (!isAuthenticated) {
        return null
    }
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Customer Details</h1>
          <p className="text-gray-600">Manage customer information and orders</p>
        </div>
        <div>
          <Link
            href={`/admin/customers/${params.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Customer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Customer Info */}
        <div className="col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
              <Image
                src={customerData.avatar || "/placeholder.svg"}
                alt={customerData.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h2 className="text-2xl font-semibold">{customerData.name}</h2>
                <p className="text-gray-600">{customerData.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p>{customerData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p>{customerData.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p>{customerData.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p>${customerData.totalSpent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Order</p>
                <p>{customerData.lastOrderDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p
                  className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    customerData.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {customerData.status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
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
                {orderData.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/admin/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Notes */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Customer Notes</h3>
            <p className="text-gray-600">{customerData.notes}</p>
          </div>

        </div>
      </div>
    </div>
  )
}

