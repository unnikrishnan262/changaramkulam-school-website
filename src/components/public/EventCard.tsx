import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types/content.types'
import { formatDate, formatTime } from '@/lib/utils/date'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {event.featured_image && (
          <div className="relative h-48 bg-gray-200">
            <Image
              src={event.featured_image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            {event.event_date && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
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
                {formatDate(event.event_date)}
              </span>
            )}
            {event.start_time && (
              <span className="ml-4">
                {formatTime(event.start_time)}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-gray-600 line-clamp-3">{event.description}</p>
          )}
          {event.location && (
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
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
              {event.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
