'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HomeContent } from '@/types/content.types'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUploader from '@/components/admin/ImageUploader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function HomePageAdmin() {
  const [content, setContent] = useState<HomeContent>({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    welcome_message: '',
    highlights: [],
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
        .eq('page_name', 'home')
        .single()

      if (error) throw error

      if (data?.content) {
        setContent(data.content as HomeContent)
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
        .eq('page_name', 'home')

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

  const addHighlight = () => {
    setContent({
      ...content,
      highlights: [
        ...content.highlights,
        { title: '', description: '', icon: '' },
      ],
    })
  }

  const removeHighlight = (index: number) => {
    setContent({
      ...content,
      highlights: content.highlights.filter((_, i) => i !== index),
    })
  }

  const updateHighlight = (
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    const newHighlights = [...content.highlights]
    newHighlights[index][field] = value
    setContent({ ...content, highlights: newHighlights })
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Home Page</h1>
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
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hero Section</h2>

          <div className="space-y-4">
            <Input
              label="Hero Title"
              value={content.hero_title}
              onChange={(e) =>
                setContent({ ...content, hero_title: e.target.value })
              }
              placeholder="Welcome to Changaramkulam U P School"
            />

            <Input
              label="Hero Subtitle"
              value={content.hero_subtitle}
              onChange={(e) =>
                setContent({ ...content, hero_subtitle: e.target.value })
              }
              placeholder="Building Tomorrow's Leaders Today"
            />

            <ImageUploader
              bucket="pages"
              label="Hero Background Image"
              currentImage={content.hero_image}
              onUpload={(url) =>
                setContent({ ...content, hero_image: url })
              }
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome Message</h2>
          <RichTextEditor
            content={content.welcome_message}
            onChange={(html) =>
              setContent({ ...content, welcome_message: html })
            }
            placeholder="Write a welcome message for visitors..."
          />
        </div>

        {/* Highlights */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Highlights</h2>
            <Button onClick={addHighlight} size="sm" variant="secondary">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Highlight
            </Button>
          </div>

          <div className="space-y-4">
            {content.highlights.map((highlight, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-700">
                    Highlight {index + 1}
                  </h3>
                  <button
                    onClick={() => removeHighlight(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Title"
                    value={highlight.title}
                    onChange={(e) =>
                      updateHighlight(index, 'title', e.target.value)
                    }
                    placeholder="e.g., Quality Education"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={highlight.description}
                      onChange={(e) =>
                        updateHighlight(index, 'description', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Brief description..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {content.highlights.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No highlights added yet. Click &quot;Add Highlight&quot; to create one.
              </p>
            )}
          </div>
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
