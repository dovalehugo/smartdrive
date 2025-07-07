import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient()

  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return NextResponse.json(
        { error: 'Error signing out' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully signed out' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error during sign out:', error)
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    )
  }
}

