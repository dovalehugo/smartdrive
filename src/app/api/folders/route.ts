import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient()

  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')

    // Build query
    let query = supabase
      .from('folders')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    // Filter by parent folder
    if (parentId) {
      query = query.eq('parent_id', parentId)
    } else {
      query = query.is('parent_id', null)
    }

    const { data: folders, error } = await query

    if (error) {
      console.error('Error fetching folders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch folders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: folders
    })

  } catch (error) {
    console.error('Unexpected error in folders list:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient()

  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, parent_id } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      )
    }

    // Check if folder with same name exists in the same parent
    const { data: existingFolder } = await supabase
      .from('folders')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name.trim())
      .eq('parent_id', parent_id || null)
      .single()

    if (existingFolder) {
      return NextResponse.json(
        { error: 'A folder with this name already exists' },
        { status: 400 }
      )
    }

    // Create folder
    const { data: folder, error: createError } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        name: name.trim(),
        parent_id: parent_id || null
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating folder:', createError)
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: folder,
      message: 'Folder created successfully'
    })

  } catch (error) {
    console.error('Unexpected error in folder creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

