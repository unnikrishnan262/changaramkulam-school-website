'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ContactContent } from '@/types/content.types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ContactPageAdmin() {
  const [content, setContent] = useState<ContactContent>({
    phone: '',
    email: '',
    address: '',
    facebook_url: '',
    map_coordinates: { lat: 0, lng: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('content')
        .eq('page_name', 'contact')
        .single()

      if (error) throw error

      if (data?.content) {
        setContent(data.content as ContactContent)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setMessage('Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('page_content')
        .update({
          content: content,
          updated_by: user?.id,
        })
        .eq('page_name', 'contact')

      if (error) throw error

      setMessage('Content saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving content:', error)
      setMessage('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Manage Contact Page
        </h1>
        <Button onClick={handleSave} isLoading={saving}>
          Save Changes
        </Button>
      </div>

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

      <div className="space-y-8">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

          <div className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              value={content.phone}
              onChange={(e) =>
                setContent({ ...content, phone: e.target.value })
              }
              placeholder="+91 1234567890"
            />

            <Input
              label="Email Address"
              type="email"
              value={content.email}
              onChange={(e) =>
                setContent({ ...content, email: e.target.value })
              }
              placeholder="info@changaramkulamupschool.in"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Address
              </label>
              <textarea
                value={content.address}
                onChange={(e) =>
                  setContent({ ...content, address: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Full address of the school..."
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Social Media</h2>

          <Input
            label="Facebook Page URL"
            type="url"
            value={content.facebook_url || ''}
            onChange={(e) =>
              setContent({ ...content, facebook_url: e.target.value })
            }
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        {/* Map Coordinates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Map Location</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter the coordinates for Google Maps. You can find these by
            searching for your school on Google Maps and copying the coordinates
            from the URL or by right-clicking on the location.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="any"
              value={content.map_coordinates.lat}
              onChange={(e) =>
                setContent({
                  ...content,
                  map_coordinates: {
                    ...content.map_coordinates,
                    lat: parseFloat(e.target.value) || 0,
                  },
                })
              }
              placeholder="e.g., 10.8505"
            />

            <Input
              label="Longitude"
              type="number"
              step="any"
              value={content.map_coordinates.lng}
              onChange={(e) =>
                setContent({
                  ...content,
                  map_coordinates: {
                    ...content.map_coordinates,
                    lng: parseFloat(e.target.value) || 0,
                  },
                })
              }
              placeholder="e.g., 76.2711"
            />
          </div>

          {content.map_coordinates.lat !== 0 &&
            content.map_coordinates.lng !== 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <a
                  href={`https://www.google.com/maps?q=${content.map_coordinates.lat},${content.map_coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View on Google Maps →
                </a>
              </div>
            )}
        </div>

        {/* Save Button (bottom) */}
        <div className="flex justify-end">
          <Button onClick={handleSave} isLoading={saving}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
