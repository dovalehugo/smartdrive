import { createServerComponentClient } from './supabase'
import { createClientComponentClient } from './supabase-client'
import { redirect } from 'next/navigation'
import type { User } from '@/types'

export async function getUser(): Promise<User | null> {
  const supabase = createServerComponentClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user profile from our profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return profile
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  
  if (user.role !== 'admin') {
    redirect('/dashboard')
  }
  
  return user
}

export async function signOut() {
  const supabase = createClientComponentClient()
  await supabase.auth.signOut()
}

export function useAuth() {
  // This will be implemented as a React hook for client components
  const supabase = createClientComponentClient()
  
  return {
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    },
    
    signUp: async (email: string, password: string, fullName: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { data, error }
    },
    
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      return { error }
    },
    
    resetPassword: async (email: string) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { data, error }
    },
  }
}

