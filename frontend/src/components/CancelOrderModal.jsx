"use client"
import { useState } from 'react'
import { X } from 'lucide-react'

export default function CancelOrderModal({ isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(reason)
    setReason('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cancel Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please provide a reason for cancellation
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-md p-2 h-32 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your cancellation reason..."
              required
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}