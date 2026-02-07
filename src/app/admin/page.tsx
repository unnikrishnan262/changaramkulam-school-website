import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get some basic stats
  const [
    { count: eventsCount },
    { count: galleryCount },
    { count: submissionsCount },
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">
                {eventsCount || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gallery Items</p>
              <p className="text-3xl font-bold text-gray-900">
                {galleryCount || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">New Messages</p>
              <p className="text-3xl font-bold text-gray-900">
                {submissionsCount || 0}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Welcome to Admin Panel
        </h2>
        <p className="text-gray-600 mb-4">
          Here you can manage all content for the Changaramkulam U P School
          website. Use the sidebar to navigate to different sections.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Start</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Update Home Page content</li>
              <li>• Add school events</li>
              <li>• Upload photos to gallery</li>
              <li>• Configure SEO settings</li>
            </ul>
          </div>
          <div className="border-l-4 border-green-500 bg-green-50 p-4">
            <h3 className="font-semibold text-green-900 mb-2">Need Help?</h3>
            <p className="text-sm text-green-800">
              Each page has intuitive controls. Click on any menu item to start
              managing content. Changes are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
