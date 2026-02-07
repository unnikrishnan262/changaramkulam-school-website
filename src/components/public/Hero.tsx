import { HomeContent } from '@/types/content.types'

interface HeroProps {
  content: HomeContent
  bgOpacity?: number
  primaryColor?: string
  secondaryColor?: string
}

export default function Hero({ content, bgOpacity = 0.3, primaryColor = '#2563eb', secondaryColor = '#4f46e5' }: HeroProps) {
  return (
    <div
      className="relative text-white"
      style={{
        background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`
      }}
    >
      {/* Background Image (if provided) */}
      {content.hero_image && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${content.hero_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgOpacity,
          }}
        />
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {content.hero_title || 'Welcome to Changaramkulam U P School'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            {content.hero_subtitle || "Building Tomorrow's Leaders Today"}
          </p>
        </div>
      </div>
    </div>
  )
}
