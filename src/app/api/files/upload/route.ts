import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { validateFileType, validateFileSize, generateUniqueFileName } from '@/lib/utils'

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

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderId = formData.get('folderId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    if (!validateFileType(file)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    if (!validateFileSize(file, 50)) {
      return NextResponse.json(
        { error: 'File size exceeds limit (50MB)' },
        { status: 400 }
      )
    }

    // Check storage limit
    if (profile.storage_used + file.size > profile.storage_limit) {
      return NextResponse.json(
        { error: 'Storage limit exceeded' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const uniqueFileName = generateUniqueFileName(file.name)
    const storagePath = `${user.id}/${uniqueFileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(storagePath)

    // Save file metadata to database
    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: user.id,
        name: uniqueFileName,
        original_name: file.name,
        size: file.size,
        type: file.type,
        folder_id: folderId,
        storage_path: storagePath,
        public_url: publicUrl,
        metadata: {
          lastModified: file.lastModified,
          uploadedAt: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Clean up uploaded file
      await supabase.storage.from('files').remove([storagePath])
      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      )
    }

    // Update user storage usage
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        storage_used: profile.storage_used + file.size,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update storage usage:', updateError)
    }

    return NextResponse.json({
      success: true,
      data: fileData,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Unexpected error in file upload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

