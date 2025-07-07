import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient()

  try {
    // Check authentication and admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get total files
    const { count: totalFiles } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })

    // Get total storage used
    const { data: storageData } = await supabase
      .from('profiles')
      .select('storage_used')

    const totalStorage = storageData?.reduce((sum, profile) => sum + (profile.storage_used || 0), 0) || 0

    // Get active users (users who have uploaded files in the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: activeUsersData } = await supabase
      .from('files')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const activeUsers = new Set(activeUsersData?.map(file => file.user_id) || []).size

    // Get new users this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: newUsersThisMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())

    // Get storage usage by type
    const { data: filesData } = await supabase
      .from('files')
      .select('type, size')

    const storageByType = {
      images: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      others: 0
    }

    filesData?.forEach(file => {
      if (file.type.startsWith('image/')) {
        storageByType.images += file.size
      } else if (file.type.startsWith('video/')) {
        storageByType.videos += file.size
      } else if (file.type.startsWith('audio/')) {
        storageByType.audio += file.size
      } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
        storageByType.documents += file.size
      } else {
        storageByType.others += file.size
      }
    })

    const stats = {
      totalUsers: totalUsers || 0,
      totalFiles: totalFiles || 0,
      totalStorage,
      activeUsers,
      newUsersThisMonth: newUsersThisMonth || 0,
      storageUsageByType: storageByType
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Unexpected error in admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

