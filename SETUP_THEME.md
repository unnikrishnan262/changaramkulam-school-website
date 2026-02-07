# Theme Settings Setup Guide

## Step 1: Run the Database Migration

The error occurs because the `theme_settings` table doesn't exist yet in your database.

### Option A: Run via Supabase Dashboard (Recommended)

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (in the left sidebar)
4. Click **"+ New query"**
5. Copy and paste the ENTIRE content from `supabase/migrations/002_theme_settings.sql`
6. Click **"Run"** button
7. You should see "Success. No rows returned"

### Option B: Quick SQL (Copy this)

If you prefer, just copy and run this SQL directly:

```sql
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
```

## Step 2: Verify the Table Was Created

Run this query to check:

```sql
SELECT * FROM public.theme_settings;
```

You should see one row with the default theme settings.

## Step 3: Test Theme Settings

1. Go back to your website
2. Log into admin panel: http://localhost:3000/admin
3. Click **"Theme Settings"** in the sidebar
4. Try changing a color or the opacity slider
5. Click **"Save Changes"**
6. You should see "Theme settings saved successfully!"

## Step 4: See Your Changes

1. Go to the home page: http://localhost:3000
2. The hero section should now use your custom colors
3. If you uploaded a background image in **Admin → Home Page**, the opacity slider will control how visible it is

## Troubleshooting

### Error: "Failed to save theme settings"
- Make sure you ran the migration SQL (Step 1)
- Check the browser console for detailed error messages
- The error message now shows the specific error - check what it says

### Error: "relation 'theme_settings' does not exist"
- The migration wasn't run successfully
- Go back to Step 1 and run the SQL again

### Changes don't appear on the website
- The website caches content for 1 hour (ISR)
- To see changes immediately, restart your dev server:
  ```bash
  # Stop the server (Ctrl+C) and restart:
  npm run dev
  ```
- Or hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## What Got Updated

The improved save handler now:
- Shows specific error messages (helps with debugging)
- Checks if settings exist before trying to update
- Handles both insert and update operations correctly
- Provides better error feedback in the UI
