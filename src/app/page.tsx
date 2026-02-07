import { createClient } from '@/lib/supabase/server'
import { HomeContent } from '@/types/content.types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/public/Hero'
import Chatbot from '@/components/public/Chatbot'

export const revalidate = 3600 // Revalidate every hour (ISR)

export default async function HomePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('page_content')
    .select('content')
    .eq('page_name', 'home')
    .single()

  const homeContent: HomeContent = (data as any)?.content || {
    hero_title: 'Welcome to Changaramkulam U P School',
    hero_subtitle: "Building Tomorrow's Leaders Today",
    welcome_message: '<p>Welcome to our school where we nurture young minds.</p>',
    highlights: [],
  }

  // Fetch theme settings
  const { data: themeData } = await supabase
    .from('theme_settings')
    .select('*')
    .eq('setting_name', 'default')
    .single()

  const themeSettings = themeData || {
    primary_color: '#2563eb',
    secondary_color: '#4f46e5',
    accent_color: '#06b6d4',
    hero_bg_opacity: 0.3,
  }

  return (
    <>
      <Header />
      <main>
        <Hero
          content={homeContent}
          bgOpacity={themeSettings.hero_bg_opacity}
          primaryColor={themeSettings.primary_color}
          secondaryColor={themeSettings.secondary_color}
        />

        {/* Welcome Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Welcome
            </h2>
            <div
              className="prose prose-lg max-w-none text-center"
              dangerouslySetInnerHTML={{ __html: homeContent.welcome_message }}
            />
          </div>
        </section>

        {/* Highlights Section */}
        {homeContent.highlights && homeContent.highlights.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {homeContent.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}
