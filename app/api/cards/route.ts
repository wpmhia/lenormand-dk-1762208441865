import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const querySchema = z.object({
  search: z.string().optional(),
  limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  offset: z.string().optional().transform(val => val ? parseInt(val) : undefined),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { search, limit, offset } = querySchema.parse({
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    })

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { keywords: { hasSome: [search] } },
            { uprightMeaning: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const cards = await prisma.card.findMany({
      where,
      orderBy: { id: 'asc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.card.count({ where })

    return NextResponse.json({
      cards,
      total,
      hasMore: offset ? total > offset + cards.length : total > cards.length,
    })
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    )
  }
}