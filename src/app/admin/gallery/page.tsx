'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GalleryItem } from '@/types/content.types'
import ImageUploader from '@/components/admin/ImageUploader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

const CATEGORIES = ['General', 'Sports', 'Academics', 'Events', 'Infrastructure', 'Cultural']

export default function GalleryManagementPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  const fetchGalleryItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching gallery items:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchGalleryItems()
  }, [fetchGalleryItems])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    setDeleting(id)
    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete image')
    } finally {
      setDeleting(null)
    }
  }

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter(
          (item) =>
            item.category?.toLowerCase() === selectedCategory.toLowerCase()
        )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
        <Button onClick={() => setShowAddModal(true)}>Add Images</Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All ({items.length})
        </button>
        {CATEGORIES.map((category) => {
          const count = items.filter(
            (item) => item.category?.toLowerCase() === category.toLowerCase()
          ).length
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category} ({count})
            </button>
          )
        })}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No images in gallery
          </h2>
          <p className="text-gray-500 mb-6">
            Get started by adding your first image
          </p>
          <Button onClick={() => setShowAddModal(true)}>Add Images</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow overflow-hidden group relative"
            >
              <div className="relative h-48">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 truncate">
                  {item.title}
                </h3>
                {item.category && (
                  <span className="text-xs text-gray-500">{item.category}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddImageModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchGalleryItems()
          }}
        />
      )}
    </div>
  )
}

// Add Image Modal Component
function AddImageModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'General',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image_url) {
      setError('Please upload an image')
      return
    }

    setSaving(true)
    setError('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase.from('gallery_items').insert([
        {
          title: formData.title,
          description: formData.description || null,
          image_url: formData.image_url,
          category: formData.category,
          created_by: user?.id,
        },
      ])

      if (error) throw error

      onSuccess()
    } catch (error: any) {
      console.error('Error adding image:', error)
      setError(error.message || 'Failed to add image')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add Image to Gallery</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Image Title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Summer Camp 2024"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <ImageUploader
              bucket="gallery"
              currentImage={formData.image_url}
              onUpload={(url) => setFormData({ ...formData, image_url: url })}
              label="Upload Image"
            />

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                Add to Gallery
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
