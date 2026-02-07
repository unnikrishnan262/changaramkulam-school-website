'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AboutContent } from '@/types/content.types'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUploader from '@/components/admin/ImageUploader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function AboutPageAdmin() {
  const [content, setContent] = useState<AboutContent>({
    history: '',
    mission: '',
    vision: '',
    principal_message: '',
    principal_name: '',
    principal_image: '',
    faculty: [],
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
        .eq('page_name', 'about')
        .single()

      if (error) throw error

      if (data?.content) {
        setContent(data.content as AboutContent)
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
        .eq('page_name', 'about')

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

  const addFaculty = () => {
    setContent({
      ...content,
      faculty: [
        ...content.faculty,
        { name: '', position: '', photo: '', qualification: '' },
      ],
    })
  }

  const removeFaculty = (index: number) => {
    setContent({
      ...content,
      faculty: content.faculty.filter((_, i) => i !== index),
    })
  }

  const updateFaculty = (
    index: number,
    field: keyof typeof content.faculty[0],
    value: string
  ) => {
    const newFaculty = [...content.faculty]
    newFaculty[index][field] = value
    setContent({ ...content, faculty: newFaculty })
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
        <h1 className="text-3xl font-bold text-gray-900">Manage About Page</h1>
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
        {/* School History */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">School History</h2>
          <RichTextEditor
            content={content.history}
            onChange={(html) => setContent({ ...content, history: html })}
            placeholder="Write about the school's history..."
          />
        </div>

        {/* Mission */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Mission</h2>
          <RichTextEditor
            content={content.mission}
            onChange={(html) => setContent({ ...content, mission: html })}
            placeholder="Our mission statement..."
          />
        </div>

        {/* Vision */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Vision</h2>
          <RichTextEditor
            content={content.vision}
            onChange={(html) => setContent({ ...content, vision: html })}
            placeholder="Our vision statement..."
          />
        </div>

        {/* Principals Message */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Principal&apos;s Message</h2>

          <div className="space-y-4">
            <Input
              label="Principal Name"
              value={content.principal_name || ''}
              onChange={(e) =>
                setContent({ ...content, principal_name: e.target.value })
              }
              placeholder="Name of the Principal"
            />

            <ImageUploader
              bucket="pages"
              label="Principal Photo"
              currentImage={content.principal_image}
              onUpload={(url) =>
                setContent({ ...content, principal_image: url })
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <RichTextEditor
                content={content.principal_message}
                onChange={(html) =>
                  setContent({ ...content, principal_message: html })
                }
                placeholder="Principal's message to students and parents..."
              />
            </div>
          </div>
        </div>

        {/* Faculty */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Faculty Members</h2>
            <Button onClick={addFaculty} size="sm" variant="secondary">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </div>

          <div className="space-y-4">
            {content.faculty.map((faculty, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-700">
                    Faculty Member {index + 1}
                  </h3>
                  <button
                    onClick={() => removeFaculty(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Name"
                    value={faculty.name}
                    onChange={(e) =>
                      updateFaculty(index, 'name', e.target.value)
                    }
                    placeholder="Teacher name"
                  />
                  <Input
                    label="Position/Subject"
                    value={faculty.position}
                    onChange={(e) =>
                      updateFaculty(index, 'position', e.target.value)
                    }
                    placeholder="e.g., Mathematics Teacher"
                  />
                  <Input
                    label="Qualification"
                    value={faculty.qualification || ''}
                    onChange={(e) =>
                      updateFaculty(index, 'qualification', e.target.value)
                    }
                    placeholder="e.g., M.A., B.Ed"
                  />
                  <ImageUploader
                    bucket="pages"
                    label="Photo"
                    currentImage={faculty.photo}
                    onUpload={(url) => updateFaculty(index, 'photo', url)}
                  />
                </div>
              </div>
            ))}

            {content.faculty.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No faculty members added yet. Click &quot;Add Faculty&quot; to create one.
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
