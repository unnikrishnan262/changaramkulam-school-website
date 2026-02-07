'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SEOSettings } from '@/types/content.types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const PAGES = [
  { path: '/', name: 'Home Page' },
  { path: '/about', name: 'About Page' },
  { path: '/events', name: 'Events Page' },
  { path: '/gallery', name: 'Gallery Page' },
  { path: '/contact', name: 'Contact Page' },
]

export default function SEOSettingsPage() {
  const [selectedPage, setSelectedPage] = useState('/')
  const [settings, setSettings] = useState<SEOSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const fetchSettings = useCallback(async (pagePath: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_path', pagePath)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      setSettings(
        data || {
          id: '',
          page_path: pagePath,
          meta_title: '',
          meta_description: '',
          og_title: '',
          og_description: '',
          og_image: '',
          keywords: [],
          updated_at: '',
        }
      )
    } catch (error) {
      console.error('Error fetching SEO settings:', error)
      setMessage('Failed to load SEO settings')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSettings(selectedPage)
  }, [selectedPage, fetchSettings])

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setMessage('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const settingsData = {
        page_path: settings.page_path,
        meta_title: settings.meta_title || null,
        meta_description: settings.meta_description || null,
        og_title: settings.og_title || null,
        og_description: settings.og_description || null,
        og_image: settings.og_image || null,
        keywords: settings.keywords || [],
        updated_by: user?.id,
      }

      // Check if settings exist
      const { data: existing } = await supabase
        .from('seo_settings')
        .select('id')
        .eq('page_path', settings.page_path)
        .single()

      let error

      if (existing) {
        const result = await (supabase
          .from('seo_settings') as any)
          .update(settingsData)
          .eq('page_path', settings.page_path)
        error = result.error
      } else {
        const result = await (supabase.from('seo_settings') as any).insert([settingsData])
        error = result.error
      }

      if (error) throw error

      setMessage('SEO settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving SEO settings:', error)
      setMessage('Failed to save SEO settings')
    } finally {
      setSaving(false)
    }
  }

  const handleKeywordsChange = (value: string) => {
    if (!settings) return
    const keywords = value.split(',').map((k) => k.trim()).filter(Boolean)
    setSettings({ ...settings, keywords })
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
        <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
        <Button onClick={handleSave} isLoading={saving}>
          Save Settings
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

      {/* Page Selector */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Page</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PAGES.map((page) => (
            <button
              key={page.path}
              onClick={() => setSelectedPage(page.path)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedPage === page.path
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{page.name}</div>
              <div className="text-sm text-gray-500">{page.path}</div>
            </button>
          ))}
        </div>
      </div>

      {settings && (
        <div className="space-y-6">
          {/* Meta Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Meta Tags</h2>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={settings.meta_title || ''}
                onChange={(e) =>
                  setSettings({ ...settings, meta_title: e.target.value })
                }
                placeholder="Changaramkulam U P School - Home"
              />
              <p className="text-sm text-gray-500">
                Recommended: 50-60 characters. Shows in browser tab and search results.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={settings.meta_description || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      meta_description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Brief description of the page..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 150-160 characters. Shows in search results.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={settings.keywords?.join(', ') || ''}
                  onChange={(e) => handleKeywordsChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="school, education, kerala"
                />
              </div>
            </div>
          </div>

          {/* Open Graph Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Open Graph (Social Media Preview)
            </h2>
            <div className="space-y-4">
              <Input
                label="OG Title"
                value={settings.og_title || ''}
                onChange={(e) =>
                  setSettings({ ...settings, og_title: e.target.value })
                }
                placeholder="Leave empty to use Meta Title"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Description
                </label>
                <textarea
                  value={settings.og_description || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      og_description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Leave empty to use Meta Description"
                />
              </div>

              <Input
                label="OG Image URL"
                type="url"
                value={settings.og_image || ''}
                onChange={(e) =>
                  setSettings({ ...settings, og_image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500">
                Recommended: 1200x630px. Shows when shared on social media.
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Google Search Preview</h2>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-blue-800 mb-1">
                changaramkulamupschool.in {selectedPage !== '/' && selectedPage}
              </div>
              <div className="text-xl text-blue-600 hover:underline cursor-pointer mb-1">
                {settings.meta_title || 'Page Title'}
              </div>
              <div className="text-sm text-gray-600">
                {settings.meta_description || 'Page description will appear here...'}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} isLoading={saving}>
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
