import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { AboutContent } from '@/types/content.types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const revalidate = 86400 // Revalidate every 24 hours

export default async function AboutPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('page_content')
    .select('content')
    .eq('page_name', 'about')
    .single()

  const aboutContent: AboutContent = data?.content || {
    history: '<p>Our school has a rich history.</p>',
    mission: '<p>To provide quality education.</p>',
    vision: '<p>To be a leading institution.</p>',
    principal_message: '<p>Welcome message from the Principal.</p>',
    faculty: [],
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
            <p className="mt-4 text-xl text-blue-100">
              Learn more about our school
            </p>
          </div>
        </div>

        {/* School History */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Our History
            </h2>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: aboutContent.history }}
            />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">
                  Our Mission
                </h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: aboutContent.mission }}
                />
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">
                  Our Vision
                </h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: aboutContent.vision }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Principal's Message */}
        {aboutContent.principal_message && (
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Principal's Message
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                {aboutContent.principal_image && (
                  <div className="float-left mr-6 mb-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                      <Image
                        src={aboutContent.principal_image}
                        alt={aboutContent.principal_name || 'Principal'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {aboutContent.principal_name && (
                      <p className="text-center mt-2 font-semibold text-gray-900">
                        {aboutContent.principal_name}
                      </p>
                    )}
                  </div>
                )}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: aboutContent.principal_message,
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Faculty */}
        {aboutContent.faculty && aboutContent.faculty.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
                Our Faculty
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {aboutContent.faculty.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {member.photo && (
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 text-sm">{member.position}</p>
                      {member.qualification && (
                        <p className="text-gray-600 text-sm mt-1">
                          {member.qualification}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
