-- Theme Settings Table
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT UNIQUE NOT NULL DEFAULT 'default',
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#4f46e5',
  accent_color TEXT DEFAULT '#06b6d4',
  hero_bg_opacity DECIMAL DEFAULT 0.3,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Theme settings are viewable by everyone"
  ON public.theme_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update theme settings"
  ON public.theme_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default theme
INSERT INTO public.theme_settings (setting_name, primary_color, secondary_color, accent_color, hero_bg_opacity)
VALUES ('default', '#2563eb', '#4f46e5', '#06b6d4', 0.3)
ON CONFLICT (setting_name) DO NOTHING;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_theme_settings
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
