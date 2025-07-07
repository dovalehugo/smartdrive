import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`)
      }

      if (data.user) {
        // Check if user profile exists, if not create one
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || null,
              role: 'user',
              storage_used: 0,
              storage_limit: 5 * 1024 * 1024 * 1024, // 5GB default
            })

          if (insertError) {
            console.error('Error creating user profile:', insertError)
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`)
    }
  }

  // Redirect to dashboard after successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}

