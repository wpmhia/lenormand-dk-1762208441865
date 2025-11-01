import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const readings = await prisma.reading.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.reading.count({
      where: { userId: session.user.id },
    })

    return NextResponse.json({
      readings,
      total,
      hasMore: offset + readings.length < total,
    })
  } catch (error) {
    console.error('Error fetching user readings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch readings' },
      { status: 500 }
    )
  }
}