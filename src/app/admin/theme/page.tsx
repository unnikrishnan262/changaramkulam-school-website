'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ThemeSettings {
  id: string
  setting_name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  hero_bg_opacity: number
}

export default function ThemeSettingsPage() {
  const [settings, setSettings] = useState<ThemeSettings>({
    id: '',
    setting_name: 'default',
    primary_color: '#2563eb',
    secondary_color: '#4f46e5',
    accent_color: '#06b6d4',
    hero_bg_opacity: 0.3,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('setting_name', 'default')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching theme settings:', error)
      setMessage('Failed to load theme settings')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Check if default settings exist
      const { data: existing } = await supabase
        .from('theme_settings')
        .select('id')
        .eq('setting_name', 'default')
        .single()

      let error

      if (existing) {
        // Update existing settings
        const result = await supabase
          .from('theme_settings')
          .update({
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            accent_color: settings.accent_color,
            hero_bg_opacity: settings.hero_bg_opacity,
            updated_by: user?.id,
          })
          .eq('setting_name', 'default')

        error = result.error
      } else {
        // Insert new settings
        const result = await supabase
          .from('theme_settings')
          .insert({
            setting_name: 'default',
            primary_color: settings.primary_color,
            secondary_color: settings.secondary_color,
            accent_color: settings.accent_color,
            hero_bg_opacity: settings.hero_bg_opacity,
            updated_by: user?.id,
          })

        error = result.error
      }

      if (error) throw error

      setMessage('Theme settings saved successfully! Refresh the page to see changes.')
      setTimeout(() => setMessage(''), 5000)
    } catch (error: any) {
      console.error('Error saving theme settings:', error)
      setMessage(`Failed to save theme settings: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const resetToDefault = () => {
    setSettings({
      ...settings,
      primary_color: '#2563eb',
      secondary_color: '#4f46e5',
      accent_color: '#06b6d4',
      hero_bg_opacity: 0.3,
    })
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
        <h1 className="text-3xl font-bold text-gray-900">Theme Settings</h1>
        <div className="flex gap-3">
          <Button onClick={resetToDefault} variant="secondary">
            Reset to Default
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            Save Changes
          </Button>
        </div>
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

      <div className="space-y-6">
        {/* Color Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Color Scheme</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="#2563eb"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used for buttons, links, and primary UI elements
              </p>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.secondary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, secondary_color: e.target.value })
                  }
                  className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, secondary_color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="#4f46e5"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used for gradients and accents
              </p>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.accent_color}
                  onChange={(e) =>
                    setSettings({ ...settings, accent_color: e.target.value })
                  }
                  className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accent_color}
                  onChange={(e) =>
                    setSettings({ ...settings, accent_color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="#06b6d4"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used for highlights and special elements
              </p>
            </div>
          </div>
        </div>

        {/* Hero Background Opacity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">
            Home Page Hero Background
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image Opacity: {Math.round(settings.hero_bg_opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.hero_bg_opacity}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero_bg_opacity: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Transparent (0%)</span>
              <span>Opaque (100%)</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Controls the visibility of the background image on the home page hero section.
              Upload the image in <strong>Admin → Home Page</strong>.
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Preview</h2>

          <div className="space-y-4">
            {/* Button Preview */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Buttons:</p>
              <div className="flex gap-3">
                <button
                  style={{ backgroundColor: settings.primary_color }}
                  className="px-6 py-2 text-white rounded-lg font-medium"
                >
                  Primary Button
                </button>
                <button
                  style={{ backgroundColor: settings.secondary_color }}
                  className="px-6 py-2 text-white rounded-lg font-medium"
                >
                  Secondary Button
                </button>
                <button
                  style={{ backgroundColor: settings.accent_color }}
                  className="px-6 py-2 text-white rounded-lg font-medium"
                >
                  Accent Button
                </button>
              </div>
            </div>

            {/* Gradient Preview */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Hero Gradient:</p>
              <div
                style={{
                  background: `linear-gradient(to bottom right, ${settings.primary_color}, ${settings.secondary_color})`,
                }}
                className="h-32 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              >
                Hero Section Preview
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button onClick={resetToDefault} variant="secondary">
            Reset to Default
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
