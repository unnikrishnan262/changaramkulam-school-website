'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Event } from '@/types/content.types'
import RichTextEditor from './RichTextEditor'
import ImageUploader from './ImageUploader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug'

interface EventFormProps {
  event?: Event
  isEdit?: boolean
}

export default function EventForm({ event, isEdit = false }: EventFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: event?.title || '',
    slug: event?.slug || '',
    description: event?.description || '',
    content: event?.content || '',
    event_date: event?.event_date || '',
    start_time: event?.start_time || '',
    end_time: event?.end_time || '',
    location: event?.location || '',
    featured_image: event?.featured_image || '',
    status: event?.status || 'draft',
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && formData.title && !formData.slug) {
      const newSlug = generateSlug(formData.title)
      setFormData((prev) => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, isEdit, formData.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Validate required fields
      if (!formData.title || !formData.slug) {
        throw new Error('Title and slug are required')
      }

      // Check slug uniqueness
      if (!isEdit || formData.slug !== event?.slug) {
        const { data: existingEvent } = await supabase
          .from('events')
          .select('slug')
          .eq('slug', formData.slug)
          .single()

        if (existingEvent) {
          throw new Error('This slug is already in use. Please choose another.')
        }
      }

      const eventData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        content: formData.content || null,
        event_date: formData.event_date || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        featured_image: formData.featured_image || null,
        status: formData.status,
        created_by: user.id,
      }

      let error

      if (isEdit && event) {
        const result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)
        error = result.error
      } else {
        const result = await supabase.from('events').insert([eventData])
        error = result.error
      }

      if (error) throw error

      setMessage('Event saved successfully!')
      setTimeout(() => {
        router.push('/admin/events')
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error('Error saving event:', error)
      setMessage(error.message || 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <Input
              label="Event Title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Annual Sports Day 2024"
            />

            <Input
              label="Slug (URL-friendly name)"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="annual-sports-day-2024"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Brief description of the event..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'draft' | 'published' | 'archived',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Date & Time</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Event Date"
              type="date"
              value={formData.event_date || ''}
              onChange={(e) =>
                setFormData({ ...formData, event_date: e.target.value })
              }
            />

            <Input
              label="Start Time"
              type="time"
              value={formData.start_time || ''}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
            />

            <Input
              label="End Time"
              type="time"
              value={formData.end_time || ''}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <Input
            label="Event Location"
            value={formData.location || ''}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="School Playground"
          />
        </div>

        {/* Featured Image */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Featured Image</h2>
          <ImageUploader
            bucket="events"
            currentImage={formData.featured_image || ''}
            onUpload={(url) =>
              setFormData({ ...formData, featured_image: url })
            }
            label="Upload Event Image"
          />
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>
          <RichTextEditor
            content={formData.content || ''}
            onChange={(html) => setFormData({ ...formData, content: html })}
            placeholder="Write detailed information about the event..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            {isEdit ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </div>
    </form>
  )
}
