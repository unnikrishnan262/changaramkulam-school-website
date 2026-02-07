import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { formatDate, formatTime } from '@/lib/utils/date'

export const revalidate = 3600 // Revalidate every hour

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!event) {
    notFound()
  }

  const eventData = event as any

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Featured Image */}
        {eventData.featured_image && (
          <div className="relative h-96 bg-gray-200">
            <Image
              src={eventData.featured_image}
              alt={eventData.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Event Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {eventData.title}
          </h1>

          {/* Event Meta */}
          <div className="flex flex-wrap gap-6 text-gray-600 mb-8 pb-8 border-b">
            {eventData.event_date && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
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
                <span className="font-medium">
                  {formatDate(eventData.event_date, 'EEEE, MMMM dd, yyyy')}
                </span>
              </div>
            )}

            {eventData.start_time && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {formatTime(eventData.start_time)}
                  {eventData.end_time && ` - ${formatTime(eventData.end_time)}`}
                </span>
              </div>
            )}

            {eventData.location && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{eventData.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {eventData.description && (
            <div className="text-xl text-gray-700 mb-8 leading-relaxed">
              {eventData.description}
            </div>
          )}

          {/* Content */}
          {eventData.content && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: eventData.content }}
            />
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
