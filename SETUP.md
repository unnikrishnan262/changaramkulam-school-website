# Setup Guide - Changaramkulam U P School Website

## Current Progress

Phase 1 (Foundation) ✅ **COMPLETED**
- Next.js 14 project initialized with TypeScript
- All dependencies installed
- Project folder structure created
- Database schema prepared
- Type definitions created

Phase 2 (Authentication) ✅ **COMPLETED**
- Supabase auth clients implemented
- Middleware for route protection created
- Login page with form validation built
- Admin layout with sidebar completed
- useAuth hook implemented

## Next Steps Required

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (if you haven't already)
2. Click "New Project"
3. Fill in:
   - **Project Name:** Changaramkulam School
   - **Database Password:** (Choose a strong password and save it)
   - **Region:** Choose closest to your location
   - **Pricing Plan:** Free (sufficient for school website)
4. Wait for the project to be created (takes ~2 minutes)

### Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon (public) key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`) - Keep this secret!

### Step 3: Configure Environment Variables

1. Create a file named `.env.local` in the project root
2. Copy the contents from `.env.example`
3. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. For now, leave the other variables empty (we'll configure them later):
   - ANTHROPIC_API_KEY (for chatbot - Phase 7)
   - RESEND_API_KEY (optional email notifications)
   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (for map - Phase 5)

### Step 4: Deploy Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `/supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" (bottom right)
6. You should see "Success. No rows returned"

### Step 5: Create Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Click "Create bucket"
3. Create three public buckets:
   - Name: `gallery`, Public: Yes
   - Name: `events`, Public: Yes
   - Name: `pages`, Public: Yes

### Step 6: Create Your First Admin User

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Fill in:
   - **Email:** your email address
   - **Password:** choose a strong password
   - **Auto Confirm User:** Yes
4. Click "Create user"
5. Copy the user ID (looks like: `uuid`)

6. Go to **Table Editor** > **profiles**
7. Click "Insert row"
8. Fill in:
   - **id:** Paste the user ID you copied
   - **email:** Your email address
   - **full_name:** Your name
   - **role:** super_admin (important!)
9. Click "Save"

### Step 7: Start Development Server

```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000)

### Step 8: Test Authentication

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Login with the credentials you created
3. You should be redirected to the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

## What's Working Now

1. ✅ Public home page (basic)
2. ✅ Login page with authentication
3. ✅ Admin dashboard with sidebar navigation
4. ✅ Protected admin routes
5. ✅ Role-based access control
6. ✅ Database schema with all tables
7. ✅ Type-safe database operations

## What's Next (Remaining Phases)

**Phase 3: Core Admin CMS** (Next Priority)
- Rich text editor component
- Image uploader component
- Admin pages for Home, About, Contact content management

**Phase 4: Events & Gallery**
- Events management (create, edit, publish)
- Gallery management with categories

**Phase 5: Public Pages**
- Complete all public pages (Home, About, Events, Gallery, Contact)
- Dynamic content loading from database
- Contact form

**Phase 6: SEO & Advanced**
- SEO settings management
- User management
- Performance optimization

**Phase 7: Chatbot**
- AI-powered chatbot using Claude API

**Phase 8-9: Testing & Deployment**
- Testing and bug fixes
- Deploy to Vercel
- Configure custom domain

## Troubleshooting

### Error: "Invalid API Key"
- Check that you've copied the correct keys from Supabase
- Ensure no extra spaces in `.env.local`
- Restart the dev server after adding env variables

### Error: "User not found"
- Make sure you created the profile record in the `profiles` table
- Verify the user ID matches between auth.users and profiles tables

### Database Connection Error
- Verify your Supabase project URL is correct
- Check that RLS policies are enabled (run the schema script)

### Can't access admin pages
- Ensure the user has `super_admin` or `editor` role in profiles table
- Clear browser cookies and try logging in again

## Need Help?

If you encounter any issues during setup, check:
1. Supabase project is active and accessible
2. Environment variables are correctly set
3. Database schema has been deployed
4. Storage buckets are created
5. Admin user profile exists with correct role

## Ready to Continue?

Once you've completed these setup steps, let me know and I can continue with:
- Phase 3: Building the content management system
- Creating rich text editors
- Building image upload functionality
- Implementing the remaining admin pages

Just say "Continue with Phase 3" and I'll proceed with the implementation!
