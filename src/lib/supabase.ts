import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createServerComponentClient() {s
  const cookieStore = cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export function createRouteHandlerClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
// Cliente con service role para operaciones administrativas
export const createServiceRoleClient = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          storage_used: number
          storage_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          storage_used?: number
          storage_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          storage_used?: number
          storage_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          name: string
          original_name: string
          size: number
          type: string
          folder_id: string | null
          storage_path: string
          public_url: string | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          original_name: string
          size: number
          type: string
          folder_id?: string | null
          storage_path: string
          public_url?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          original_name?: string
          size?: number
          type?: string
          folder_id?: string | null
          storage_path?: string
          public_url?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

