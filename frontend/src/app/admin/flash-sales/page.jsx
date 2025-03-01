"use client"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { env } from "../../../../config/config.js"
import { formatTime } from "@/utils/format-time.js"

const FlashSaleManager = () => {
  const [allProducts, setAllProducts] = useState([])
  const [flashSale, setFlashSale] = useState(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentStartTime, setCurrentStartTime] = useState('')
  const [currentEndTime, setCurrentEndTime] = useState('')
  const [activeStatus, setActiveStatus] = useState(false)

  useEffect(() => {
  fetchFlashSaleData()
  fetchFlashSalePeriod()
  fetchAllProducts()
}, [])

  const fetchFlashSaleData = async () => {
    const response = await fetch(`${env.API_URL}/api/v1/flashsales/active`)
    const data = await response.json()
    
    if (data && data.length > 0) {
      // Set products for display
      setFlashSale({
        isActive: true,
        products: data.map(product => ({
          product: {
            _id: product._id,
            name: product.name,
            price: product.price
          },
          flashSalePrice: product.flashSalePrice
        }))
      })
    }
  }

  const fetchFlashSalePeriod = async () => {
    const response = await fetch(`${env.API_URL}/api/v1/flashsales/period`)
    const data = await response.json()
    
    if (data) {
      const startDateTime = new Date(data.startTime)
      const endDateTime = new Date(data.endTime)
      
      setActiveStatus(data.isActive);
      setCurrentStartTime(startDateTime.toLocaleString())
      setCurrentEndTime(endDateTime.toLocaleString())
      setStartTime(startDateTime.toISOString().slice(0, 16))
      setEndTime(endDateTime.toISOString().slice(0, 16))
    }
  }

  const fetchAllProducts = async () => {
    const response = await fetch(`${env.API_URL}/api/v1/products`)
    const data = await response.json()
    const availableProducts = data.filter(product => !product.isFlashSale)
    setAllProducts(availableProducts)
    setLoading(false)
  }

  const handleSetPeriod = async () => {
    try {
      // Convert to UTC ISO strings for consistent timezone handling
      const startTimeUTC = new Date(startTime).toISOString()
      const endTimeUTC = new Date(endTime).toISOString()
  
      const response = await fetch(`${env.API_URL}/api/v1/flashsales/period`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          startTime: startTimeUTC, 
          endTime: endTimeUTC 
        })
      })
      
      if (response.ok) {
        toast.success('Flash sale period updated successfully!')
        fetchFlashSaleData()
        fetchFlashSalePeriod()
      } else {
        toast.error('Failed to update flash sale period')
      }
    } catch (error) {
      toast.error('Error updating flash sale period')
    }
  }

  const handleToggleStatus = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/flashsales/toggle`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        toast.success(`Flash sale ${flashSale?.isActive ? 'stopped' : 'started'} successfully!`)
        fetchFlashSaleData()
      } else {
        toast.error('Failed to toggle flash sale status')
      }
    } catch (error) {
      toast.error('Error toggling flash sale status')
    }
  }

  const handleAddProduct = async (productId, flashSalePrice) => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/flashsales/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{ productId, flashSalePrice }]
        })
      })
      
      if (response.ok) {
        setAllProducts(prev => prev.filter(p => p._id !== productId))
      
        const addedProduct = allProducts.find(p => p._id === productId)
        setFlashSale(prev => ({
          ...prev,
          products: [...(prev?.products || []), {
            product: addedProduct,
            flashSalePrice: Number(flashSalePrice)
          }]
        }))
        toast.success('Product added to flash sale!')
        fetchFlashSaleData()
      } else {
        toast.error('Failed to add product to flash sale')
      }
    } catch (error) {
      toast.error('Error adding product to flash sale')
    }
  }

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/flashsales/products`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [productId] })
      })
      
      if (response.ok) {
        const removedProduct = flashSale.products.find(p => p.product._id === productId)
        setFlashSale(prev => ({
          ...prev,
          products: prev.products.filter(p => p.product._id !== productId)
        }))
        
        setAllProducts(prev => [...prev, removedProduct.product])
        toast.success('Product removed from flash sale!')
        fetchFlashSaleData()
        fetchAllProducts()
      } else {
        toast.error('Failed to remove product from flash sale')
      }
    } catch (error) {
      toast.error('Error removing product from flash sale')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Flash Sale Management</h1>

      <div className="mb-8">

      <h2 className="text-xl mb-4">Current Flash Sale Period</h2>
        <div className="mb-4">
          <p>Start Time: {currentStartTime || 'Not set'}</p>
          <p>End Time: {currentEndTime || 'Not set'}</p>
        </div>

        <h2 className="text-xl mb-4">Set Flash Sale Period</h2>
        <div className="flex gap-4">
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2"
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={handleSetPeriod}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Set Period
          </button>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded ${
              activeStatus ? 'bg-red-500' : 'bg-green-500'
            } text-white`}
          >
            {activeStatus ? 'Stop' : 'Start'} Flash Sale
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl mb-4">Available Products</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
            {allProducts?.length > 0 ? (
                allProducts.map(product => (
                <div key={product._id} className="border p-4 rounded">
                    <h3>{product.name}</h3>
                    <p>Original Price: ${product.price}</p>
                    <div className="flex gap-2 mt-2">
                    <input
                        type="number"
                        placeholder="Flash Sale Price"
                        className="border p-1"
                        id={`price-${product._id}`}
                    />
                    <button
                        onClick={() => handleAddProduct(
                        product._id,
                        document.getElementById(`price-${product._id}`).value
                        )}
                        className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                        Add to Flash Sale
                    </button>
                    </div>
                </div>
                ))
            ) : (
                <div>No products available for flash sale</div>
            )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl mb-4">Flash Sale Products</h2>
          <div className="space-y-4">
            {flashSale?.products?.map(({ product, flashSalePrice }) => (
              <div key={product._id} className="border p-4 rounded">
                <h3>{product.name}</h3>
                <p>Original Price: ${product.price}</p>
                <p>Flash Sale Price: ${flashSalePrice}</p>
                <button
                  onClick={() => handleRemoveProduct(product._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded mt-2"
                >
                  Remove from Flash Sale
                </button>
              </div>
            ))}
            {(flashSale?.products?.length===0 || !flashSale?.products) && (
              <div>
                <p>No Products added</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashSaleManager