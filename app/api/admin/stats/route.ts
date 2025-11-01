import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Simple admin check - in production, use proper role-based access
    if (!session?.user?.email || !session.user.email.includes('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get overall statistics
    const [
      totalUsers,
      totalReadings,
      publicReadings,
      totalDraws,
      recentReadings,
      topCards,
      userStats
    ] = await Promise.all([
      prisma.user.count(),
      prisma.reading.count(),
      prisma.reading.count({ where: { isPublic: true } }),
      prisma.drawStat.aggregate({
        _sum: { count: true }
      }),
      prisma.reading.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.drawStat.findMany({
        include: {
          card: true,
        },
        orderBy: { count: 'desc' },
        take: 10,
      }),
      prisma.user.findMany({
        include: {
          _count: {
            select: {
              readings: true,
            },
          },
          drawStats: {
            include: {
              card: true,
            },
          },
        },
        orderBy: {
          readings: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
    ])

    // Calculate additional stats
    const avgReadingsPerUser = totalUsers > 0 ? totalReadings / totalUsers : 0
    const publicPercentage = totalReadings > 0 ? (publicReadings / totalReadings) * 100 : 0

    return NextResponse.json({
      overview: {
        totalUsers,
        totalReadings,
        publicReadings,
        publicPercentage: Math.round(publicPercentage),
        totalDraws: totalDraws._sum.count || 0,
        avgReadingsPerUser: Math.round(avgReadingsPerUser * 10) / 10,
      },
      recentReadings,
      topCards,
      topUsers: userStats.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        readingCount: user._count.readings,
        totalDraws: user.drawStats.reduce((sum, stat) => sum + stat.count, 0),
      })),
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}