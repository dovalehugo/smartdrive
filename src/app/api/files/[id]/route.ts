import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: file, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: file
    })

  } catch (error) {
    console.error('Unexpected error in file get:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { name, folder_id } = body

    // Verify file ownership
    const { data: existingFile, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Update file
    const { data: updatedFile, error: updateError } = await supabase
      .from('files')
      .update({
        name: name || existingFile.name,
        folder_id: folder_id !== undefined ? folder_id : existingFile.folder_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating file:', updateError)
      return NextResponse.json(
        { error: 'Failed to update file' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedFile,
      message: 'File updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error in file update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get file info
    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([file.storage_path])

    if (storageError) {
      console.error('Error deleting from storage:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (dbError) {
      console.error('Error deleting from database:', dbError)
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      )
    }

    // Update user storage usage
    const { data: profile } = await supabase
      .from('profiles')
      .select('storage_used')
      .eq('id', user.id)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          storage_used: Math.max(0, profile.storage_used - file.size),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error in file delete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

