-- Changaramkulam U P School Database Schema
-- Version: 1.0.0
-- Description: Initial database schema for school website with content management

-- ============================================================================
-- USER PROFILES
-- ============================================================================

-- Profiles table (extends auth.users with role management)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PAGE CONTENT
-- ============================================================================

-- Page content table (for Home, About, Contact pages)
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT UNIQUE NOT NULL CHECK (page_name IN ('home', 'about', 'contact')),
  content JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EVENTS
-- ============================================================================

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- GALLERY
-- ============================================================================

-- Gallery items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SEO SETTINGS
-- ============================================================================

-- SEO settings table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  keywords TEXT[],
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CHATBOT KNOWLEDGE BASE
-- ============================================================================

-- Chatbot knowledge table
CREATE TABLE IF NOT EXISTS public.chatbot_knowledge (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTACT SUBMISSIONS
-- ============================================================================

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON public.gallery_items(display_order);
CREATE INDEX IF NOT EXISTS idx_seo_page ON public.seo_settings(page_path);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - PROFILES
-- ============================================================================

-- Profiles: Public read, users can update own profile
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES - PAGE CONTENT
-- ============================================================================

-- Page content: Public read, authenticated users can update
CREATE POLICY "Page content is viewable by everyone"
  ON public.page_content FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert page content"
  ON public.page_content FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update page content"
  ON public.page_content FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete page content"
  ON public.page_content FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- RLS POLICIES - EVENTS
-- ============================================================================

-- Events: Public can read published, authenticated can manage all
CREATE POLICY "Published events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert events"
  ON public.events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update events"
  ON public.events FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete events"
  ON public.events FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- RLS POLICIES - GALLERY
-- ============================================================================

-- Gallery: Public read, authenticated users can manage
CREATE POLICY "Gallery items are viewable by everyone"
  ON public.gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert gallery items"
  ON public.gallery_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gallery items"
  ON public.gallery_items FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gallery items"
  ON public.gallery_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- RLS POLICIES - SEO SETTINGS
-- ============================================================================

-- SEO settings: Public read (for metadata), authenticated can update
CREATE POLICY "SEO settings are viewable by everyone"
  ON public.seo_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert SEO settings"
  ON public.seo_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update SEO settings"
  ON public.seo_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete SEO settings"
  ON public.seo_settings FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- RLS POLICIES - CHATBOT KNOWLEDGE
-- ============================================================================

-- Chatbot knowledge: Public read active items, authenticated can manage
CREATE POLICY "Active chatbot knowledge is viewable by everyone"
  ON public.chatbot_knowledge FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert chatbot knowledge"
  ON public.chatbot_knowledge FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update chatbot knowledge"
  ON public.chatbot_knowledge FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete chatbot knowledge"
  ON public.chatbot_knowledge FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- RLS POLICIES - CONTACT SUBMISSIONS
-- ============================================================================

-- Contact submissions: Only authenticated users can read/manage
CREATE POLICY "Authenticated users can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can create contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_page_content
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_events
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_seo_settings
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_chatbot_knowledge
  BEFORE UPDATE ON public.chatbot_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default page content structures
INSERT INTO public.page_content (page_name, content) VALUES
('home', '{"hero_title": "Welcome to Changaramkulam U P School", "hero_subtitle": "Building Tomorrow''s Leaders Today", "hero_image": "", "welcome_message": "<p>Welcome to our school where we nurture young minds and build character.</p>", "highlights": []}'),
('about', '{"history": "<p>Our school has a rich history of excellence in education.</p>", "mission": "<p>To provide quality education and develop well-rounded individuals.</p>", "vision": "<p>To be a leading institution in primary education.</p>", "principal_message": "<p>Welcome message from the Principal.</p>", "principal_name": "", "principal_image": "", "faculty": []}'),
('contact', '{"phone": "", "email": "", "address": "Changaramkulam, Kerala", "facebook_url": "", "map_coordinates": {"lat": 0, "lng": 0}}')
ON CONFLICT (page_name) DO NOTHING;

-- Insert initial SEO settings
INSERT INTO public.seo_settings (page_path, meta_title, meta_description) VALUES
('/', 'Changaramkulam U P School - Home', 'Welcome to Changaramkulam U P School. Building Tomorrow''s Leaders Today.'),
('/about', 'About Us - Changaramkulam U P School', 'Learn about our school''s history, mission, and vision.'),
('/events', 'Events - Changaramkulam U P School', 'Stay updated with school events and activities.'),
('/gallery', 'Gallery - Changaramkulam U P School', 'View photos from our school events and activities.'),
('/contact', 'Contact Us - Changaramkulam U P School', 'Get in touch with Changaramkulam U P School.')
ON CONFLICT (page_path) DO NOTHING;

-- Insert initial chatbot knowledge
INSERT INTO public.chatbot_knowledge (question, answer, category, is_active) VALUES
('What are the school timings?', 'School timings are from 9:00 AM to 3:30 PM, Monday to Friday.', 'timings', true),
('How do I contact the school?', 'You can call us or visit our Contact page for detailed information including phone number, email, and address.', 'contact', true),
('What is the admission process?', 'Please visit the school office with necessary documents including birth certificate, address proof, and previous school records. You can contact us for more details about admission dates.', 'admissions', true),
('What facilities does the school have?', 'Our school has modern classrooms, a well-equipped library, computer lab, playground, and other facilities for holistic development of students.', 'facilities', true),
('Where is the school located?', 'The school is located in Changaramkulam, Kerala. Please visit our Contact page for the exact address and map.', 'contact', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STORAGE BUCKETS (Run these manually in Supabase Dashboard if needed)
-- ============================================================================

-- Note: Storage buckets and their policies need to be created via Supabase Dashboard
-- or using the Supabase Management API. The following are the bucket configurations:
--
-- Bucket: gallery (public: true)
-- Bucket: events (public: true)
-- Bucket: pages (public: true)
--
-- Storage policies for each bucket:
-- - Public can view (SELECT)
-- - Authenticated users can upload (INSERT)
-- - Authenticated users can update (UPDATE)
-- - Authenticated users can delete (DELETE)
