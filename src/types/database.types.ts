// Generated types for Supabase database
// These types will be automatically updated when you run: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'super_admin' | 'editor'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'super_admin' | 'editor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'super_admin' | 'editor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      page_content: {
        Row: {
          id: string
          page_name: 'home' | 'about' | 'contact'
          content: Json
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          page_name: 'home' | 'about' | 'contact'
          content: Json
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          page_name?: 'home' | 'about' | 'contact'
          content?: Json
          updated_by?: string | null
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          content: string | null
          event_date: string | null
          start_time: string | null
          end_time: string | null
          location: string | null
          featured_image: string | null
          status: 'draft' | 'published' | 'archived'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          content?: string | null
          event_date?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          content?: string | null
          event_date?: string | null
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gallery_items: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          category: string | null
          display_order: number
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          category?: string | null
          display_order?: number
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          category?: string | null
          display_order?: number
          created_by?: string | null
          created_at?: string
        }
      }
      seo_settings: {
        Row: {
          id: string
          page_path: string
          meta_title: string | null
          meta_description: string | null
          og_title: string | null
          og_description: string | null
          og_image: string | null
          keywords: string[] | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          page_path: string
          meta_title?: string | null
          meta_description?: string | null
          og_title?: string | null
          og_description?: string | null
          og_image?: string | null
          keywords?: string[] | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          page_path?: string
          meta_title?: string | null
          meta_description?: string | null
          og_title?: string | null
          og_description?: string | null
          og_image?: string | null
          keywords?: string[] | null
          updated_by?: string | null
          updated_at?: string
        }
      }
      chatbot_knowledge: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          status: 'new' | 'read' | 'responded'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: 'new' | 'read' | 'responded'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: 'new' | 'read' | 'responded'
          created_at?: string
        }
      }
      theme_settings: {
        Row: {
          id: string
          setting_name: string
          primary_color: string
          secondary_color: string
          accent_color: string
          hero_bg_opacity: number
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          setting_name?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          hero_bg_opacity?: number
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          setting_name?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          hero_bg_opacity?: number
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
