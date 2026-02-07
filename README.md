# Changaramkulam U P School Website

Official website for Changaramkulam U P School with a modern, responsive design and full admin portal for content management.

## Features

- **Public Pages:** Home, About, Events, Gallery, Contact
- **Admin Portal:** Full content management system with role-based access
- **AI Chatbot:** Powered by Claude API for answering school-related questions
- **Dynamic Content:** All content manageable through admin interface
- **SEO Optimized:** Dynamic meta tags and Open Graph support
- **Responsive Design:** Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **AI:** Claude API (Anthropic)
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Anthropic API key (for chatbot)

### Installation

1. Clone the repository and navigate to the project directory:

```bash
cd website
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `ANTHROPIC_API_KEY` - Your Claude API key

4. Set up Supabase:

- Create a new project at [supabase.com](https://supabase.com)
- Run the database migration (see `supabase/migrations/001_initial_schema.sql`)
- Create storage buckets: `gallery`, `events`, `pages`

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

### Creating the First Admin User

1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Create a new user with email and password
4. Go to Table Editor > profiles
5. Insert a new row with:
   - `id`: (the user ID from auth.users)
   - `email`: (the user's email)
   - `role`: `super_admin`
   - `full_name`: (admin's name)

## Project Structure

```
website/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and clients
│   ├── types/            # TypeScript type definitions
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── supabase/             # Database migrations and seeds
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Configure Custom Domain

1. Add your domain (changaramkulamupschool.in) in Vercel dashboard
2. Update DNS records as instructed by Vercel
3. SSL certificate will be automatically provisioned

## Admin Portal Access

Access the admin portal at `/login`. Use the credentials of the admin user you created in Supabase.

## License

Private - All rights reserved by Changaramkulam U P School

## Support

For technical support or questions, contact the development team.
