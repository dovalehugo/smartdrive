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
    const folderId = searchParams.get('folderId')
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('files')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    // Filter by folder
    if (folderId) {
      query = query.eq('folder_id', folderId)
    } else {
      query = query.is('folder_id', null)
    }

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,original_name.ilike.%${search}%`)
    }

    // Type filter
    if (type && type !== 'all') {
      switch (type) {
        case 'image':
          query = query.like('type', 'image/%')
          break
        case 'video':
          query = query.like('type', 'video/%')
          break
        case 'audio':
          query = query.like('type', 'audio/%')
          break
        case 'document':
          query = query.or('type.like.application/%,type.like.text/%')
          break
      }
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: files, error: filesError, count } = await query

    if (filesError) {
      console.error('Error fetching files:', filesError)
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: files,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Unexpected error in files list:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

