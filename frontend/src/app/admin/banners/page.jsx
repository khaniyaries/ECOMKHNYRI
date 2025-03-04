"use client"

import { useState, useEffect } from "react"
import { HiOutlineArrowSmRight } from "react-icons/hi"
import { env } from "../../../../config/config.js"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { uploadToCloudinary } from "../../../../config/cloudinary.js"
import toast from "react-hot-toast"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

// Sortable Banner Item Component
const SortableBannerItem = ({ banner, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: banner.index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-md p-4 mb-4 bg-white shadow-sm cursor-move"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Banner #{banner.index}</h3>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(banner)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(banner.index)}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="max-h-[20vh] overflow-hidden relative rounded-md">
        <img src={banner.url || "/placeholder.svg"} alt={`Banner ${banner.index}`} className="w-full object-cover" />

        {banner.linktitle && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 flex justify-between items-center">
            <div className="truncate">{banner.linktitle}</div>
            <HiOutlineArrowSmRight className="w-5 h-5 flex-shrink-0" />
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        <p>Link: {banner.link || "None"}</p>
        <p>Dimensions: Various sizes for responsive display</p>
      </div>
    </div>
  )
}

// Banner Size Selector Component
const BannerSizeSelector = ({ selectedSize, onChange }) => {
  const commonSizes = [
    { name: "Mobile Small", width: 300, height: 250, device: "mobile" },
    { name: "Mobile Medium", width: 320, height: 100, device: "mobile" },
    { name: "Tablet", width: 728, height: 90, device: "tablet" },
    { name: "Desktop Small", width: 468, height: 60, device: "desktop" },
    { name: "Desktop Large", width: 970, height: 250, device: "desktop" },
  ]

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Select Banner Size</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {commonSizes.map((size) => (
          <button
            key={`${size.device}-${size.width}x${size.height}`}
            type="button"
            className={`p-2 border rounded-md text-sm ${
              selectedSize?.device === size.device &&
              selectedSize?.width === size.width &&
              selectedSize?.height === size.height
                ? "bg-blue-100 border-blue-500"
                : "bg-white border-gray-300"
            }`}
            onClick={() => onChange(size)}
          >
            {size.name} ({size.width}x{size.height})
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Banners() {
  const [isLoading, setIsLoading] = useState(false)
  const [banners, setBanners] = useState([])
  const [editingBanner, setEditingBanner] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [order, setOrder] = useState(1)
  const [file, setFile] = useState(null)
  const [selectedSize, setSelectedSize] = useState({ device: "desktop", width: 970, height: 250 })
  const [responsiveFiles, setResponsiveFiles] = useState({
    mobile: null,
    tablet: null,
    desktop: null,
  })
  const [responsiveUrls, setResponsiveUrls] = useState({})

  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
    }
  }, [file])

  const fetchBanners = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${env.API_URL}/api/v1/banners`)
      if (response.ok) {
        const data = await response.json()
        // Sort banners by index before setting them in state
        const sortedBanners = (data.banners || []).sort((a, b) => a.index - b.index)
        setBanners(sortedBanners)
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast.error("Failed to load banners")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBanner = (banner) => {
    setEditingBanner(banner)
    setTitle(banner.linktitle || "")
    setLink(banner.link || "")
    setOrder(banner.index)
    setPreviewImage(banner.url)
    setResponsiveUrls(banner.responsiveUrls || {})
  }

  const handleCancelEdit = () => {
    setEditingBanner(null)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setLink("")
    setOrder(banners.length + 1)
    setFile(null)
    setPreviewImage(null)
    setResponsiveFiles({
      mobile: null,
      tablet: null,
      desktop: null,
    })
    setResponsiveUrls({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let mainImageUrl = editingBanner?.url
      const newResponsiveUrls = { ...responsiveUrls }

      // Upload main image if provided
      if (file) {
        mainImageUrl = await uploadToCloudinary(file)
      }

      // Upload responsive images if provided
      for (const [device, deviceFile] of Object.entries(responsiveFiles)) {
        if (deviceFile) {
          newResponsiveUrls[device] = await uploadToCloudinary(deviceFile)
        }
      }

      // Prepare dimensions object
      const dimensions = {
        mobile: { width: 300, height: 250 },
        tablet: { width: 728, height: 90 },
        desktop: { width: 970, height: 250 },
      }

      // Update or create banner
      const endpoint = `${env.API_URL}/api/v1/banners`
      const method = editingBanner ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: mainImageUrl,
          responsiveUrls: newResponsiveUrls,
          index: Number.parseInt(order),
          linktitle: title,
          link,
          dimensions,
        }),
      })

      if (response.ok) {
        toast.success(editingBanner ? "Banner updated successfully" : "Banner added successfully")
        fetchBanners()
        resetForm()
        setEditingBanner(null)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to save banner")
      }
    } catch (error) {
      console.error("Error saving banner:", error)
      toast.error("An error occurred while saving the banner")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
  
    if (active.id !== over.id) {
      const oldIndex = banners.findIndex((b) => b.index === active.id)
      const newIndex = banners.findIndex((b) => b.index === over.id)
  
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedBanners = [...banners]
        const [movedItem] = reorderedBanners.splice(oldIndex, 1)
        reorderedBanners.splice(newIndex, 0, movedItem)
  
        // Update indices sequentially
        const updatedBanners = reorderedBanners.map((banner, idx) => ({
          ...banner,
          index: idx + 1
        }))
  
        // Update UI immediately
        setBanners(updatedBanners)
  
        // Prepare data for API
        const bannerOrder = updatedBanners.map((banner) => ({
          oldIndex: banner.index,
          newIndex: banner.index
        }))
  
        try {
          const response = await fetch(`${env.API_URL}/api/v1/banners/reorder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bannerOrder }),
          })
  
          if (response.ok) {
            toast.success("Banner order updated")
            fetchBanners()
          } else {
            toast.error("Failed to update banner order")
            fetchBanners()
          }
        } catch (error) {
          console.error("Error reordering banners:", error)
          toast.error("An error occurred while reordering banners")
          fetchBanners()
        }
      }
    }
  }

  const handleDeleteBanner = async (index) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
  
    try {
      const response = await fetch(`${env.API_URL}/api/v1/banners/${index}`, {
        method: 'DELETE',
      })
  
      if (response.ok) {
        toast.success('Banner deleted successfully')
        fetchBanners() // Refresh the list
      } else {
        toast.error('Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('An error occurred while deleting the banner')
    }
  }

  if (isLoading && banners.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        {editingBanner ? (
          <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel Editing
          </button>
        ) : null}
      </div>

      {/* Banner List with Drag and Drop */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Current Banners</h2>
        <p className="text-sm text-gray-500">Drag and drop to reorder banners. Click Edit to modify a banner.</p>

        {banners.length === 0 ? (
          <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
            No banners added yet. Create your first banner below.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={banners.map((b) => b.index)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
              {banners.map((banner) => (
                <SortableBannerItem 
                  key={banner.index} 
                  banner={banner} 
                  onEdit={handleEditBanner}
                  onDelete={handleDeleteBanner}
                />
              ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Banner Form */}
      <div className="border p-6 rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold mb-4">
          {editingBanner ? `Edit Banner #${editingBanner.index}` : "Add New Banner"}
        </h2>

        {/* Banner Preview */}
        {previewImage && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Preview:</h3>
            <div className="h-[35vh] md:h-[40vh] overflow-hidden relative rounded-md border border-gray-300">
              <img src={previewImage || "/placeholder.svg"} alt="Banner preview" className="w-full object-contain" />

              {title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 flex justify-between items-center">
                  <div className="truncate">{title}</div>
                  <HiOutlineArrowSmRight className="w-5 h-5 flex-shrink-0" />
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Banner Size Selector */}
          <BannerSizeSelector selectedSize={selectedSize} onChange={setSelectedSize} />

          {/* Banner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Link Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter banner title"
              />
            </div>

            <div>
              <label className="block mb-2">Link URL</label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/page"
              />
            </div>

            <div>
              <label className="block mb-2">Order</label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(Number.parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Main Image Upload */}
          <div>
            <label className="block mb-2 font-medium">Main Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0])
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be used as the default image if responsive images are not provided
            </p>
          </div>

          {/* Responsive Image Uploads */}
          <div className="space-y-4">
            <h3 className="font-medium">Responsive Images (Optional)</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm">Mobile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setResponsiveFiles({
                        ...responsiveFiles,
                        mobile: e.target.files[0],
                      })
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
                <p className="mt-1 text-xs text-gray-500">Recommended: 300x250px</p>
              </div>

              <div>
                <label className="block mb-2 text-sm">Tablet Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setResponsiveFiles({
                        ...responsiveFiles,
                        tablet: e.target.files[0],
                      })
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
                <p className="mt-1 text-xs text-gray-500">Recommended: 728x90px</p>
              </div>

              <div>
                <label className="block mb-2 text-sm">Desktop Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setResponsiveFiles({
                        ...responsiveFiles,
                        desktop: e.target.files[0],
                      })
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
                <p className="mt-1 text-xs text-gray-500">Recommended: 970x250px</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-md text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : editingBanner
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

