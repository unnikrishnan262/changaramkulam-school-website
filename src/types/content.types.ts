export interface HomeContent {
  hero_title: string
  hero_subtitle: string
  hero_image?: string
  welcome_message: string
  highlights: {
    title: string
    description: string
    icon?: string
  }[]
}

export interface AboutContent {
  history: string
  mission: string
  vision: string
  principal_message: string
  principal_name?: string
  principal_image?: string
  faculty: {
    name: string
    position: string
    photo?: string
    qualification?: string
  }[]
}

export interface ContactContent {
  phone: string
  email: string
  address: string
  facebook_url?: string
  map_coordinates: {
    lat: number
    lng: number
  }
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  event_date: string | null
  start_time?: string | null
  end_time?: string | null
  location?: string | null
  featured_image?: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description?: string | null
  image_url: string
  thumbnail_url?: string | null
  category?: string | null
  display_order: number
  created_at: string
}

export interface SEOSettings {
  id: string
  page_path: string
  meta_title?: string | null
  meta_description?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  keywords?: string[] | null
  updated_at: string
}

export interface ChatbotKnowledge {
  id: string
  question: string
  answer: string
  category?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  status: 'new' | 'read' | 'responded'
  created_at: string
}
